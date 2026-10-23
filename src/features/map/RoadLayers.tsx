import { Layer, Source } from "react-map-gl/maplibre";
import type {
  DataDrivenPropertyValueSpecification,
  FilterSpecification,
} from "maplibre-gl";
import {
  ROAD_CASING_COLORS,
  ROAD_COLORS,
} from "@/lib/constants";
import type { RoadClass, RoadCollection } from "@/types";

function roadClassFilter(roadClass: RoadClass): FilterSpecification {
  return ["==", ["get", "roadClass"], roadClass] as FilterSpecification;
}

function lineWidth(
  stops: [number, number][]
): DataDrivenPropertyValueSpecification<number> {
  return [
    "interpolate",
    ["exponential", 1.45],
    ["zoom"],
    ...stops.flat(),
  ] as unknown as DataDrivenPropertyValueSpecification<number>;
}

const ROAD_STYLES: {
  key: string;
  roadClass: RoadClass;
  minzoom: number;
  casingWidth: [number, number][];
  lineWidth: [number, number][];
  dasharray?: number[];
}[] = [
  {
    key: "setapak",
    roadClass: "Jalan Setapak",
    minzoom: 14,
    casingWidth: [
      [14, 1.2],
      [16, 1.7],
      [18, 2.4],
    ],
    lineWidth: [
      [14, 0.65],
      [16, 1],
      [18, 1.5],
    ],
    dasharray: [1.1, 1.5],
  },
  {
    key: "lain",
    roadClass: "Jalan Lain",
    minzoom: 13.3,
    casingWidth: [
      [13.3, 1.2],
      [16, 1.9],
      [18, 2.8],
    ],
    lineWidth: [
      [13.3, 0.8],
      [16, 1.3],
      [18, 1.8],
    ],
  },
  {
    key: "lokal",
    roadClass: "Jalan Lokal",
    minzoom: 12.6,
    casingWidth: [
      [12.6, 1.4],
      [15, 2.2],
      [18, 3.4],
    ],
    lineWidth: [
      [12.6, 0.8],
      [15, 1.3],
      [18, 1.9],
    ],
  },
  {
    key: "kolektor",
    roadClass: "Jalan Kolektor",
    minzoom: 10,
    casingWidth: [
      [10, 1.1],
      [14, 2.5],
      [17, 4.1],
    ],
    lineWidth: [
      [10, 0.5],
      [14, 1.4],
      [17, 2.3],
    ],
  },
  {
    key: "arteri",
    roadClass: "Jalan Arteri",
    minzoom: 10,
    casingWidth: [
      [10, 1.4],
      [14, 3.3],
      [17, 5.2],
    ],
    lineWidth: [
      [10, 0.7],
      [14, 1.9],
      [17, 3.1],
    ],
  },
];

export const ROAD_LAYER_IDS = [
  ...ROAD_STYLES.map((style) => `roads-${style.key}-casing`),
  ...ROAD_STYLES.map((style) => `roads-${style.key}-line`),
];

export function RoadLayers({
  data,
  opacity,
}: {
  data: RoadCollection;
  opacity: number;
}) {
  return (
    <Source id="roads" type="geojson" data={data} promoteId="id">
      {ROAD_STYLES.map((style) => (
        <Layer
          key={`${style.key}-casing`}
          id={`roads-${style.key}-casing`}
          type="line"
          minzoom={style.minzoom}
          filter={roadClassFilter(style.roadClass)}
          layout={{
            "line-cap": "round",
            "line-join": "round",
          }}
          paint={{
            "line-color": ROAD_CASING_COLORS[style.roadClass],
            "line-width": lineWidth(style.casingWidth),
            "line-opacity": opacity,
          }}
        />
      ))}
      {ROAD_STYLES.map((style) => (
        <Layer
          key={`${style.key}-line`}
          id={`roads-${style.key}-line`}
          type="line"
          minzoom={style.minzoom}
          filter={roadClassFilter(style.roadClass)}
          layout={{
            "line-cap": style.dasharray ? "butt" : "round",
            "line-join": "round",
          }}
          paint={{
            "line-color": ROAD_COLORS[style.roadClass],
            "line-width": lineWidth(style.lineWidth),
            "line-opacity": opacity,
            ...(style.dasharray
              ? { "line-dasharray": style.dasharray }
              : {}),
          }}
        />
      ))}
    </Source>
  );
}
