import * as React from "react";
import { Link } from "react-router-dom";
import {
  ChartBar,
  Funnel,
  MagnifyingGlass,
  SlidersHorizontal,
  Stack,
} from "@phosphor-icons/react";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { useData } from "@/providers/DataProvider";
import { useAppStore } from "@/stores/useAppStore";
import { activeFilterCount } from "@/lib/layers";
import { formatDate } from "@/lib/format";
import { LayersTab } from "@/features/panel/LayersTab";
import { FilterTab } from "@/features/panel/FilterTab";
import { StatsTab } from "@/features/panel/StatsTab";

export function PanelTabs({
  value,
  onChange,
  includeDetail = false,
  detailActive = false,
  className,
}: {
  value: string;
  onChange: (value: any) => void;
  includeDetail?: boolean;
  detailActive?: boolean;
  className?: string;
}) {
  const filters = useAppStore((state) => state.filters);
  const options = [
    { value: "layers", label: "Layer", icon: <Stack size={12} weight="bold" /> },
    {
      value: "filter",
      label: "Filter",
      icon: <Funnel size={12} weight="bold" />,
      count: activeFilterCount(filters) || undefined,
    },
    {
      value: "stats",
      label: "Statistik",
      icon: <ChartBar size={12} weight="bold" />,
    },
    ...(includeDetail
      ? [
          {
            value: "detail",
            label: "Detail",
            icon: <MapPinIcon active={detailActive} />,
          },
        ]
      : []),
  ];

  return (
    <SegmentedTabs
      options={options}
      value={value}
      onChange={onChange}
      className={className}
      ariaLabel="Panel peta"
    />
  );
}

function MapPinIcon({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-3 w-3 items-center justify-center">
      <span
        className={
          active
            ? "h-1.5 w-1.5 rounded-full bg-aqua-300"
            : "h-1.5 w-1.5 rounded-full bg-current opacity-50"
        }
      />
    </span>
  );
}

export function LayerPanel() {
  const { summary } = useData();
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setCommandOpen = useAppStore((state) => state.setCommandOpen);
  const filters = useAppStore((state) => state.filters);

  return (
    <aside className="pointer-events-auto fixed bottom-5 left-5 top-[86px] z-30 hidden w-[366px] lg:flex xl:left-6">
      <div className="flex h-full w-full flex-col rounded-[28px] border border-white/70 bg-white/42 p-1.5 shadow-[0_26px_80px_-30px_rgba(4,30,51,.45)] backdrop-blur-2xl">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[23px] border border-white/70 bg-white/[0.96] shadow-[inset_0_1px_0_rgba(255,255,255,.9)]">
          <div className="px-4 pb-3 pt-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="flex items-center gap-1.5 font-mono text-[8.5px] font-medium uppercase tracking-[0.18em] text-ink-faint">
                  <span className="h-1.5 w-1.5 rounded-full bg-aqua-400" />
                  Atlas BGI · Cirebon
                </p>
                <h1 className="mt-1 text-[20px] font-extrabold leading-none tracking-[-0.045em] text-ink">
                  Eksplorasi peta
                </h1>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCommandOpen(true)}
                  aria-label="Cari layer atau lokasi"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-mist-200/80 bg-white text-ink-faint transition-colors hover:bg-mist-50 hover:text-ink"
                >
                  <MagnifyingGlass size={14} weight="bold" />
                </button>
                <Link
                  to="/metodologi"
                  aria-label="Buka metodologi"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-mist-200/80 bg-white text-ink-faint transition-colors hover:bg-mist-50 hover:text-ink"
                >
                  <SlidersHorizontal size={14} weight="bold" />
                </Link>
              </div>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-ink-soft">
              Jelajahi prioritas Blue-Green Infrastructure dari empat parameter
              spasial.
            </p>
            <PanelTabs
              value={activeTab}
              onChange={setActiveTab}
              className="mt-3"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 thin-scrollbar">
            {activeTab === "layers" && <LayersTab />}
            {activeTab === "filter" && <FilterTab />}
            {activeTab === "stats" && <StatsTab />}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-mist-100 px-4 py-2.5">
            <div>
              <p className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-ink-faint">
                Sumber data
              </p>
              <p className="mt-0.5 text-[8.5px] text-ink-soft">
                Analisis BGI · {formatDate(summary.generatedAt)}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {activeFilterCount(filters) > 0 && (
                <span className="rounded-full bg-blue-500/10 px-1.5 py-0.5 font-mono text-[7.5px] font-semibold text-blue-700">
                  {activeFilterCount(filters)} filter
                </span>
              )}
              <Link
                to="/ringkasan"
                className="text-[8.5px] font-semibold text-blue-700 underline decoration-blue-700/20 underline-offset-2"
              >
                Ringkasan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
