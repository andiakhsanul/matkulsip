import type {
  DataDrivenPropertyValueSpecification,
  FilterSpecification,
  StyleSpecification,
} from "maplibre-gl";
import {
  ELEVATION_COLORS,
  FLOOD_COLORS,
  LANDCOVER_COLORS,
  PRIORITY_COLORS,
  RIVER_COLORS,
  SLOPE_COLORS,
} from "@/lib/constants";
import type { FactorLayerId, PriorityLabel } from "@/types";

export const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#dcecf5",
      },
    },
  ],
};

export const BASEMAP_BACKGROUND: Record<string, string> = {
  light: "#f0f3f4",
  satellite: "#1d2b26",
  dark: "#080d11",
};

type ColorMap = Record<string, string>;

function matchColor(
  property: string,
  colors: ColorMap,
  fallback: string
): DataDrivenPropertyValueSpecification<string> {
  const entries = Object.entries(colors).flatMap(([label, color]) => [label, color]);
  return ["match", ["get", property], ...entries, fallback] as unknown as DataDrivenPropertyValueSpecification<string>;
}

export const PRIORITY_FILL_COLOR = matchColor(
  "priority",
  PRIORITY_COLORS as ColorMap,
  "#8fd3e8"
);

export const FLOOD_FILL_COLOR = matchColor("hazard", FLOOD_COLORS, "#f5b971");

export const LANDCOVER_FILL_COLOR = matchColor(
  "landcover",
  LANDCOVER_COLORS,
  "#bfdeef"
);

export const SLOPE_FILL_COLOR = matchColor("slopeClass", SLOPE_COLORS, "#bfdeef");
export const ELEVATION_FILL_COLOR = matchColor(
  "elevationClass",
  ELEVATION_COLORS,
  "#bfdeef"
);
export const RIVER_FILL_COLOR = matchColor("distanceClass", RIVER_COLORS, "#bfdeef");

export function factorFillColor(layer: FactorLayerId) {
  if (layer === "landcover") return LANDCOVER_FILL_COLOR;
  if (layer === "slope") return SLOPE_FILL_COLOR;
  if (layer === "elevation") return ELEVATION_FILL_COLOR;
  return RIVER_FILL_COLOR;
}

export function kecamatanFilter(kecamatan: string[]): FilterSpecification | undefined {
  if (!kecamatan.length) return undefined;
  return [
    "in",
    ["get", "kecamatan"],
    ["literal", kecamatan],
  ] as FilterSpecification;
}

export function priorityClassFilter(
  priorities: PriorityLabel[]
): FilterSpecification | undefined {
  if (!priorities.length) return undefined;
  return [
    "in",
    ["get", "priority"],
    ["literal", priorities],
  ] as FilterSpecification;
}

export function combineFilters(
  ...filters: (FilterSpecification | undefined)[]
): FilterSpecification | undefined {
  const active = filters.filter(Boolean) as FilterSpecification[];
  if (!active.length) return undefined;
  if (active.length === 1) return active[0];
  return ["all", ...active] as FilterSpecification;
}

export function idFilter(id: string | null | undefined): FilterSpecification {
  return ["==", ["get", "id"], id ?? "__tidak_ada__"] as FilterSpecification;
}

export function selectedFeatureFilter(id: string | null | undefined): FilterSpecification {
  return idFilter(id);
}
