import fs from "node:fs";
import path from "node:path";
import * as shapefile from "shapefile";

const ROOT = path.resolve(process.cwd());
const SOURCE_DIR = path.join(ROOT, "MATKUL SIP SEMUA PARAMETER DISINI");
const OUT_FILE = path.join(ROOT, "scripts", "parameter-scores.json");

const LAYERS = [
  {
    key: "landcover",
    file: "Tutupan Lahan Cirebon New",
    classField: "Landuse_fi",
  },
  {
    key: "slope",
    file: "Kemiringan Lereng Cirebon New",
    classField: "slope",
  },
  {
    key: "elevation",
    file: "Ketinggian Lahan Cirebon New",
    classField: "ket",
  },
  {
    key: "river",
    file: "Jarak Sungai Cirebon New",
    classField: "keterangan",
  },
  {
    key: "flood",
    file: "Bahaya Banjir Cirebon New",
    classField: "Keterangan",
  },
];

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

if (!fs.existsSync(SOURCE_DIR)) {
  fail(
    `Folder sumber tidak ditemukan: ${path.relative(ROOT, SOURCE_DIR)}\n` +
      "Letakkan shapefile parameter QGIS di folder tersebut, lalu jalankan ulang perintah ini."
  );
}

const layers = {};

for (const layer of LAYERS) {
  const shp = path.join(SOURCE_DIR, `${layer.file}.shp`);
  const dbf = path.join(SOURCE_DIR, `${layer.file}.dbf`);
  if (!fs.existsSync(shp) || !fs.existsSync(dbf)) {
    fail(`Shapefile tidak lengkap: ${layer.file}`);
  }

  const data = await shapefile.read(shp, dbf, { encoding: "utf-8" });
  const classScores = new Map();

  for (const feature of data.features) {
    const label = feature.properties?.[layer.classField];
    const score = Number(feature.properties?.skor);
    if (label === undefined || label === null || label === "") {
      fail(`Nilai ${layer.classField} kosong pada ${layer.file}`);
    }
    if (!Number.isFinite(score)) {
      fail(`Field skor tidak valid pada ${layer.file} (${label})`);
    }

    const current = classScores.get(String(label));
    if (current !== undefined && current !== score) {
      fail(
        `Skor tidak konsisten pada ${layer.file}: ${label} memiliki ${current} dan ${score}`
      );
    }
    classScores.set(String(label), score);
  }

  layers[layer.key] = {
    source: `${layer.file}.shp`,
    classField: layer.classField,
    scores: Object.fromEntries(
      [...classScores.entries()].sort(([a], [b]) => a.localeCompare(b, "id"))
    ),
  };

  console.log(`\n${layer.file}`);
  for (const [label, score] of classScores.entries()) {
    console.log(`  ${label}: ${score}`);
  }
}

const payload = {
  source: "MATKUL SIP SEMUA PARAMETER DISINI",
  field: "skor",
  layers,
};

fs.writeFileSync(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`\nTersimpan: ${path.relative(ROOT, OUT_FILE)}`);
