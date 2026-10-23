import type {
  Feature,
  FeatureCollection,
  LineString,
  MultiLineString,
  MultiPolygon,
} from "geojson";

export type PriorityLabel = "Rendah" | "Sedang" | "Tinggi" | "Sangat Tinggi";

export type RoadClass =
  | "Jalan Arteri"
  | "Jalan Kolektor"
  | "Jalan Lokal"
  | "Jalan Lain"
  | "Jalan Setapak";

export type LayerId =
  | "priority"
  | "flood"
  | "roads"
  | "admin"
  | "landcover"
  | "slope"
  | "elevation"
  | "river";

export type FactorLayerId = "landcover" | "slope" | "elevation" | "river";

export type BasemapId = "light" | "satellite" | "dark";

export type PanelTab = "layers" | "filter" | "stats";
export type MobileSheetTab = "layers" | "filter" | "stats" | "detail";

export interface PriorityProperties {
  id: string;
  kecamatan: string;
  priority: PriorityLabel;
  areaHa: number;
}

export interface FloodProperties {
  id: string;
  kecamatan: string;
  hazard: "Rendah" | "Sedang" | "Tinggi";
  areaHa: number;
  score: number;
}

export interface RoadProperties {
  id: string;
  roadClass: RoadClass;
  lengthM: number;
}

export interface AdminProperties {
  id: string;
  kecamatan: string;
  areaHa: number;
  center: [number, number];
}

export interface LandcoverProperties {
  id: string;
  kecamatan: string;
  landcover: string;
  classes: string[];
  classScores?: Record<string, number>;
  duplicate: boolean;
  areaHa: number;
  score: number;
}

export interface SlopeProperties {
  id: string;
  kecamatan: string;
  slopeClass: "0-8%" | "8-15%" | ">15%";
  classification?: string;
  score: number;
}

export interface ElevationProperties {
  id: string;
  kecamatan: string;
  elevationClass: "0-25" | "25-100" | ">100";
  score: number;
}

export interface RiverProperties {
  id: string;
  kecamatan: string;
  distanceClass: "0-50 m" | "50-100 m" | ">100 m";
  score: number;
}

export type PriorityFeature = Feature<MultiPolygon, PriorityProperties>;
export type FloodFeature = Feature<MultiPolygon, FloodProperties>;
export type RoadFeature = Feature<LineString | MultiLineString, RoadProperties>;
export type AdminFeature = Feature<MultiPolygon, AdminProperties>;
export type LandcoverFeature = Feature<MultiPolygon, LandcoverProperties>;
export type SlopeFeature = Feature<MultiPolygon, SlopeProperties>;
export type ElevationFeature = Feature<MultiPolygon, ElevationProperties>;
export type RiverFeature = Feature<MultiPolygon, RiverProperties>;

export type PriorityCollection = FeatureCollection<MultiPolygon, PriorityProperties>;
export type FloodCollection = FeatureCollection<MultiPolygon, FloodProperties>;
export type RoadCollection = FeatureCollection<
  LineString | MultiLineString,
  RoadProperties
>;
export type AdminCollection = FeatureCollection<MultiPolygon, AdminProperties>;
export type LandcoverCollection = FeatureCollection<MultiPolygon, LandcoverProperties>;
export type SlopeCollection = FeatureCollection<MultiPolygon, SlopeProperties>;
export type ElevationCollection = FeatureCollection<MultiPolygon, ElevationProperties>;
export type RiverCollection = FeatureCollection<MultiPolygon, RiverProperties>;

export type AnyLayerCollection =
  | PriorityCollection
  | FloodCollection
  | RoadCollection
  | AdminCollection
  | LandcoverCollection
  | SlopeCollection
  | ElevationCollection
  | RiverCollection;

export type SelectedFeature = (
  | { layer: "priority"; properties: PriorityProperties }
  | { layer: "flood"; properties: FloodProperties }
  | { layer: "admin"; properties: AdminProperties }
  | { layer: "landcover"; properties: LandcoverProperties }
  | { layer: "slope"; properties: SlopeProperties }
  | { layer: "elevation"; properties: ElevationProperties }
  | { layer: "river"; properties: RiverProperties }
) & {
  center?: [number, number];
};

export interface SummaryValue {
  label: string;
  areaHa: number;
  score?: number;
}

export interface SummaryClass extends SummaryValue {
  key: string;
  pct: number;
  count: number;
  color: string;
}

export interface KecamatanSummary {
  name: string;
  totalAreaHa: number;
  adminAreaHa: number | null;
  pctOfAnalyzed: number;
  classes: Record<string, number>;
  center: [number, number] | null;
}

export interface SummaryData {
  generatedAt: string;
  city: {
    name: string;
    bounds: [number, number, number, number];
    center: [number, number];
  };
  analyzed: {
    totalAreaHa: number;
    adminAreaHa: number;
    gapAreaHa: number;
  };
  priority: {
    totalAreaHa: number;
    highPriorityAreaHa: number;
    highPriorityPct: number;
    classes: SummaryClass[];
    kecamatan: KecamatanSummary[];
  };
  flood: {
    totalAreaHa: number;
    classes: SummaryValue[];
  };
  landcover: {
    sourceFeatures: number;
    uniqueFeatures: number;
    duplicateGroups: number;
    duplicateFeatures: number;
    sourceAreaHa: number;
    uniqueAreaHa: number;
    classes: SummaryValue[];
  };
  factors: {
    slope: SummaryValue[];
    elevation: SummaryValue[];
    riverDistance: SummaryValue[];
  };
  adminCentroids: { kecamatan: string; center: [number, number]; areaHa: number }[];
}

export interface Metadata {
  title: string;
  shortTitle: string;
  description: string;
  weights: { key: string; label: string; weight: number; description: string }[];
  sources: string[];
  notes: string[];
  dataQuality: {
    landcoverDuplicates: number;
    landcoverSourceFeatures: number;
    landcoverUniqueFeatures: number;
    landcoverSourceAreaHa: number;
    landcoverUniqueAreaHa: number;
  };
  version: string;
  legacy: string;
}
