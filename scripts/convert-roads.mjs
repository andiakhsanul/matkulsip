import fs from "node:fs";
import path from "node:path";
import * as shapefile from "shapefile";

const ROOT = path.resolve(process.cwd());
const SOURCE = path.join(ROOT, "JALAN_LN_25K", "JALAN_LN_25K");
const OUT = path.join(ROOT, "public", "data", "roads.geojson");

const ROAD_CLASSES = new Set([
  "Jalan Arteri",
  "Jalan Kolektor",
  "Jalan Lokal",
  "Jalan Lain",
  "Jalan Setapak",
]);

const EARTH_RADIUS_M = 6_371_008.8;
const toRadians = (value) => (value * Math.PI) / 180;
const roundCoord = ([lng, lat]) => [
  Math.round(lng * 1e6) / 1e6,
  Math.round(lat * 1e6) / 1e6,
];

function haversineDistance([lng1, lat1], [lng2, lat2]) {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

function lineLengthMeters(coordinates) {
  let total = 0;
  for (let index = 1; index < coordinates.length; index += 1) {
    total += haversineDistance(coordinates[index - 1], coordinates[index]);
  }
  return total;
}

function cleanLine(coordinates) {
  const cleaned = [];
  for (const coordinate of coordinates) {
    const next = roundCoord(coordinate);
    const previous = cleaned[cleaned.length - 1];
    if (!previous || previous[0] !== next[0] || previous[1] !== next[1]) {
      cleaned.push(next);
    }
  }
  return cleaned;
}

const source = await shapefile.read(
  `${SOURCE}.shp`,
  `${SOURCE}.dbf`,
  { encoding: "utf-8" }
);

const classes = {};
const features = [];

for (const [index, feature] of source.features.entries()) {
  const rawClass = feature.properties?.REMARK;
  const roadClass = ROAD_CLASSES.has(rawClass) ? rawClass : "Jalan Lain";
  const geometry = feature.geometry;
  if (!geometry) continue;

  let coordinates;
  if (geometry.type === "LineString") {
    const line = cleanLine(geometry.coordinates);
    if (line.length < 2) continue;
    coordinates = line;
  } else if (geometry.type === "MultiLineString") {
    const lines = geometry.coordinates
      .map(cleanLine)
      .filter((line) => line.length >= 2);
    if (!lines.length) continue;
    coordinates = lines;
  } else {
    continue;
  }

  const lengthM =
    geometry.type === "LineString"
      ? lineLengthMeters(coordinates)
      : coordinates.reduce((total, line) => total + lineLengthMeters(line), 0);

  features.push({
    type: "Feature",
    properties: {
      id: `road-${String(index + 1).padStart(3, "0")}`,
      roadClass,
      lengthM: Math.round(lengthM),
    },
    geometry: {
      type: geometry.type,
      coordinates,
    },
  });

  const stats = classes[roadClass] ?? { count: 0, lengthM: 0 };
  stats.count += 1;
  stats.lengthM += lengthM;
  classes[roadClass] = stats;
}

const output = {
  type: "FeatureCollection",
  features,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(output));

console.log(`Wrote ${features.length} road segments to ${path.relative(ROOT, OUT)}`);
for (const [label, stats] of Object.entries(classes)) {
  console.log(
    `  ${label.padEnd(14)} ${String(stats.count).padStart(3)} segmen  ${(
      stats.lengthM / 1000
    ).toFixed(1)} km`
  );
}
