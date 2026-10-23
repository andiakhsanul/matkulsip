import * as React from "react";
import Map, {
  Layer,
  Marker,
  Source,
  type MapLayerMouseEvent,
  type MapRef,
} from "react-map-gl/maplibre";
import type { FeatureCollection } from "geojson";
import type { FilterSpecification } from "maplibre-gl";
import {
  ArrowClockwise,
  Drop,
  MapPin,
  SpinnerGap,
  Warning,
} from "@phosphor-icons/react";
import { BrandMark } from "@/components/brand/BrandMark";
import { PriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useData } from "@/providers/DataProvider";
import { useAppStore } from "@/stores/useAppStore";
import {
  BASEMAPS,
  BASEMAP_ORDER,
} from "@/lib/basemaps";
import { LAYER_META } from "@/lib/constants";
import {
  getActiveLayer,
  getLayerScore,
  getLayerValue,
  legendColor,
} from "@/lib/layers";
import { cn, formatArea, formatNumber } from "@/lib/format";
import {
  BASEMAP_BACKGROUND,
  combineFilters,
  factorFillColor,
  FLOOD_FILL_COLOR,
  idFilter,
  kecamatanFilter,
  MAP_STYLE,
  PRIORITY_FILL_COLOR,
  priorityClassFilter,
} from "@/features/map/mapStyle";
import { MapControls } from "@/features/map/MapControls";
import { RoadLayers, ROAD_LAYER_IDS } from "@/features/map/RoadLayers";
import type {
  AdminProperties,
  ElevationProperties,
  FactorLayerId,
  FloodProperties,
  LandcoverProperties,
  LayerId,
  PriorityProperties,
  RiverProperties,
  SelectedFeature,
  SlopeProperties,
} from "@/types";

const FILL_LAYER_TO_KEY: Record<string, LayerId> = {
  "priority-fill": "priority",
  "flood-fill": "flood",
  "landcover-fill": "landcover",
  "slope-fill": "slope",
  "elevation-fill": "elevation",
  "river-fill": "river",
};

// MapLibre rejects a layer whose `filter` prop exists but is undefined.
// Return a spreadable object so empty filters are omitted entirely.
function filterProps(filter: FilterSpecification | undefined) {
  return filter ? { filter } : {};
}

const FACTOR_CONFIGS: { id: FactorLayerId }[] = [
  { id: "landcover" },
  { id: "slope" },
  { id: "elevation" },
  { id: "river" },
];

// Keep the compact kecamatan labels legible where administrative centres
// sit close together (Pekalipan and Lemahwungkuk in particular).
const ADMIN_LABEL_OFFSETS: Record<string, [number, number]> = {
  "admin-kejaksan-1": [0, -18],
  "admin-kesambi-2": [-18, 10],
  "admin-lemahwungkuk-3": [30, 24],
  "admin-pekalipan-4": [-34, -24],
  "admin-harjamukti-0": [10, 12],
};

interface HoverState {
  layer: LayerId;
  id: string;
  x: number;
  y: number;
  properties: Record<string, unknown>;
}

function selectedFromFeature(
  layer: LayerId,
  properties: Record<string, unknown>,
  center: [number, number]
): SelectedFeature | null {
  if (layer === "priority") {
    return { layer, properties: properties as unknown as PriorityProperties, center };
  }
  if (layer === "flood") {
    return { layer, properties: properties as unknown as FloodProperties, center };
  }
  if (layer === "landcover") {
    return { layer, properties: properties as unknown as LandcoverProperties, center };
  }
  if (layer === "slope") {
    return { layer, properties: properties as unknown as SlopeProperties, center };
  }
  if (layer === "elevation") {
    return { layer, properties: properties as unknown as ElevationProperties, center };
  }
  if (layer === "river") {
    return { layer, properties: properties as unknown as RiverProperties, center };
  }
  if (layer === "admin") {
    return { layer, properties: properties as unknown as AdminProperties, center };
  }
  return null;
}

function FeatureTooltip({ hover }: { hover: HoverState }) {
  const meta = LAYER_META[hover.layer];
  const value = getLayerValue(hover.layer, hover.properties);
  const score = getLayerScore(hover.layer, hover.properties);
  const area = Number(hover.properties.areaHa);
  const duplicate = hover.layer === "landcover" && Boolean(hover.properties.duplicate);
  const classes = Array.isArray(hover.properties.classes)
    ? (hover.properties.classes as string[])
    : [];
  const classScores =
    hover.properties.classScores && typeof hover.properties.classScores === "object"
      ? (hover.properties.classScores as Record<string, number>)
      : null;
  const classSummary = classes
    .map((label) => {
      const classScore = classScores?.[label];
      return typeof classScore === "number" ? `${label} (${classScore})` : label;
    })
    .join(" / ");
  const left = Math.min(hover.x + 18, window.innerWidth - 278);
  const top = Math.max(16, hover.y - 24);

  return (
    <div
      className="pointer-events-none absolute z-30 w-[260px] rounded-2xl border border-white/90 bg-white/95 p-3 shadow-[0_24px_60px_-20px_rgba(4,30,51,.5)] backdrop-blur-xl"
      style={{ left, top }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.13em] text-ink-faint">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: meta.color }}
          />
          {meta.shortLabel}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-faint">
          {String(hover.properties.kecamatan ?? "")}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {hover.layer === "priority" ? (
          <PriorityBadge label={hover.properties.priority as never} />
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-mist-50 px-2 py-1 text-[10.5px] font-bold text-ink">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: legendColor(hover.layer, value) }}
            />
            {value}
          </span>
        )}
        {Number.isFinite(area) && (
          <span className="text-[11px] font-semibold text-ink-soft">
            {formatArea(area)}
          </span>
        )}
        {score !== null && (
          <span
            className="ml-auto rounded-full bg-blue-500/10 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold text-blue-700"
            title="Skor parameter dari atribut QGIS"
          >
            skor {score}
          </span>
        )}
      </div>
      {duplicate && (
        <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-500/10 px-2 py-1.5 text-[9.5px] leading-snug text-[#8b5b0f]">
          <Warning size={12} weight="fill" className="mt-0.5 shrink-0" />
          <span>Geometri duplikat. Kelas asal: {classSummary}.</span>
        </div>
      )}
      <div className="mt-2 flex items-center justify-between border-t border-mist-100 pt-2 text-[9px] text-ink-faint">
        <span>Klik untuk detail</span>
        <span className="font-mono">BGI · 2026</span>
      </div>
    </div>
  );
}

function MapLoadingOverlay({
  error,
  onRetry,
}: {
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#eaf4fa]">
      <div className="mx-4 flex w-full max-w-[360px] flex-col items-center rounded-[28px] border border-white/80 bg-white/75 p-8 text-center shadow-[0_28px_80px_-28px_rgba(4,30,51,.38)] backdrop-blur-xl">
        <BrandMark className="h-14 w-14" animated />
        {error ? (
          <>
            <p className="mt-5 text-[15px] font-bold text-ink">Data peta belum siap</p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-ink-soft">{error}</p>
            <Button className="mt-5" size="sm" onClick={onRetry}>
              <ArrowClockwise size={14} weight="bold" />
              Coba lagi
            </Button>
          </>
        ) : (
          <>
            <p className="mt-5 text-[15px] font-bold tracking-[-0.02em] text-ink">
              Menyiapkan atlas BGI
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-ink-soft">
              Memuat geometri prioritas, jaringan jalan, dan batas kecamatan
              Kota Cirebon.
            </p>
            <div className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-mist-200">
              <div className="h-full w-1/2 animate-[loading-slide_1.4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-blue-600 to-aqua-400" />
            </div>
          </>
        )}
      </div>
      <style>{`
        @keyframes loading-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}

export function MapView() {
  const {
    summary,
    data,
    isInitialLoading,
    initialError,
    retryInitial,
    loadLayer,
  } = useData();
  const mapRef = React.useRef<MapRef | null>(null);
  const [hover, setHover] = React.useState<HoverState | null>(null);
  const [mapReady, setMapReady] = React.useState(false);
  const basemap = useAppStore((state) => state.basemap);
  const layers = useAppStore((state) => state.layers);
  const opacity = useAppStore((state) => state.opacity);
  const filters = useAppStore((state) => state.filters);
  const selected = useAppStore((state) => state.selected);
  const selectFeature = useAppStore((state) => state.selectFeature);
  const setMobileTab = useAppStore((state) => state.setMobileTab);
  const setMobileSheetOpen = useAppStore((state) => state.setMobileSheetOpen);
  const activeLayer = getActiveLayer(layers);

  const priorityFilter = React.useMemo(
    () =>
      combineFilters(
        kecamatanFilter(filters.kecamatan),
        priorityClassFilter(filters.priorities)
      ),
    [filters.kecamatan, filters.priorities]
  );
  const areaFilter = React.useMemo(
    () => kecamatanFilter(filters.kecamatan),
    [filters.kecamatan]
  );

  React.useEffect(() => {
    if (!activeLayer) return;
    void loadLayer(activeLayer);
  }, [activeLayer, loadLayer]);

  const interactiveLayerIds = React.useMemo(() => {
    const ids: string[] = [];
    if (layers.priority && data.priority) ids.push("priority-fill");
    if (layers.flood && data.flood) ids.push("flood-fill");
    for (const factor of FACTOR_CONFIGS) {
      if (layers[factor.id] && data[factor.id]) ids.push(`${factor.id}-fill`);
    }
    return ids;
  }, [data, layers]);

  const fitCity = React.useCallback(
    (duration = 850) => {
      const map = mapRef.current?.getMap();
      if (!map) return;
      const width = window.innerWidth;
      const padding =
        width >= 1280
          ? { top: 118, bottom: 90, left: 430, right: 408 }
          : width >= 1024
            ? { top: 112, bottom: 86, left: 410, right: 60 }
            : { top: 104, bottom: 92, left: 26, right: 26 };
      map.fitBounds(summary.city.bounds, {
        padding,
        duration,
        maxZoom: 13.6,
      });
    },
    [summary.city.bounds]
  );

  React.useEffect(() => {
    const handleReset = () => fitCity(900);
    const handleFocus = (event: Event) => {
      const detail = (event as CustomEvent<{ center: [number, number]; zoom?: number }>).detail;
      if (!detail?.center) return;
      mapRef.current?.flyTo({
        center: detail.center,
        zoom: detail.zoom ?? 14.4,
        duration: 950,
        essential: true,
      });
    };
    window.addEventListener("bgi:reset-view", handleReset);
    window.addEventListener("bgi:focus-feature", handleFocus);
    return () => {
      window.removeEventListener("bgi:reset-view", handleReset);
      window.removeEventListener("bgi:focus-feature", handleFocus);
    };
  }, [fitCity]);

  const handleLoad = React.useCallback(() => {
    setMapReady(true);
    window.setTimeout(() => fitCity(0), 120);
  }, [fitCity]);

  // A thematic source can be mounted after the road source when the user
  // changes layers. MapLibre appends newly mounted layers on top, so keep the
  // road stack above thematic fills until its own layout is stable.
  React.useEffect(() => {
    if (!mapReady || !layers.roads) return;
    const map = mapRef.current?.getMap();
    if (!map) return;

    const moveRoadsToTop = () => {
      for (const id of ROAD_LAYER_IDS) {
        if (map.getLayer(id)) map.moveLayer(id);
      }
    };

    const frame = window.requestAnimationFrame(moveRoadsToTop);
    const timer = window.setTimeout(moveRoadsToTop, 240);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [data, layers, mapReady]);

  const clearHover = React.useCallback(() => {
    setHover(null);
    const map = mapRef.current?.getMap();
    if (map) map.getCanvas().style.cursor = "";
  }, []);

  const handleMouseMove = React.useCallback(
    (event: MapLayerMouseEvent) => {
      const map = mapRef.current?.getMap();
      const feature = event.features?.[0];
      if (!feature) {
        if (map) map.getCanvas().style.cursor = "";
        setHover((current) => (current ? null : current));
        return;
      }
      const layerId = feature.layer?.id;
      const layer = layerId ? FILL_LAYER_TO_KEY[layerId] : undefined;
      if (!layer) return;
      const properties = (feature.properties ?? {}) as Record<string, unknown>;
      const id = String(properties.id ?? feature.id ?? "");
      if (map) map.getCanvas().style.cursor = "pointer";
      setHover({
        layer,
        id,
        x: event.point.x,
        y: event.point.y,
        properties,
      });
    },
    []
  );

  const handleClick = React.useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature) {
        selectFeature(null);
        clearHover();
        return;
      }
      const layerId = feature.layer?.id;
      const layer = layerId ? FILL_LAYER_TO_KEY[layerId] : undefined;
      if (!layer) return;
      const properties = (feature.properties ?? {}) as Record<string, unknown>;
      const selectedFeature = selectedFromFeature(
        layer,
        properties,
        [event.lngLat.lng, event.lngLat.lat]
      );
      if (!selectedFeature) return;
      selectFeature(selectedFeature);
      if (window.matchMedia("(max-width: 1023px)").matches) {
        setMobileTab("detail");
        setMobileSheetOpen(true);
      }
    },
    [clearHover, selectFeature, setMobileSheetOpen, setMobileTab]
  );

  const prioritySelectedId =
    selected?.layer === "priority" ? selected.properties.id : null;
  const hoveredPriorityId =
    hover?.layer === "priority" && hover.id ? hover.id : null;
  const hoverFilter = combineFilters(priorityFilter, idFilter(hoveredPriorityId));
  const selectedFilter = combineFilters(priorityFilter, idFilter(prioritySelectedId));

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: BASEMAP_BACKGROUND[basemap] }}
    >
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: summary.city.center[0],
          latitude: summary.city.center[1],
          zoom: 12.25,
        }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        maxBounds={[108.455, -6.855, 108.655, -6.645]}
        minZoom={10}
        maxZoom={18}
        maxPitch={0}
        dragRotate={false}
        pitchWithRotate={false}
        renderWorldCopies={false}
        interactiveLayerIds={interactiveLayerIds}
        onLoad={handleLoad}
        onMouseMove={handleMouseMove}
        onMouseLeave={clearHover}
        onClick={handleClick}
        cursor="grab"
        style={{ width: "100%", height: "100%" }}
      >
        {BASEMAP_ORDER.map((id) => {
          const item = BASEMAPS[id];
          const visible = basemap === id;
          return (
            <React.Fragment key={id}>
              <Source
                id={`basemap-${id}`}
                type="raster"
                tiles={item.tiles}
                tileSize={item.tileSize}
                maxzoom={item.maxzoom}
              >
                <Layer
                  id={`basemap-${id}-raster`}
                  type="raster"
                  layout={{ visibility: visible ? "visible" : "none" }}
                  paint={{
                    "raster-opacity": 1,
                    "raster-fade-duration": 220,
                  }}
                />
              </Source>
              {item.labels && (
                <Source
                  id={`basemap-${id}-labels`}
                  type="raster"
                  tiles={item.labels.tiles}
                  tileSize={item.labels.tileSize}
                  maxzoom={item.labels.maxzoom}
                >
                  <Layer
                    id={`basemap-${id}-labels-raster`}
                    type="raster"
                    layout={{ visibility: visible ? "visible" : "none" }}
                    paint={{
                      "raster-opacity": 0.92,
                      "raster-fade-duration": 220,
                    }}
                  />
                </Source>
              )}
            </React.Fragment>
          );
        })}

        {data.admin && (
          <Source id="admin" type="geojson" data={data.admin} promoteId="id">
            <Layer
              id="admin-casing"
              type="line"
              paint={{
                "line-color": "rgba(255,255,255,.72)",
                "line-width": 2.8,
                "line-opacity": 0.7,
              }}
            />
            <Layer
              id="admin-line"
              type="line"
              paint={{
                "line-color": "#000000",
                "line-width": 1.05,
                "line-opacity": 0.9,
                // Pola garis batas kecamatan SNI 6502.2:2010 (garis–titik).
                "line-dasharray": [3, 1.3, 0.4, 1.3],
              }}
            />
          </Source>
        )}

        {data.priority && layers.priority && (
          <Source id="priority" type="geojson" data={data.priority} promoteId="id">
            <Layer
              id="priority-fill"
              type="fill"
              {...filterProps(priorityFilter)}
              paint={{
                "fill-color": PRIORITY_FILL_COLOR,
                "fill-opacity": opacity.priority,
              }}
            />
            <Layer
              id="priority-line"
              type="line"
              {...filterProps(priorityFilter)}
              paint={{
                "line-color": "rgba(255,255,255,.82)",
                "line-width": 0.95,
                "line-opacity": 0.9,
              }}
            />
            <Layer
              id="priority-hover-line"
              type="line"
              filter={hoverFilter}
              paint={{
                "line-color": "#ff7f00",
                "line-width": 2.4,
                "line-opacity": 0.95,
              }}
            />
            <Layer
              id="priority-selected-casing"
              type="line"
              filter={selectedFilter}
              paint={{
                "line-color": "rgba(255,255,255,.95)",
                "line-width": 4.4,
                "line-opacity": 0.9,
              }}
            />
            <Layer
              id="priority-selected-line"
              type="line"
              filter={selectedFilter}
              paint={{
                "line-color": "#000000",
                "line-width": 2.2,
                "line-opacity": 1,
              }}
            />
          </Source>
        )}

        {data.flood && layers.flood && (
          <Source id="flood" type="geojson" data={data.flood} promoteId="id">
            <Layer
              id="flood-fill"
              type="fill"
              {...filterProps(areaFilter)}
              paint={{
                "fill-color": FLOOD_FILL_COLOR,
                "fill-opacity": opacity.flood,
              }}
            />
            <Layer
              id="flood-line"
              type="line"
              {...filterProps(areaFilter)}
              paint={{
                "line-color": "rgba(255,255,255,.8)",
                "line-width": 0.85,
                "line-opacity": 0.85,
              }}
            />
          </Source>
        )}

        {FACTOR_CONFIGS.map((factor) => {
          if (!layers[factor.id] || !data[factor.id]) return null;
          return (
            <Source
              key={factor.id}
              id={factor.id}
              type="geojson"
              data={data[factor.id] as FeatureCollection}
              promoteId="id"
            >
              <Layer
                id={`${factor.id}-fill`}
                type="fill"
                {...filterProps(areaFilter)}
                paint={{
                  "fill-color": factorFillColor(factor.id),
                  "fill-opacity": opacity[factor.id],
                }}
              />
              <Layer
                id={`${factor.id}-line`}
                type="line"
                {...filterProps(areaFilter)}
                paint={{
                  "line-color": "rgba(255,255,255,.64)",
                  "line-width": 0.65,
                  "line-opacity": 0.8,
                }}
              />
              {factor.id === "landcover" && (
                <Layer
                  id="landcover-duplicate-outline"
                  type="line"
                  filter={combineFilters(areaFilter, [
                    "==",
                    ["get", "duplicate"],
                    true,
                  ])}
                  paint={{
                    "line-color": "#ff7f00",
                    "line-width": 1.35,
                    "line-dasharray": [1.6, 1.2],
                    "line-opacity": 0.95,
                  }}
                />
              )}
            </Source>
          );
        })}

        {layers.roads && data.roads && (
          <RoadLayers data={data.roads} opacity={opacity.roads} />
        )}

        {layers.admin &&
          data.admin?.features.map((feature) => {
            const center = feature.properties.center;
            if (!center) return null;
            return (
              <Marker
                key={feature.properties.id}
                longitude={center[0]}
                latitude={center[1]}
                anchor="center"
                offset={ADMIN_LABEL_OFFSETS[feature.properties.id] ?? [0, 0]}
              >
                <div className="pointer-events-none flex -translate-y-1 items-center gap-1.5 rounded-full border border-white/75 bg-white/75 px-2 py-1 shadow-[0_4px_14px_-6px_rgba(4,30,51,.4)] backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-black" />
                  <span className="whitespace-nowrap text-[7.5px] font-extrabold uppercase tracking-[0.13em] text-black sm:text-[8px]">
                    {feature.properties.kecamatan}
                  </span>
                </div>
              </Marker>
            );
          })}
      </Map>

      {hover && mapReady && <FeatureTooltip hover={hover} />}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#1f1a17]/10 to-transparent" />

      {!layers.priority &&
        !layers.flood &&
        !layers.landcover &&
        !layers.slope &&
        !layers.elevation &&
        !layers.river &&
        !layers.roads && (
          <div className="absolute left-1/2 top-24 z-20 -translate-x-1/2">
            <button
              type="button"
              onClick={() => useAppStore.getState().setLayerEnabled("priority", true)}
              className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2.5 text-[11.5px] font-bold text-ink shadow-[0_16px_40px_-16px_rgba(4,30,51,.4)] backdrop-blur-xl transition-colors hover:bg-white"
            >
              <Drop size={15} weight="fill" className="text-blue-600" />
              Tampilkan prioritas BGI
            </button>
          </div>
        )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-[#1f1a17]/10 to-transparent" />

      <div className="pointer-events-auto absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/70 bg-white/72 px-3 py-1.5 text-[8.5px] text-ink-faint shadow-sm backdrop-blur sm:flex">
        <span className="font-semibold uppercase tracking-[0.12em] text-ink-soft">
          Sumber
        </span>
        <span className="h-1 w-1 rounded-full bg-mist-300" />
        <span
          className="[&_a]:font-medium [&_a]:text-blue-700 [&_a]:underline [&_a]:decoration-blue-700/20 [&_a]:underline-offset-2"
          dangerouslySetInnerHTML={{ __html: BASEMAPS[basemap].attribution }}
        />
        <span className="h-1 w-1 rounded-full bg-mist-300" />
        <span>Data BGI Cirebon · Jalan RBI 25K</span>
      </div>

      <MapControls mapRef={mapRef} />

      {(isInitialLoading || initialError) && (
        <MapLoadingOverlay error={initialError} onRetry={retryInitial} />
      )}
    </div>
  );
}
