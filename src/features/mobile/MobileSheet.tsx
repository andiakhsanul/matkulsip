import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChartBar,
  Funnel,
  MapPin,
  SlidersHorizontal,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/format";
import { useAppStore } from "@/stores/useAppStore";
import { useData } from "@/providers/DataProvider";
import { activeFilterCount } from "@/lib/layers";
import { PanelTabs } from "@/features/panel/LayerPanel";
import { LayersTab } from "@/features/panel/LayersTab";
import { FilterTab } from "@/features/panel/FilterTab";
import { StatsTab } from "@/features/panel/StatsTab";
import { DetailContent } from "@/features/detail/DetailContent";
import type { MobileSheetTab } from "@/types";

const tabMeta: Record<MobileSheetTab, { label: string; title: string; icon: React.ReactNode }> = {
  layers: {
    label: "Layer",
    title: "Layer & legenda",
    icon: <SlidersHorizontal size={18} weight="bold" />,
  },
  filter: {
    label: "Filter",
    title: "Filter wilayah",
    icon: <Funnel size={18} weight="bold" />,
  },
  stats: {
    label: "Statistik",
    title: "Statistik prioritas",
    icon: <ChartBar size={18} weight="bold" />,
  },
  detail: {
    label: "Detail",
    title: "Detail wilayah",
    icon: <MapPin size={18} weight="bold" />,
  },
};

export function MobileDock() {
  const activeTab = useAppStore((state) => state.mobileTab);
  const setMobileTab = useAppStore((state) => state.setMobileTab);
  const sheetOpen = useAppStore((state) => state.mobileSheetOpen);
  const setSheetOpen = useAppStore((state) => state.setMobileSheetOpen);
  const filters = useAppStore((state) => state.filters);
  const selected = useAppStore((state) => state.selected);
  const filterCount = activeFilterCount(filters);

  const tabs: MobileSheetTab[] = ["layers", "filter", "stats", "detail"];

  return (
    <div className="safe-bottom fixed inset-x-3 bottom-3 z-40 lg:hidden">
      <div className="mx-auto flex max-w-[460px] items-center gap-1 rounded-[22px] border border-white/80 bg-white/88 p-1.5 shadow-[0_18px_50px_-20px_rgba(4,30,51,.45)] backdrop-blur-2xl">
        {tabs.map((tab) => {
          const meta = tabMeta[tab];
          const active = sheetOpen && activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                if (active) {
                  setSheetOpen(false);
                } else {
                  setMobileTab(tab);
                  setSheetOpen(true);
                }
              }}
              aria-label={meta.title}
              className={cn(
                "relative flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-[17px] text-[8.5px] font-semibold transition-all",
                active
                  ? "bg-ocean-950 text-white shadow-[0_8px_18px_-10px_rgba(4,30,51,.9)]"
                  : "text-ink-faint hover:bg-mist-50 hover:text-ink"
              )}
            >
              {meta.icon}
              <span>{meta.label}</span>
              {tab === "filter" && filterCount > 0 && (
                <span className="absolute right-2 top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-amber-500 px-1 font-mono text-[7.5px] font-bold text-white">
                  {filterCount}
                </span>
              )}
              {tab === "detail" && selected && (
                <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-aqua-400 ring-2 ring-white/50" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MobileSheet() {
  const open = useAppStore((state) => state.mobileSheetOpen);
  const setOpen = useAppStore((state) => state.setMobileSheetOpen);
  const tab = useAppStore((state) => state.mobileTab);
  const setTab = useAppStore((state) => state.setMobileTab);
  const selected = useAppStore((state) => state.selected);
  const selectFeature = useAppStore((state) => state.selectFeature);
  const { summary } = useData();
  const title = tabMeta[tab].title;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="mobile-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-ocean-950/25 backdrop-blur-[2px] lg:hidden"
          />
          <motion.div
            key="mobile-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.18 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 650) setOpen(false);
            }}
            className="fixed inset-x-0 bottom-0 z-50 flex h-[78dvh] max-h-[820px] flex-col overflow-hidden rounded-t-[30px] border border-white/80 bg-white/[0.98] shadow-[0_-30px_80px_-24px_rgba(4,30,51,.45)] lg:hidden"
          >
            <div className="shrink-0 border-b border-mist-100 px-4 pb-3 pt-2.5">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-mist-200" />
              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink-faint">
                    BGI Cirebon · {summary.priority.kecamatan.length} kecamatan
                  </p>
                  <h2 className="mt-0.5 text-[17px] font-extrabold tracking-[-0.04em] text-ink">
                    {title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup panel"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-mist-200/80 bg-white text-ink-faint transition-colors hover:bg-mist-50 hover:text-ink"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>
              <PanelTabs
                value={tab}
                onChange={(value) => setTab(value as MobileSheetTab)}
                includeDetail
                detailActive={Boolean(selected)}
                className="mt-3"
              />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-9 pt-3 thin-scrollbar">
              {tab === "layers" && <LayersTab />}
              {tab === "filter" && <FilterTab />}
              {tab === "stats" && <StatsTab />}
              {tab === "detail" && (
                <DetailContent
                  selected={selected}
                  onClose={() => selectFeature(null)}
                  compact
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
