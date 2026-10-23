import {
  ELEVATION_COLORS,
  FACTOR_COLORS,
  FLOOD_COLORS,
  LANDCOVER_COLORS,
  LAYER_META,
  PRIORITY_COLORS,
  RIVER_COLORS,
  ROAD_CASING_COLORS,
  ROAD_CLASS_ORDER,
  ROAD_COLORS,
  ROAD_LABELS,
  SLOPE_COLORS,
} from "@/lib/constants";
import { formatArea } from "@/lib/format";
import type {
  FactorLayerId,
  LayerId,
  PriorityFeature,
  PriorityLabel,
  RoadClass,
  SummaryData,
} from "@/types";

export interface LegendItem {
  label: string;
  displayLabel: string;
  color: string;
  areaHa?: number;
  score?: number;
  kind?: "fill" | "line" | "line-dashed";
  casingColor?: string;
  lineWidth?: number;
}

const SCORED_LAYERS: LayerId[] = [
  "flood",
  "landcover",
  "slope",
  "elevation",
  "river",
];

export function getActiveLayer(layers: Record<LayerId, boolean>): LayerId | null {
  if (layers.priority) return "priority";
  if (layers.flood) return "flood";
  if (layers.landcover) return "landcover";
  if (layers.slope) return "slope";
  if (layers.elevation) return "elevation";
  if (layers.river) return "river";
  return null;
}

export function displayClassLabel(layer: FactorLayerId | "priority" | "flood", label: string) {
  if (layer === "elevation") {
    if (label === "0-25") return "0–25 m";
    if (label === "25-100") return "25–100 m";
    if (label === ">100") return ">100 m";
  }
  if (layer === "slope" || layer === "river") {
    return label.replace("-", "–");
  }
  return label;
}

export function legendForLayer(layer: LayerId, summary: SummaryData): LegendItem[] {
  if (layer === "priority") {
    return summary.priority.classes.map((item) => ({
      label: item.label,
      displayLabel: item.label,
      color: PRIORITY_COLORS[item.label as PriorityLabel] ?? item.color,
      areaHa: item.areaHa,
    }));
  }
  if (layer === "flood") {
    return summary.flood.classes.map((item) => ({
      label: item.label,
      displayLabel: item.label,
      color: FLOOD_COLORS[item.label] ?? "#e6e0d0",
      areaHa: item.areaHa,
      score: item.score,
    }));
  }
  if (layer === "roads") {
    return ROAD_CLASS_ORDER.map((roadClass) => ({
      label: roadClass,
      displayLabel: ROAD_LABELS[roadClass],
      color: ROAD_COLORS[roadClass],
      kind: roadClass === "Jalan Setapak" ? "line-dashed" : "line",
      casingColor: ROAD_CASING_COLORS[roadClass],
      lineWidth:
        roadClass === "Jalan Arteri"
          ? 2.4
          : roadClass === "Jalan Kolektor"
            ? 1.9
            : 1.4,
    }));
  }
  if (layer === "landcover") {
    return summary.landcover.classes.map((item) => ({
      label: item.label,
      displayLabel: item.label,
      color: LANDCOVER_COLORS[item.label] ?? "#e6e0d0",
      areaHa: item.areaHa,
      score: item.score,
    }));
  }
  if (layer === "slope") {
    return summary.factors.slope.map((item) => ({
      label: item.label,
      displayLabel: displayClassLabel("slope", item.label),
      color: SLOPE_COLORS[item.label] ?? "#e6e0d0",
      areaHa: item.areaHa,
      score: item.score,
    }));
  }
  if (layer === "elevation") {
    return summary.factors.elevation.map((item) => ({
      label: item.label,
      displayLabel: displayClassLabel("elevation", item.label),
      color: ELEVATION_COLORS[item.label] ?? "#e6e0d0",
      areaHa: item.areaHa,
      score: item.score,
    }));
  }
  if (layer === "river") {
    return summary.factors.riverDistance.map((item) => ({
      label: item.label,
      displayLabel: displayClassLabel("river", item.label),
      color: RIVER_COLORS[item.label] ?? "#e6e0d0",
      areaHa: item.areaHa,
      score: item.score,
    }));
  }
  return [];
}

export function layerClassLabel(layer: LayerId, value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  const label = String(value);
  if (layer === "elevation" || layer === "slope" || layer === "river") {
    return displayClassLabel(layer, label);
  }
  return label;
}

export function getLayerValue(layer: LayerId, properties: Record<string, unknown>) {
  const property = LAYER_META[layer].property;
  return layerClassLabel(layer, properties[property]);
}

export function getLayerScore(layer: LayerId, properties: Record<string, unknown>) {
  if (!SCORED_LAYERS.includes(layer)) return null;
  const score = Number(properties.score);
  return Number.isFinite(score) ? score : null;
}

export function scoreRange(items: LegendItem[]) {
  const scores = items
    .map((item) => item.score)
    .filter((score): score is number => typeof score === "number");
  if (!scores.length) return null;
  return {
    min: Math.min(...scores),
    max: Math.max(...scores),
  };
}

export function filterPriorityFeatures(
  features: PriorityFeature[] | undefined,
  filters: { kecamatan: string[]; priorities: PriorityLabel[] }
) {
  if (!features) return [];
  return features.filter((feature) => {
    const props = feature.properties;
    if (filters.kecamatan.length && !filters.kecamatan.includes(props.kecamatan)) {
      return false;
    }
    if (filters.priorities.length && !filters.priorities.includes(props.priority)) {
      return false;
    }
    return true;
  });
}

export function filterArea(features: PriorityFeature[]) {
  return features.reduce((sum, feature) => sum + Number(feature.properties.areaHa || 0), 0);
}

export function activeFilterCount(filters: {
  kecamatan: string[];
  priorities: PriorityLabel[];
}) {
  return filters.kecamatan.length + filters.priorities.length;
}

export function layerSummaryValue(layer: LayerId, summary: SummaryData) {
  if (layer === "priority") return formatArea(summary.priority.totalAreaHa);
  if (layer === "flood") return formatArea(summary.flood.totalAreaHa);
  if (layer === "landcover") return formatArea(summary.landcover.uniqueAreaHa);
  if (layer === "slope" || layer === "elevation" || layer === "river") {
    return `${legendForLayer(layer, summary).length} kelas`;
  }
  if (layer === "roads") return "SNI 6502.2";
  return "";
}

export function legendColor(layer: LayerId, value: string) {
  if (layer === "priority") return PRIORITY_COLORS[value as PriorityLabel] ?? "#e6e0d0";
  if (layer === "flood") return FLOOD_COLORS[value] ?? "#e6e0d0";
  if (layer === "landcover") return LANDCOVER_COLORS[value] ?? "#e6e0d0";
  if (layer === "slope") return SLOPE_COLORS[value] ?? "#e6e0d0";
  if (layer === "elevation") return ELEVATION_COLORS[value] ?? "#e6e0d0";
  if (layer === "river") return RIVER_COLORS[value] ?? "#e6e0d0";
  if (layer === "roads") return ROAD_COLORS[value as RoadClass] ?? "#c2185b";
  return "#e6e0d0";
}

export function factorColorMap(layer: FactorLayerId) {
  return FACTOR_COLORS[layer];
}
