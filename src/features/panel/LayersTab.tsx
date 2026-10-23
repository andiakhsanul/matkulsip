import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Info,
  MapTrifold,
  Sparkle,
  TrendUp,
} from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useData } from "@/providers/DataProvider";
import { useAppStore } from "@/stores/useAppStore";
import {
  BASEMAPS,
  BASEMAP_ORDER,
} from "@/lib/basemaps";
import {
  FACTOR_LAYERS,
  LAYER_META,
} from "@/lib/constants";
import { legendForLayer, scoreRange } from "@/lib/layers";
import { cn, formatArea, formatNumber, formatPercent } from "@/lib/format";
import { LayerIcon } from "@/features/panel/layerIcons";
import {
  DataQualityNote,
  LegendList,
  OpacityControl,
  SectionLabel,
} from "@/features/panel/panelPrimitives";
import type { LayerId } from "@/types";

const basemapVisuals: Record<string, string> = {
  light: "linear-gradient(135deg,#f7fbfe 0%,#dcecf5 52%,#bcd9e9 100%)",
  satellite: "linear-gradient(135deg,#244435 0%,#7c9a72 42%,#31586a 100%)",
  dark: "linear-gradient(135deg,#061723 0%,#0a3149 55%,#0c4a68 100%)",
};

function PriorityHero() {
  const { summary } = useData();
  const layers = useAppStore((state) => state.layers);
  const setLayerEnabled = useAppStore((state) => state.setLayerEnabled);
  const active = layers.priority;
  const total = summary.priority.totalAreaHa;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[22px] p-4 transition-all",
        active
          ? "bg-gradient-to-br from-ocean-950 via-[#073b5f] to-blue-700 text-white shadow-[0_20px_44px_-24px_rgba(4,30,51,.75)]"
          : "border border-mist-200 bg-mist-50"
      )}
    >
      {active && (
        <>
          <div className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-1 -top-4 h-20 w-20 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-aqua-300/10 blur-2xl" />
        </>
      )}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              active ? "bg-white/12 text-aqua-300" : "bg-blue-500/10 text-blue-700"
            )}
          >
            <LayerIcon id="priority" size={17} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[12px] font-extrabold tracking-[-0.02em]">
                Prioritas BGI
              </span>
              <Badge
                tone={active ? "glass" : "blue"}
                className="px-1.5 py-0.5 text-[8px]"
              >
                Layer utama
              </Badge>
            </div>
            <p
              className={cn(
                "mt-1 text-[10.5px] leading-relaxed",
                active ? "text-white/55" : "text-ink-soft"
              )}
            >
              Weighted overlay empat parameter.
            </p>
          </div>
        </div>
        <Switch
          checked={active}
          onCheckedChange={(checked) => setLayerEnabled("priority", checked)}
          aria-label="Tampilkan layer prioritas BGI"
          className={active ? "data-[state=checked]:bg-aqua-400" : ""}
        />
      </div>

      {active ? (
        <>
          <div className="relative mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
                Area dianalisis
              </p>
              <p className="mt-1 text-[27px] font-bold leading-none tracking-[-0.05em]">
                {formatNumber(total, 1)}
                <span className="ml-1 text-[12px] font-medium tracking-normal text-white/50">
                  ha
                </span>
              </p>
            </div>
            <div className="rounded-xl border border-white/12 bg-white/[0.07] px-2.5 py-2 text-right">
              <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/40">
                Prioritas tinggi
              </p>
              <p className="mt-0.5 text-[16px] font-bold tracking-[-0.03em] text-aqua-300">
                {formatPercent(summary.priority.highPriorityPct, 1)}
              </p>
            </div>
          </div>
          <div className="relative mt-4 flex h-1.5 overflow-hidden rounded-full bg-white/10">
            {summary.priority.classes.map((item) => (
              <span
                key={item.label}
                className="h-full first:rounded-l-full last:rounded-r-full"
                style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                title={`${item.label}: ${formatArea(item.areaHa)} (${formatPercent(item.pct)})`}
              />
            ))}
          </div>
          <div className="relative mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {summary.priority.classes.map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-1 text-[9px] text-white/50"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </span>
            ))}
          </div>
          <div className="relative mt-4 flex items-center justify-between border-t border-white/10 pt-2.5">
            <span className="flex items-center gap-1.5 text-[9px] text-white/45">
              <Sparkle size={11} weight="fill" className="text-aqua-300" />
              Klik wilayah untuk detail
            </span>
            <span className="flex items-center gap-1 text-[9px] font-semibold text-aqua-300">
              Aktif
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aqua-300" />
            </span>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setLayerEnabled("priority", true)}
          className="relative mt-3 flex w-full items-center justify-between rounded-xl bg-white px-3 py-2.5 text-left shadow-sm transition-colors hover:bg-mist-50"
        >
          <span className="text-[10.5px] font-semibold text-ink">
            Tampilkan layer prioritas
          </span>
          <ArrowRight size={14} weight="bold" className="text-blue-600" />
        </button>
      )}
    </div>
  );
}

function LayerRow({ id, summary }: { id: LayerId; summary: ReturnType<typeof useData>["summary"] }) {
  const meta = LAYER_META[id];
  const layers = useAppStore((state) => state.layers);
  const opacity = useAppStore((state) => state.opacity);
  const setLayerEnabled = useAppStore((state) => state.setLayerEnabled);
  const setOpacity = useAppStore((state) => state.setOpacity);
  const active = layers[id];
  const { metadata, data } = useData();

  const weight = metadata.weights.find((item) => item.key === id)?.weight;
  const legend = legendForLayer(id, summary);
  const scores = scoreRange(legend);
  const scoreTitle = legend
    .filter((item) => typeof item.score === "number")
    .map((item) => `${item.displayLabel} ${item.score}`)
    .join(" · ");
  const isFactor = (FACTOR_LAYERS as LayerId[]).includes(id);
  const isLoading = data[id] === null && active;
  const showLegend =
    active && !["admin"].includes(id) && (data[id] !== null || id === "priority");

  return (
    <div
      onClick={() => {
        if (!active) setLayerEnabled(id, true);
      }}
      className={cn(
        "rounded-2xl border p-2 transition-all duration-200",
        active
          ? "border-blue-500/18 bg-white shadow-[0_10px_30px_-22px_rgba(4,30,51,.45)]"
          : "border-transparent bg-mist-50/45 hover:bg-white",
        !active && "cursor-pointer"
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
          style={{
            backgroundColor: `${meta.color}16`,
            color: meta.color,
          }}
        >
          <LayerIcon id={id} size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11.5px] font-bold tracking-[-0.015em] text-ink">
              {meta.label}
            </span>
            {typeof weight === "number" && (
              <span className="rounded-md bg-mist-100 px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
                bobot {weight}%
              </span>
            )}
            {scores && (
              <span
                className="rounded-md bg-blue-500/10 px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.06em] text-blue-700"
                title={scoreTitle ? `Skor QGIS — ${scoreTitle}` : undefined}
              >
                skor {scores.min}–{scores.max}
              </span>
            )}
            {id === "roads" && (
              <span className="rounded-md bg-[#c2185b]/10 px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.06em] text-[#a3134e]">
                SNI 25K
              </span>
            )}
            {id === "roads" && data.roads && (
              <span className="font-mono text-[8px] text-ink-faint">
                {data.roads.features.length} segmen
              </span>
            )}
            {isLoading && (
              <span className="h-2.5 w-2.5 animate-spin rounded-full border border-blue-600/20 border-t-blue-600" />
            )}
            {id === "landcover" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full text-[#99610c]">
                    <Info size={12} weight="bold" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {summary.landcover.duplicateGroups} pasang geometri duplikat pada
                  data sumber. Baca catatan kualitas data.
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <p className="mt-0.5 line-clamp-2 text-[9.5px] leading-relaxed text-ink-soft">
            {meta.description}
          </p>
        </div>
        <Switch
          checked={active}
          onCheckedChange={(checked) => setLayerEnabled(id, checked)}
          onClick={(event) => event.stopPropagation()}
          aria-label={`${active ? "Sembunyikan" : "Tampilkan"} layer ${meta.label}`}
          className="mt-0.5"
        />
      </div>

      {showLegend && (
        <div className="mt-2.5 space-y-3 border-t border-mist-100 pt-2.5">
          {id !== "admin" && (
            <OpacityControl
              value={opacity[id]}
              onChange={(value) => setOpacity(id, value)}
            />
          )}
          {id !== "admin" && <LegendList layer={id} summary={summary} compact />}
          {id === "landcover" && <DataQualityNote summary={summary} />}
        </div>
      )}
      {active && id === "admin" && (
        <div className="mt-2.5 border-t border-mist-100 pt-2 text-[9px] leading-relaxed text-ink-soft">
          Batas dan label lima kecamatan ditampilkan sebagai lapisan konteks.
        </div>
      )}
    </div>
  );
}

function BasemapCards() {
  const basemap = useAppStore((state) => state.basemap);
  const setBasemap = useAppStore((state) => state.setBasemap);

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {BASEMAP_ORDER.map((id) => {
        const item = BASEMAPS[id];
        const active = basemap === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setBasemap(id)}
            className={cn(
              "group relative overflow-hidden rounded-xl border p-1.5 text-left transition-all",
              active
                ? "border-blue-600/30 bg-white shadow-sm"
                : "border-mist-200/80 bg-mist-50/50 hover:bg-white"
            )}
          >
            <span
              className="block h-9 w-full rounded-lg ring-1 ring-inset ring-black/5"
              style={{ background: basemapVisuals[id] }}
            >
              <span className="relative block h-full overflow-hidden rounded-lg">
                <span className="absolute inset-x-2 top-2 h-px rotate-[-10deg] bg-white/55" />
                <span className="absolute inset-x-2 top-4 h-px rotate-[7deg] bg-white/30" />
              </span>
            </span>
            <span className="mt-1.5 flex items-center justify-between px-0.5">
              <span className="text-[9.5px] font-bold text-ink">{item.label}</span>
              {active && (
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Check size={8} weight="bold" />
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function LayersTab() {
  const { summary } = useData();

  return (
    <div className="space-y-4">
      <PriorityHero />

      <section>
        <SectionLabel meta="4 parameter · skor 1–5">Parameter analisis</SectionLabel>
        <div className="space-y-1.5">
          {FACTOR_LAYERS.map((id) => (
            <LayerRow key={id} id={id} summary={summary} />
          ))}
        </div>
        <p className="mt-2 flex items-start gap-1.5 px-0.5 text-[9px] leading-relaxed text-ink-faint">
          <Info size={10} className="mt-0.5 shrink-0 text-blue-600" />
          <span>
            Skor 1–5 diambil langsung dari atribut <span className="font-mono">skor</span>{" "}
            pada shapefile QGIS. Untuk empat parameter, skor lebih tinggi berarti
            lebih mendukung BGI.
          </span>
        </p>
      </section>

      <section>
        <SectionLabel meta="Konteks">Layer pendukung</SectionLabel>
        <div className="space-y-1.5">
          <LayerRow id="roads" summary={summary} />
          <LayerRow id="flood" summary={summary} />
          <LayerRow id="admin" summary={summary} />
        </div>
      </section>

      <section>
        <SectionLabel
          meta={
            <span className="flex items-center gap-1">
              <MapTrifold size={10} />
              visual
            </span>
          }
        >
          Latar peta
        </SectionLabel>
        <BasemapCards />
      </section>

      <div className="flex items-start gap-2 rounded-xl bg-mist-50 px-2.5 py-2 text-[9px] leading-relaxed text-ink-soft">
        <Info size={12} className="mt-0.5 shrink-0 text-blue-600" />
        <span>
          Unsur rupa bumi (tutupan lahan, jalan, batas, perairan) mengikuti SNI
          6502.2:2010, sedangkan kelas tematik memakai ramp turunan tinta SNI.
          Tema antarmuka tetap biru. Hanya satu layer tematik ditampilkan pada
          satu waktu.{" "}
          <Link
            to="/metodologi"
            className="font-semibold text-blue-700 underline decoration-blue-700/20 underline-offset-2"
          >
            Pelajari metode
          </Link>
          .
        </span>
      </div>
    </div>
  );
}
