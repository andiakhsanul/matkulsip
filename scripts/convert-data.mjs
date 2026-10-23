import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { simplify } from "@turf/simplify";
import { truncate } from "@turf/truncate";
import { cleanCoords } from "@turf/clean-coords";
import { area as turfArea } from "@turf/area";
import { centroid } from "@turf/centroid";

const ROOT = path.resolve(process.cwd());
const LEGACY_DATA = path.join(
  ROOT,
  "legacy",
  "data"
);
const OUT_DATA = path.join(ROOT, "public", "data");
const OUT_FACTORS = path.join(OUT_DATA, "factors");
const OUT_SRC = path.join(ROOT, "src", "data");

const PRIORITY_ORDER = ["Rendah", "Sedang", "Tinggi", "Sangat Tinggi"];
const PRIORITY_COLORS = {
  Rendah: "#d9eff8",
  Sedang: "#8fd3e8",
  Tinggi: "#2e9cc0",
  "Sangat Tinggi": "#0b5e7a",
};

const FILES = {
  priority: "PrioritasPengembanganBlueGreenInfrastructureKotaCirebon_1.js",
  flood: "BahayaBanjirCirebonNew_2.js",
  river: "JarakSungaiCirebonNew_3.js",
  elevation: "KetinggianLahanCirebonNew_4.js",
  slope: "KemiringanLerengCirebonNew_5.js",
  landcover: "TutupanLahanCirebonNew_6.js",
  admin: "Administrasi_Kota_Cirebon_7.js",
};

const SIMPLIFY_TOLERANCE = {
  priority: 0.00001,
  flood: 0.000012,
  river: 0.000012,
  elevation: 0.00001,
  slope: 0.00001,
  landcover: 0.000012,
  admin: 0.000008,
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readLegacyLayer(file) {
  const raw = fs.readFileSync(path.join(LEGACY_DATA, file), "utf8").replace(/^\uFEFF/, "");
  const match = raw.match(/^\s*var\s+\w+\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
  if (!match) throw new Error(`Could not parse ${file}`);
  return JSON.parse(match[1]);
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function geometryHash(geometry) {
  return crypto.createHash("sha1").update(JSON.stringify(geometry)).digest("hex");
}

function cleanFeature(feature, tolerance, id, properties) {
  let next = {
    type: "Feature",
    properties: { id, ...properties },
    geometry: feature.geometry,
  };
  next = cleanCoords(next, { mutate: true });
  next = simplify(next, { tolerance, highQuality: true, mutate: true });
  next = truncate(next, { precision: 6, mutate: true });
  return next;
}

function geometryAreaHa(feature) {
  return turfArea(feature) / 10000;
}

function getRingPoints(feature) {
  const points = [];
  const walk = (coords) => {
    if (typeof coords[0] === "number") {
      points.push(coords);
      return;
    }
    for (const item of coords) walk(item);
  };
  walk(feature.geometry.coordinates);
  return points;
}

function boundsOf(features) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const feature of features) {
    for (const [x, y] of getRingPoints(feature)) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  return [minX, minY, maxX, maxY];
}

function featureCollection(features) {
  return { type: "FeatureCollection", features };
}

function writeJson(file, value) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(value));
  const size = fs.statSync(file).size;
  console.log(`  ${path.relative(ROOT, file)}  ${(size / 1024).toFixed(1)} KB`);
}

function buildAdmin() {
  const source = readLegacyLayer(FILES.admin);
  const features = source.features.map((feature, index) => {
    const kecamatan = feature.properties.WADMKC;
    const next = cleanFeature(
      feature,
      SIMPLIFY_TOLERANCE.admin,
      `admin-${slug(kecamatan)}-${index}`,
      { kecamatan }
    );
    const center = centroid(next).geometry.coordinates;
    next.properties.areaHa = round(geometryAreaHa(next), 2);
    next.properties.center = [round(center[0], 6), round(center[1], 6)];
    return next;
  });
  return featureCollection(features);
}

function buildPriority() {
  const source = readLegacyLayer(FILES.priority);
  const features = source.features.map((feature, index) => {
    const { WADMKC, Prioritas, Luas } = feature.properties;
    return cleanFeature(
      feature,
      SIMPLIFY_TOLERANCE.priority,
      `priority-${slug(WADMKC)}-${slug(Prioritas)}-${index}`,
      {
        kecamatan: WADMKC,
        priority: Prioritas,
        areaHa: round(Number(Luas), 2),
      }
    );
  });
  return featureCollection(features);
}

function buildSimpleLayer(key, file, classField, outputName, propertyName) {
  const source = readLegacyLayer(file);
  const features = source.features.map((feature, index) => {
    const kecamatan = feature.properties.WADMKC;
    const value = feature.properties[classField];
    const extra = {};
    if (key === "slope") extra.classification = feature.properties.klasifikas;
    if (key === "flood") extra.areaHa = round(Number(feature.properties.Luas || 0), 2);
    return cleanFeature(
      feature,
      SIMPLIFY_TOLERANCE[key],
      `${key}-${slug(kecamatan)}-${slug(value)}-${index}`,
      {
        kecamatan,
        ...extra,
        [propertyName]: value,
      }
    );
  });
  return { data: featureCollection(features), outputName };
}

function buildLandcover() {
  const source = readLegacyLayer(FILES.landcover);
  const groups = new Map();
  for (const feature of source.features) {
    const hash = geometryHash(feature.geometry);
    if (!groups.has(hash)) groups.set(hash, []);
    groups.get(hash).push(feature);
  }

  const duplicateGroups = [...groups.values()].filter((group) => group.length > 1);
  const features = [];
  let index = 0;
  for (const group of groups.values()) {
    const visible = group[group.length - 1];
    const classes = [...new Set(group.map((item) => item.properties.Landuse_fi))];
    const kecamatan = visible.properties.WADMKC;
    const next = cleanFeature(
      visible,
      SIMPLIFY_TOLERANCE.landcover,
      `landcover-${slug(kecamatan)}-${index++}`,
      {
        kecamatan,
        landcover: visible.properties.Landuse_fi,
        classes,
        duplicate: group.length > 1,
        areaHa: round(Number(visible.properties.Luas), 2),
      }
    );
    features.push(next);
  }

  return {
    data: featureCollection(features),
    duplicateGroups: duplicateGroups.length,
    duplicateFeatures: duplicateGroups.reduce((sum, group) => sum + group.length, 0),
    totalSourceFeatures: source.features.length,
    uniqueFeatures: features.length,
    sourceAreaHa: round(
      source.features.reduce((sum, item) => sum + Number(item.properties.Luas || 0), 0),
      2
    ),
    uniqueAreaHa: round(
      features.reduce((sum, item) => sum + Number(item.properties.areaHa || 0), 0),
      2
    ),
  };
}

function summarizePriority(priority, admin) {
  const features = priority.features;
  const totalAreaHa = round(
    features.reduce((sum, feature) => sum + Number(feature.properties.areaHa), 0),
    2
  );
  const adminAreaHa = round(
    admin.features.reduce((sum, feature) => sum + Number(feature.properties.areaHa), 0),
    2
  );

  const classes = PRIORITY_ORDER.map((label) => {
    const matching = features.filter((feature) => feature.properties.priority === label);
    const areaHa = round(
      matching.reduce((sum, feature) => sum + Number(feature.properties.areaHa), 0),
      2
    );
    return {
      key: slug(label),
      label,
      areaHa,
      pct: totalAreaHa ? round((areaHa / totalAreaHa) * 100, 2) : 0,
      count: matching.length,
      color: PRIORITY_COLORS[label],
    };
  });

  const kecamatanNames = [...new Set(features.map((feature) => feature.properties.kecamatan))].sort(
    (a, b) => a.localeCompare(b)
  );
  const adminByName = new Map(
    admin.features.map((feature) => [feature.properties.kecamatan, feature])
  );
  const kecamatan = kecamatanNames.map((name) => {
    const matching = features.filter((feature) => feature.properties.kecamatan === name);
    const classMap = Object.fromEntries(
      PRIORITY_ORDER.map((label) => [
        slug(label),
        round(
          matching
            .filter((feature) => feature.properties.priority === label)
            .reduce((sum, feature) => sum + Number(feature.properties.areaHa), 0),
          2
        ),
      ])
    );
    const total = round(
      matching.reduce((sum, feature) => sum + Number(feature.properties.areaHa), 0),
      2
    );
    const adminFeature = adminByName.get(name);
    return {
      name,
      totalAreaHa: total,
      adminAreaHa: adminFeature ? Number(adminFeature.properties.areaHa) : null,
      pctOfAnalyzed: totalAreaHa ? round((total / totalAreaHa) * 100, 2) : 0,
      classes: classMap,
      center: adminFeature ? adminFeature.properties.center : null,
    };
  });

  const highPriorityAreaHa = round(
    classes
      .filter((item) => item.label === "Tinggi" || item.label === "Sangat Tinggi")
      .reduce((sum, item) => sum + item.areaHa, 0),
    2
  );

  return {
    totalAreaHa,
    adminAreaHa,
    classes,
    kecamatan: kecamatan.sort((a, b) => b.totalAreaHa - a.totalAreaHa),
    highPriorityAreaHa,
    highPriorityPct: totalAreaHa ? round((highPriorityAreaHa / totalAreaHa) * 100, 2) : 0,
  };
}

function summarizeClasses(features, property) {
  const map = new Map();
  for (const feature of features) {
    const label = feature.properties[property];
    map.set(label, (map.get(label) || 0) + Number(feature.properties.areaHa || 0));
  }
  return [...map.entries()]
    .map(([label, areaHa]) => ({ label, areaHa: round(areaHa, 2) }))
    .sort((a, b) => b.areaHa - a.areaHa);
}

function main() {
  console.log("Reading legacy qgis2web data…");
  const admin = buildAdmin();
  const priority = buildPriority();
  const flood = buildSimpleLayer("flood", FILES.flood, "Keterangan", "flood.geojson", "hazard");
  const river = buildSimpleLayer("river", FILES.river, "keterangan", "river-distance.geojson", "distanceClass");
  const elevation = buildSimpleLayer("elevation", FILES.elevation, "ket", "elevation.geojson", "elevationClass");
  const slope = buildSimpleLayer("slope", FILES.slope, "slope", "slope.geojson", "slopeClass");
  const landcover = buildLandcover();

  const summary = summarizePriority(priority, admin);
  const bounds = boundsOf(admin.features);
  const center = [
    round((bounds[0] + bounds[2]) / 2, 6),
    round((bounds[1] + bounds[3]) / 2, 6),
  ];

  const floodClasses = summarizeClasses(flood.data.features, "hazard");
  const landcoverClasses = summarizeClasses(landcover.data.features, "landcover");

  const summaryPayload = {
    generatedAt: new Date().toISOString(),
    city: {
      name: "Kota Cirebon",
      bounds,
      center,
    },
    analyzed: {
      totalAreaHa: summary.totalAreaHa,
      adminAreaHa: summary.adminAreaHa,
      gapAreaHa: round(summary.adminAreaHa - summary.totalAreaHa, 2),
    },
    priority: {
      totalAreaHa: summary.totalAreaHa,
      highPriorityAreaHa: summary.highPriorityAreaHa,
      highPriorityPct: summary.highPriorityPct,
      classes: summary.classes,
      kecamatan: summary.kecamatan,
    },
    flood: {
      totalAreaHa: round(
        flood.data.features.reduce(
          (sum, feature) => sum + Number(feature.properties.areaHa || 0),
          0
        ),
        2
      ),
      classes: floodClasses,
    },
    landcover: {
      sourceFeatures: landcover.totalSourceFeatures,
      uniqueFeatures: landcover.uniqueFeatures,
      duplicateGroups: landcover.duplicateGroups,
      duplicateFeatures: landcover.duplicateFeatures,
      sourceAreaHa: landcover.sourceAreaHa,
      uniqueAreaHa: landcover.uniqueAreaHa,
      classes: landcoverClasses,
    },
    factors: {
      slope: summarizeClasses(slope.data.features, "slopeClass"),
      elevation: summarizeClasses(elevation.data.features, "elevationClass"),
      riverDistance: summarizeClasses(river.data.features, "distanceClass"),
    },
    adminCentroids: admin.features.map((feature) => ({
      kecamatan: feature.properties.kecamatan,
      center: feature.properties.center,
      areaHa: feature.properties.areaHa,
    })),
  };

  const metadata = {
    title: "Peta Prioritas Pengembangan Blue-Green Infrastructure di Kota Cirebon",
    shortTitle: "BGI Cirebon",
    description:
      "Atlas digital prioritas pengembangan Blue-Green Infrastructure (BGI) di Kota Cirebon, dibangun dari analisis weighted overlay empat parameter.",
    weights: [
      {
        key: "landcover",
        label: "Tutupan lahan",
        weight: 40,
        description: "Jenis tutupan lahan menentukan kesesuaian lokasi untuk intervensi BGI.",
      },
      {
        key: "slope",
        label: "Kemiringan lereng",
        weight: 25,
        description: "Lereng memengaruhi limpasan permukaan dan kebutuhan resapan air.",
      },
      {
        key: "elevation",
        label: "Elevasi",
        weight: 25,
        description: "Ketinggian lahan memengaruhi arah dan akumulasi limpasan.",
      },
      {
        key: "river",
        label: "Jarak dari sungai",
        weight: 10,
        description: "Kedekatan dengan badan air menjadi pertimbangan konektivitas hidrologi.",
      },
    ],
    sources: [
      "Data hasil analisis weighted overlay BGI Kota Cirebon (legacy qgis2web export)",
      "Batas administrasi Kecamatan Kota Cirebon",
      "Basemap: Esri Light/Dark Gray Canvas dan Esri World Imagery",
    ],
    notes: [
      "Peta ini merupakan hasil analisis akademik dan bukan keputusan perencanaan final.",
      "Layer tutupan lahan pada ekspor asli memiliki 24 pasang geometri duplikat dengan dua kelas berbeda; kelas utama mengikuti fitur teratas pada ekspor asli.",
      "Kelas prioritas tinggi dan sangat tinggi mencakup sekitar 70% area yang dianalisis; interpretasi perlu mempertimbangkan kelas breaks pada analisis asli.",
      "Bobot dan metode mengikuti abstract aplikasi asli: tutupan lahan 40%, kemiringan 25%, elevasi 25%, jarak sungai 10%.",
    ],
    dataQuality: {
      landcoverDuplicates: landcover.duplicateGroups,
      landcoverSourceFeatures: landcover.totalSourceFeatures,
      landcoverUniqueFeatures: landcover.uniqueFeatures,
      landcoverSourceAreaHa: landcover.sourceAreaHa,
      landcoverUniqueAreaHa: landcover.uniqueAreaHa,
    },
    version: "1.0.0",
    legacy: "qgis2web / Leaflet export",
  };

  console.log("Writing GeoJSON and summary…");
  ensureDir(OUT_DATA);
  ensureDir(OUT_FACTORS);
  ensureDir(OUT_SRC);
  writeJson(path.join(OUT_DATA, "priority.geojson"), priority);
  writeJson(path.join(OUT_DATA, "flood.geojson"), flood.data);
  writeJson(path.join(OUT_DATA, "admin.geojson"), admin);
  writeJson(path.join(OUT_FACTORS, "landcover.geojson"), landcover.data);
  writeJson(path.join(OUT_FACTORS, "slope.geojson"), slope.data);
  writeJson(path.join(OUT_FACTORS, "elevation.geojson"), elevation.data);
  writeJson(path.join(OUT_FACTORS, "river-distance.geojson"), river.data);
  writeJson(path.join(OUT_SRC, "summary.json"), summaryPayload);
  writeJson(path.join(OUT_SRC, "metadata.json"), metadata);
  writeJson(
    path.join(OUT_DATA, "summary.json"),
    summaryPayload
  );

  console.log("\nSummary");
  console.log(`  Priority features: ${priority.features.length}`);
  console.log(`  Analyzed area: ${summary.totalAreaHa} ha`);
  console.log(`  High + very high: ${summary.highPriorityPct}%`);
  console.log(`  Landcover duplicates: ${landcover.duplicateGroups} groups`);
  console.log(`  Landcover unique area: ${landcover.uniqueAreaHa} ha`);
  console.log("\nDone.");
}

main();
