import * as React from "react";
import {
  ArrowCounterClockwise,
  CheckCircle,
  Funnel,
  Info,
  MapPin,
  Sparkle,
  Stack,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useData } from "@/providers/DataProvider";
import { useAppStore } from "@/stores/useAppStore";
import {
  PRIORITY_COLORS,
  PRIORITY_ORDER,
  PRIORITY_TEXT_COLORS,
} from "@/lib/constants";
import {
  activeFilterCount,
  filterArea,
  filterPriorityFeatures,
  getActiveLayer,
} from "@/lib/layers";
import { cn, formatArea, formatNumber, formatPercent } from "@/lib/format";
import { SectionLabel } from "@/features/panel/panelPrimitives";

export function FilterTab() {
  const { summary, data } = useData();
  const filters = useAppStore((state) => state.filters);
  const layers = useAppStore((state) => state.layers);
  const toggleKecamatan = useAppStore((state) => state.toggleKecamatan);
  const togglePriority = useAppStore((state) => state.togglePriority);
  const setKecamatanFilter = useAppStore((state) => state.setKecamatanFilter);
  const setPriorityFilter = useAppStore((state) => state.setPriorityFilter);
  const resetFilters = useAppStore((state) => state.resetFilters);
  const activeLayer = getActiveLayer(layers);
  const activeCount = activeFilterCount(filters);

  const filteredFeatures = React.useMemo(
    () => filterPriorityFeatures(data.priority?.features, filters),
    [data.priority, filters]
  );
  const area = filterArea(filteredFeatures);
  const total = summary.priority.totalAreaHa;
  const pct = total ? (area / total) * 100 : 0;
  const isPriorityMode = activeLayer === "priority";
  const highPriorityActive =
    filters.priorities.length === 2 &&
    filters.priorities.includes("Tinggi") &&
    filters.priorities.includes("Sangat Tinggi");

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold tracking-[-0.02em] text-ink">
            Persempit wilayah analisis
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-ink-soft">
            Filter diterapkan langsung pada layer aktif dan ringkasan area.
          </p>
        </div>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-7 shrink-0 px-2 text-[10px]"
          >
            <ArrowCounterClockwise size={12} weight="bold" />
            Reset
          </Button>
        )}
      </div>

      <div className="rounded-[20px] bg-gradient-to-br from-ocean-950 to-[#073b5f] p-4 text-white shadow-[0_18px_40px_-22px_rgba(4,30,51,.7)]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-white/45">
            <Funnel size={11} weight="fill" className="text-aqua-300" />
            Area terfilter
          </span>
          <Badge tone="glass" className="px-1.5 py-0.5 text-[8px]">
            {filteredFeatures.length} fitur
          </Badge>
        </div>
        <p className="mt-2 text-[26px] font-bold leading-none tracking-[-0.05em]">
          {formatNumber(area, 1)}
          <span className="ml-1 text-[12px] font-medium tracking-normal text-white/45">
            ha
          </span>
        </p>
        <div className="mt-3 flex items-center justify-between text-[9px]">
          <span className="text-white/45">
            {isPriorityMode
              ? "dari area prioritas BGI"
              : "subset layer prioritas; layer aktif tetap mengikuti filter kecamatan"}
          </span>
          <span className="font-mono font-semibold text-aqua-300">
            {formatPercent(pct, 1)}
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-aqua-400 to-blue-400 transition-all duration-500"
            style={{ width: `${Math.max(1, Math.min(pct, 100))}%` }}
          />
        </div>
      </div>

      <section>
        <SectionLabel meta={`${filters.kecamatan.length || "semua"} dipilih`}>
          Kecamatan
        </SectionLabel>
        <div className="space-y-1">
          {summary.priority.kecamatan.map((kecamatan) => {
            const active = filters.kecamatan.includes(kecamatan.name);
            return (
              <button
                key={kecamatan.name}
                type="button"
                onClick={() => toggleKecamatan(kecamatan.name)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-all",
                  active
                    ? "border-blue-500/25 bg-blue-500/[0.055]"
                    : "border-transparent bg-mist-50/55 hover:bg-mist-50"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
                    active ? "bg-blue-600 text-white" : "bg-white text-ink-faint"
                  )}
                >
                  <MapPin size={13} weight={active ? "fill" : "regular"} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10.5px] font-semibold text-ink">
                    {kecamatan.name}
                  </span>
                  <span className="block font-mono text-[8.5px] text-ink-faint">
                    {formatArea(kecamatan.totalAreaHa)} ·{" "}
                    {formatPercent(kecamatan.pctOfAnalyzed, 1)}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
                    active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-mist-300 text-transparent"
                  )}
                >
                  <CheckCircle size={10} weight="fill" />
                </span>
              </button>
            );
          })}
        </div>
        {filters.kecamatan.length > 0 && (
          <button
            type="button"
            onClick={() => setKecamatanFilter([])}
            className="mt-1.5 text-[9px] font-semibold text-blue-700 underline decoration-blue-700/20 underline-offset-2"
          >
            Tampilkan semua kecamatan
          </button>
        )}
      </section>

      <section>
        <SectionLabel meta="layer prioritas">Kelas prioritas</SectionLabel>
        <div className="grid grid-cols-2 gap-1.5">
          {PRIORITY_ORDER.map((label) => {
            const item = summary.priority.classes.find((entry) => entry.label === label);
            const active = filters.priorities.includes(label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => togglePriority(label)}
                className={cn(
                  "rounded-xl border p-2 text-left transition-all",
                  active
                    ? "border-blue-600/30 bg-white shadow-sm"
                    : "border-transparent bg-mist-50/55 hover:bg-white"
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-black/10"
                    style={{ backgroundColor: PRIORITY_COLORS[label] }}
                  />
                  <span
                    className={cn(
                      "flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors",
                      active
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-mist-300 text-transparent"
                    )}
                  >
                    <CheckCircle size={9} weight="fill" />
                  </span>
                </div>
                <p className="mt-1.5 text-[10px] font-bold text-ink">{label}</p>
                <p className="mt-0.5 font-mono text-[8px] text-ink-faint">
                  {item ? formatArea(item.areaHa) : "—"}
                </p>
              </button>
            );
          })}
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[8.5px] leading-relaxed text-ink-faint">
          <Info size={10} className="shrink-0" />
          Filter kelas hanya memengaruhi tampilan layer prioritas.
        </div>
      </section>

      <section>
        <SectionLabel meta="pintasan">Filter cepat</SectionLabel>
        <div className="grid gap-1.5">
          <button
            type="button"
            onClick={() =>
              setPriorityFilter(
                highPriorityActive ? [] : ["Tinggi", "Sangat Tinggi"]
              )
            }
            className={cn(
              "flex items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-all",
              highPriorityActive
                ? "border-blue-500/25 bg-blue-500/[0.06]"
                : "border-mist-200/70 bg-white hover:bg-mist-50"
            )}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-700">
              <Stack size={14} weight="fill" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold text-ink">
                Hanya prioritas tinggi
              </span>
              <span className="block text-[8.5px] text-ink-faint">
                Tinggi + sangat tinggi · {formatArea(summary.priority.highPriorityAreaHa)}
              </span>
            </span>
            {highPriorityActive && (
              <Sparkle size={14} weight="fill" className="text-blue-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setKecamatanFilter([]);
              setPriorityFilter([]);
            }}
            className="flex items-center gap-2.5 rounded-xl border border-mist-200/70 bg-white px-2.5 py-2 text-left transition-colors hover:bg-mist-50"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist-100 text-ink-soft">
              <ArrowCounterClockwise size={14} weight="bold" />
            </span>
            <span>
              <span className="block text-[10px] font-bold text-ink">
                Tampilkan seluruh area
              </span>
              <span className="block text-[8.5px] text-ink-faint">
                {formatArea(total)} · {summary.priority.kecamatan.length} kecamatan
              </span>
            </span>
          </button>
        </div>
      </section>

      {activeCount > 0 && (
        <div className="flex items-start gap-2 rounded-xl bg-mist-50 px-2.5 py-2 text-[9px] leading-relaxed text-ink-soft">
          <Info size={12} className="mt-0.5 shrink-0 text-blue-600" />
          <span>
            {activeCount} filter aktif. Gunakan tombol reset untuk kembali ke
            seluruh area kota.
          </span>
        </div>
      )}
    </div>
  );
}
