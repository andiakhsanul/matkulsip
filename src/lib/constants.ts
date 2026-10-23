import type { FactorLayerId, LayerId, PriorityLabel } from "@/types";

export const PRIORITY_ORDER: PriorityLabel[] = [
  "Rendah",
  "Sedang",
  "Tinggi",
  "Sangat Tinggi",
];

export const PRIORITY_COLORS: Record<PriorityLabel, string> = {
  Rendah: "#d9eff8",
  Sedang: "#8fd3e8",
  Tinggi: "#2e9cc0",
  "Sangat Tinggi": "#0b5e7a",
};

export const PRIORITY_TEXT_COLORS: Record<PriorityLabel, string> = {
  Rendah: "#0a4f94",
  Sedang: "#0a4f94",
  Tinggi: "#f5fafe",
  "Sangat Tinggi": "#f5fafe",
};

export const FLOOD_COLORS: Record<string, string> = {
  Rendah: "#fde7c3",
  Sedang: "#f5b971",
  Tinggi: "#e4572e",
};

export const LANDCOVER_COLORS: Record<string, string> = {
  Empang: "#7cc7d9",
  "Lahan Kosong": "#e8d8b7",
  "Perkebunan/kebun": "#79a98b",
  Permukiman: "#d99a9a",
  "Sawah Irigasi": "#a7d3b3",
  "Sawah Tadah Hujan": "#e7dfb1",
  "Semak Belukar": "#9cbf8d",
  Sungai: "#5f9fc9",
  Tegalan: "#c4a982",
};

export const SLOPE_COLORS: Record<string, string> = {
  "0-8%": "#d9eff8",
  "8-15%": "#68b9d6",
  ">15%": "#0b5e7a",
};

export const ELEVATION_COLORS: Record<string, string> = {
  "0-25": "#e6f2f7",
  "25-100": "#79b6d9",
  ">100": "#0a4c72",
};

export const RIVER_COLORS: Record<string, string> = {
  "0-50 m": "#e8f7f8",
  "50-100 m": "#58c7d1",
  ">100 m": "#0a6b73",
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
    color: "#2e9cc0",
  },
  landcover: {
    label: "Tutupan lahan",
    shortLabel: "Tutupan lahan",
    description:
      "Jenis tutupan lahan di Kota Cirebon. Bobot 40% dalam analisis asli.",
    group: "factor",
    property: "landcover",
    color: "#79a98b",
  },
  slope: {
    label: "Kemiringan lereng",
    shortLabel: "Kemiringan",
    description:
      "Kelas kemiringan lereng 0–8%, 8–15%, dan >15%. Bobot 25%.",
    group: "factor",
    property: "slopeClass",
    color: "#68b9d6",
  },
  elevation: {
    label: "Ketinggian lahan",
    shortLabel: "Elevasi",
    description:
      "Kelas elevasi 0–25 m, 25–100 m, dan >100 m. Bobot 25%.",
    group: "factor",
    property: "elevationClass",
    color: "#79b6d9",
  },
  river: {
    label: "Jarak dari sungai",
    shortLabel: "Jarak sungai",
    description:
      "Kelas jarak 0–50 m, 50–100 m, dan >100 m dari badan air. Bobot 10%.",
    group: "factor",
    property: "distanceClass",
    color: "#58c7d1",
  },
  flood: {
    label: "Bahaya banjir",
    shortLabel: "Bahaya banjir",
    description:
      "Layer konteks tingkat bahaya banjir. Tidak termasuk dalam empat parameter weighted overlay.",
    group: "context",
    property: "hazard",
    color: "#f5b971",
  },
  admin: {
    label: "Batas kecamatan",
    shortLabel: "Administrasi",
    description: "Batas dan label lima kecamatan di Kota Cirebon.",
    group: "context",
    property: "kecamatan",
    color: "#0a4c72",
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
