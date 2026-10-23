import type {
  FactorLayerId,
  LayerId,
  PriorityLabel,
  RoadClass,
} from "@/types";

export const PRIORITY_ORDER: PriorityLabel[] = [
  "Rendah",
  "Sedang",
  "Tinggi",
  "Sangat Tinggi",
];

// Palet tematik mengikuti konvensi kelas peta SNI/RBI: hijau–kuning–oranye–merah
// untuk tingkat prioritas/bahaya, serta warna tanah untuk elevasi dan lereng.
// Biru hanya dipakai untuk unsur air pada tutupan lahan, bukan sebagai warna kelas.
export const PRIORITY_COLORS: Record<PriorityLabel, string> = {
  Rendah: "#a5d6a7",
  Sedang: "#ffe082",
  Tinggi: "#f4a261",
  "Sangat Tinggi": "#c62828",
};

export const PRIORITY_TEXT_COLORS: Record<PriorityLabel, string> = {
  Rendah: "#1b3a24",
  Sedang: "#4a3200",
  Tinggi: "#4a1f00",
  "Sangat Tinggi": "#fff8f5",
};

export const FLOOD_COLORS: Record<string, string> = {
  Rendah: "#fff1a8",
  Sedang: "#f59e42",
  Tinggi: "#b71c1c",
};

export const LANDCOVER_COLORS: Record<string, string> = {
  Empang: "#79bfd1",
  "Lahan Kosong": "#e7dcc1",
  "Perkebunan/kebun": "#79a862",
  Permukiman: "#d9958c",
  "Sawah Irigasi": "#b3d98a",
  "Sawah Tadah Hujan": "#ded590",
  "Semak Belukar": "#9fbe72",
  Sungai: "#4f97bf",
  Tegalan: "#c5a269",
};

export const SLOPE_COLORS: Record<string, string> = {
  "0-8%": "#f6e7b8",
  "8-15%": "#dda15e",
  ">15%": "#9c5a2e",
};

export const ELEVATION_COLORS: Record<string, string> = {
  "0-25": "#f3e6c4",
  "25-100": "#d4b071",
  ">100": "#8f6238",
};

export const RIVER_COLORS: Record<string, string> = {
  "0-50 m": "#2f7d32",
  "50-100 m": "#8fbf6a",
  ">100 m": "#e7e0c8",
};

// Simbol jalan mengikuti SNI 6502.2:2010: arteri/kolektor memakai magenta
// dengan casing hitam, jalan lokal memakai garis hitam dengan casing putih,
// sedangkan jalan lain/setapak memakai magenta muda. Warna magenta sedikit
// digelapkan agar tetap terbaca di atas basemap terang maupun citra satelit.
export const ROAD_CLASS_ORDER: RoadClass[] = [
  "Jalan Arteri",
  "Jalan Kolektor",
  "Jalan Lokal",
  "Jalan Lain",
  "Jalan Setapak",
];

export const ROAD_COLORS: Record<RoadClass, string> = {
  "Jalan Arteri": "#e6007e",
  "Jalan Kolektor": "#e6007e",
  "Jalan Lokal": "#26221f",
  "Jalan Lain": "#ef8ac5",
  "Jalan Setapak": "#dca0bb",
};

export const ROAD_CASING_COLORS: Record<RoadClass, string> = {
  "Jalan Arteri": "#2b2428",
  "Jalan Kolektor": "#2b2428",
  "Jalan Lokal": "#fffdf8",
  "Jalan Lain": "rgba(43,36,40,.55)",
  "Jalan Setapak": "rgba(43,36,40,.55)",
};

export const ROAD_LABELS: Record<RoadClass, string> = {
  "Jalan Arteri": "Arteri",
  "Jalan Kolektor": "Kolektor",
  "Jalan Lokal": "Lokal",
  "Jalan Lain": "Jalan lain",
  "Jalan Setapak": "Setapak",
};

export const FACTOR_COLORS: Record<FactorLayerId, Record<string, string>> = {
  landcover: LANDCOVER_COLORS,
  slope: SLOPE_COLORS,
  elevation: ELEVATION_COLORS,
  river: RIVER_COLORS,
};

export const LAYER_META: Record<
  LayerId,
  {
    label: string;
    shortLabel: string;
    description: string;
    group: "priority" | "factor" | "context";
    property: string;
    color?: string;
  }
> = {
  priority: {
    label: "Prioritas BGI",
    shortLabel: "Prioritas",
    description:
      "Hasil weighted overlay empat parameter, dikelompokkan menjadi empat kelas prioritas.",
    group: "priority",
    property: "priority",
    color: "#c62828",
  },
  landcover: {
    label: "Tutupan lahan",
    shortLabel: "Tutupan lahan",
    description:
      "Jenis tutupan lahan di Kota Cirebon. Bobot 40%; skor QGIS 1–5.",
    group: "factor",
    property: "landcover",
    color: "#79a862",
  },
  slope: {
    label: "Kemiringan lereng",
    shortLabel: "Kemiringan",
    description:
      "Kelas lereng 0–8%, 8–15%, dan >15%. Bobot 25%; skor 5 untuk datar, 1 untuk curam.",
    group: "factor",
    property: "slopeClass",
    color: "#dda15e",
  },
  elevation: {
    label: "Ketinggian lahan",
    shortLabel: "Elevasi",
    description:
      "Kelas elevasi 0–25 m, 25–100 m, dan >100 m. Bobot 25%; skor 5 untuk 0–25 m, 1 untuk >100 m.",
    group: "factor",
    property: "elevationClass",
    color: "#d4b071",
  },
  river: {
    label: "Jarak dari sungai",
    shortLabel: "Jarak sungai",
    description:
      "Jarak 0–50 m, 50–100 m, dan >100 m dari badan air. Bobot 10%; skor 5 untuk 0–50 m, 1 untuk >100 m.",
    group: "factor",
    property: "distanceClass",
    color: "#2f7d32",
  },
  flood: {
    label: "Bahaya banjir",
    shortLabel: "Bahaya banjir",
    description:
      "Layer konteks bahaya banjir; tidak termasuk empat parameter weighted overlay. Skor 5 = bahaya tinggi.",
    group: "context",
    property: "hazard",
    color: "#f59e42",
  },
  roads: {
    label: "Jaringan jalan",
    shortLabel: "Jalan",
    description:
      "Layer pendukung akses RBI 25K. Arteri/kolektor magenta, lokal hitam-putih, dan setapak magenta muda sesuai SNI 6502.2:2010; jalan rinci muncul saat diperbesar.",
    group: "context",
    property: "roadClass",
    color: "#c2185b",
  },
  admin: {
    label: "Batas kecamatan",
    shortLabel: "Administrasi",
    description: "Batas dan label lima kecamatan di Kota Cirebon.",
    group: "context",
    property: "kecamatan",
    color: "#6b4a3a",
  },
};

export const FACTOR_LAYERS: FactorLayerId[] = [
  "landcover",
  "slope",
  "elevation",
  "river",
];

export const THEMATIC_LAYERS: LayerId[] = [
  "priority",
  "flood",
  ...FACTOR_LAYERS,
];

export const LAYER_FILE: Record<Exclude<LayerId, "admin">, string> = {
  priority: "data/priority.geojson",
  flood: "data/flood.geojson",
  roads: "data/roads.geojson",
  landcover: "data/factors/landcover.geojson",
  slope: "data/factors/slope.geojson",
  elevation: "data/factors/elevation.geojson",
  river: "data/factors/river-distance.geojson",
};

export const FACTOR_SUMMARY_KEY: Record<
  FactorLayerId,
  "slope" | "elevation" | "riverDistance" | "landcover"
> = {
  landcover: "landcover",
  slope: "slope",
  elevation: "elevation",
  river: "riverDistance",
};
