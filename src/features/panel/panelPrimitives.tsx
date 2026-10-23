import { Info } from "@phosphor-icons/react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { legendForLayer } from "@/lib/layers";
import { cn, formatArea, formatNumber } from "@/lib/format";
import type { LayerId, SummaryData } from "@/types";

export function SectionLabel({
  children,
  meta,
  className,
}: {
  children: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-2 flex items-center justify-between gap-3", className)}>
      <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-ink-faint">
        {children}
      </p>
      {meta && (
        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-faint">
          {meta}
        </span>
      )}
    </div>
  );
}

export function LegendList({
  layer,
  summary,
  compact = false,
}: {
  layer: LayerId;
  summary: SummaryData;
  compact?: boolean;
}) {
  const items = legendForLayer(layer, summary);
  if (!items.length) return null;
  const hasArea = items.some(
    (item) => typeof item.areaHa === "number" && item.areaHa > 0
  );
  const hasScores = items.some((item) => typeof item.score === "number");

  return (
    <div
      className={cn(
        "grid gap-x-3 gap-y-2",
        hasScores || compact === false ? "grid-cols-1" : "grid-cols-2"
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex min-w-0 items-center gap-2 text-[10.5px] text-ink-soft"
        >
          {item.kind === "line" || item.kind === "line-dashed" ? (
            <span className="relative flex h-3 w-6 shrink-0 items-center">
              <span
                className="absolute inset-x-0 rounded-full"
                style={{
                  backgroundColor: item.casingColor,
                  height: (item.lineWidth ?? 1.4) + 2.2,
                }}
              />
              <span
                className="absolute inset-x-0 rounded-full"
                style={{
                  height: item.lineWidth ?? 1.4,
                  backgroundColor:
                    item.kind === "line-dashed" ? "transparent" : item.color,
                  backgroundImage:
                    item.kind === "line-dashed"
                      ? `repeating-linear-gradient(90deg, ${item.color} 0 4px, transparent 4px 6.5px)`
                      : undefined,
                }}
              />
            </span>
          ) : (
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[4px] ring-1 ring-inset ring-black/10"
              style={{ backgroundColor: item.color }}
            />
          )}
          <span className="min-w-0 flex-1 truncate font-medium text-ink">
            {item.displayLabel}
          </span>
          {typeof item.score === "number" && (
            <span
              className="shrink-0 rounded-md bg-blue-500/10 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-blue-700"
              title={`Skor parameter dari atribut QGIS: ${item.score}`}
            >
              skor {item.score}
            </span>
          )}
          {typeof item.areaHa === "number" && item.areaHa > 0 && (
            <span className="shrink-0 font-mono text-[9px] text-ink-faint">
              {formatNumber(item.areaHa, 0)}
            </span>
          )}
        </div>
      ))}
      {hasScores && (
        <div className="mt-0.5 flex items-start gap-1.5 text-[9px] leading-relaxed text-ink-faint">
          <Info size={10} className="mt-0.5 shrink-0" />
          <span>
            Skor 1–5 berasal dari atribut QGIS.{" "}
            {layer === "flood"
              ? "Skor 5 = bahaya tertinggi."
              : "Skor 5 = paling mendukung BGI."}
            {hasArea ? " Angka kanan adalah luas (ha)." : ""}
          </span>
        </div>
      )}
      {hasArea && !hasScores && (
        <div className="mt-0.5 flex items-center gap-1.5 text-[9px] text-ink-faint">
          <Info size={10} />
          Angka menunjukkan luas dalam hektare.
        </div>
      )}
      {layer === "roads" && (
        <div className="mt-0.5 flex items-center gap-1.5 text-[9px] text-ink-faint">
          <Info size={10} />
          Simbol jalan mengikuti SNI 6502.2:2010.
        </div>
      )}
    </div>
  );
}

export function OpacityControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-0.5 flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-faint">
          Opasitas
        </span>
        <span className="font-mono text-[9.5px] text-ink-soft">
          {Math.round(value * 100)}%
        </span>
      </div>
      <Slider
        value={[Math.round(value * 100)]}
        min={20}
        max={100}
        step={1}
        onValueChange={(next) => onChange((next[0] ?? 100) / 100)}
        aria-label="Atur opasitas layer"
      />
    </div>
  );
}

export function DataQualityNote({ summary }: { summary: SummaryData }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="flex w-full items-start gap-2 rounded-xl border border-amber-500/18 bg-amber-500/[0.06] px-2.5 py-2 text-left transition-colors hover:bg-amber-500/[0.1]"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-[#99610c]">
            <Info size={12} weight="fill" />
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-bold text-[#8b5b0f]">
              {summary.landcover.duplicateGroups} pasang geometri duplikat
            </span>
            <span className="mt-0.5 block truncate text-[9px] text-[#99610c]/80">
              Tutupan lahan perlu dibaca dengan catatan validasi.
            </span>
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[280px]">
        Ekspor asli memuat {summary.landcover.sourceFeatures} fitur tutupan lahan
        dengan {summary.landcover.duplicateGroups} pasang geometri yang sama namun
        dua kelas berbeda. Atlas menampilkan kelas dari fitur teratas agar sesuai
        visual ekspor asli. Total luas unik: {formatArea(summary.landcover.uniqueAreaHa)}.
      </TooltipContent>
    </Tooltip>
  );
}
