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

// Palet warna mengikuti SNI 6502.2:2010 (Spesifikasi penyajian peta rupa bumi
// skala 1:25.000). Nilai CMYK/RGB diambil dari tabel tinta cetak offset pada
// pedoman tersebut:
// - Tutupan lahan, perairan, jalan, dan batas administrasi memakai nilai SNI
//   persis.
// - SNI tidak mengatur kelas tematik (prioritas BGI, bahaya banjir, kelas
//   lereng/elevasi/jarak sungai), sehingga kelas tersebut memakai ramp yang
//   diturunkan dari tinta SNI: hijau (kebun/hutan), kuning-oranye kontur, dan
//   cyan perairan.
export const PRIORITY_COLORS: Record<PriorityLabel, string> = {
  Rendah: "#e5ffd8",
  Sedang: "#bfff99",
  Tinggi: "#66cc66",
  "Sangat Tinggi": "#1b7a3c",
};

export const PRIORITY_TEXT_COLORS: Record<PriorityLabel, string> = {
  Rendah: "#1b3a24",
  Sedang: "#1b3a24",
  Tinggi: "#0e3319",
  "Sangat Tinggi": "#f2fff5",
};

// Bahaya banjir: rendah memakai kuning SNI (40%), sedang oranye kontur SNI,
// tinggi merah tua konvensional peta bahaya (tidak diatur SNI).
export const FLOOD_COLORS: Record<string, string> = {
  Rendah: "#ffff99",
  Sedang: "#ff7f00",
  Tinggi: "#b71c1c",
};

// Tutupan lahan — nilai RGB (255) eksak dari tabel SNI 6502.2:2010:
// permukiman 0/15/30/0, sawah 30/0/0/0 (cyan 30%), kebun 10/0/15/0,
// hutan/semak 25/0/40/0, tegal 0/0/40/0, tanah kosong tanpa tinta, dan
// perairan cyan 100%. Empang tidak memiliki entri khusus pada tabel yang
// tersedia sehingga memakai cyan perairan SNI.
export const LANDCOVER_COLORS: Record<string, string> = {
  Empang: "#00ffff",
  "Lahan Kosong": "#ffffff",
  "Perkebunan/kebun": "#e5ffd8",
  Permukiman: "#ffd8b2",
  "Sawah Irigasi": "#b2ffff",
  "Sawah Tadah Hujan": "#b2ffff",
  "Semak Belukar": "#bfff99",
  Sungai: "#00ffff",
  Tegalan: "#ffff99",
};

// Lereng dan elevasi diturunkan dari oranye kontur SNI (0/0/50/10 =
// RGB 255/127/0): tint 30% untuk kelas rendah, tint 60% untuk kelas menengah,
// dan oranye penuh untuk kelas tinggi.
export const SLOPE_COLORS: Record<string, string> = {
  "0-8%": "#ffe5b3",
  "8-15%": "#ffb266",
  ">15%": "#ff7f00",
};

export const ELEVATION_COLORS: Record<string, string> = {
  "0-25": "#fff3e6",
  "25-100": "#ffc299",
  ">100": "#e67300",
};

// Jarak sungai memakai tint cyan perairan SNI: 100% untuk terdekat, 60% untuk
// menengah, dan 20% untuk terjauh.
export const RIVER_COLORS: Record<string, string> = {
  "0-50 m": "#00ffff",
  "50-100 m": "#99ffff",
  ">100 m": "#ccffff",
};

// Simbol jalan mengikuti SNI 6502.2:2010 secara eksak: arteri/kolektor
// magenta 100% (0/60/0/0 = RGB 255/102/255) dengan casing hitam, jalan lokal
// garis hitam dengan casing putih, serta jalan lain/setapak magenta 40%
// (RGB 255/153/255) tanpa casing; setapak digambar putus-putus.
export const ROAD_CLASS_ORDER: RoadClass[] = [
  "Jalan Arteri",
  "Jalan Kolektor",
  "Jalan Lokal",
  "Jalan Lain",
  "Jalan Setapak",
];

export const ROAD_COLORS: Record<RoadClass, string> = {
  "Jalan Arteri": "#ff66ff",
  "Jalan Kolektor": "#ff66ff",
  "Jalan Lokal": "#000000",
  "Jalan Lain": "#ff99ff",
  "Jalan Setapak": "#ff99ff",
};

export const ROAD_CASING_COLORS: Record<RoadClass, string> = {
  "Jalan Arteri": "#000000",
  "Jalan Kolektor": "#000000",
  "Jalan Lokal": "#ffffff",
  "Jalan Lain": "rgba(0,0,0,0)",
  "Jalan Setapak": "rgba(0,0,0,0)",
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
    color: "#1b7a3c",
  },
  landcover: {
    label: "Tutupan lahan",
    shortLabel: "Tutupan lahan",
    description:
      "Jenis tutupan lahan di Kota Cirebon, diwarnai sesuai tabel SNI 6502.2:2010. Bobot 40%; skor QGIS 1–5.",
    group: "factor",
    property: "landcover",
    color: "#66cc66",
  },
  slope: {
    label: "Kemiringan lereng",
    shortLabel: "Kemiringan",
    description:
      "Kelas lereng 0–8%, 8–15%, dan >15% dengan ramp oranye kontur SNI. Bobot 25%; skor 5 untuk datar, 1 untuk curam.",
    group: "factor",
    property: "slopeClass",
    color: "#ff7f00",
  },
  elevation: {
    label: "Ketinggian lahan",
    shortLabel: "Elevasi",
    description:
      "Kelas elevasi 0–25 m, 25–100 m, dan >100 m dengan ramp oranye kontur SNI. Bobot 25%; skor 5 untuk 0–25 m, 1 untuk >100 m.",
    group: "factor",
    property: "elevationClass",
    color: "#e67300",
  },
  river: {
    label: "Jarak dari sungai",
    shortLabel: "Jarak sungai",
    description:
      "Jarak 0–50 m, 50–100 m, dan >100 m dari badan air dengan ramp cyan perairan SNI. Bobot 10%; skor 5 untuk 0–50 m, 1 untuk >100 m.",
    group: "factor",
    property: "distanceClass",
    color: "#00ffff",
  },
  flood: {
    label: "Bahaya banjir",
    shortLabel: "Bahaya banjir",
    description:
      "Layer konteks bahaya banjir dengan palet tematik (kuning–oranye–merah); tidak termasuk empat parameter weighted overlay. Skor 5 = bahaya tinggi.",
    group: "context",
    property: "hazard",
    color: "#ff7f00",
  },
  roads: {
    label: "Jaringan jalan",
    shortLabel: "Jalan",
    description:
      "Layer pendukung akses RBI 25K. Arteri/kolektor magenta SNI dengan casing hitam, lokal hitam dengan casing putih, dan jalan lain/setapak magenta 40% (setapak putus-putus) sesuai SNI 6502.2:2010; jalan rinci muncul saat diperbesar.",
    group: "context",
    property: "roadClass",
    color: "#ff66ff",
  },
  admin: {
    label: "Batas kecamatan",
    shortLabel: "Administrasi",
    description:
      "Batas kecamatan digambar garis hitam berpola dan label hitam sesuai spesifikasi batas administratif SNI 6502.2:2010.",
    group: "context",
    property: "kecamatan",
    color: "#000000",
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
