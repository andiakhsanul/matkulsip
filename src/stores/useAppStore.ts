import { create } from "zustand";
import type {
  BasemapId,
  LayerId,
  MobileSheetTab,
  PanelTab,
  PriorityLabel,
  SelectedFeature,
} from "@/types";

interface Filters {
  kecamatan: string[];
  priorities: PriorityLabel[];
}

interface AppState {
  basemap: BasemapId;
  layers: Record<LayerId, boolean>;
  opacity: Record<LayerId, number>;
  filters: Filters;
  selected: SelectedFeature | null;
  hoveredId: string | null;
  activeTab: PanelTab;
  mobileTab: MobileSheetTab;
  mobileSheetOpen: boolean;
  mobileSheetSnap: "peek" | "half" | "full";
  commandOpen: boolean;
  mobileMenuOpen: boolean;
  setBasemap: (basemap: BasemapId) => void;
  setLayerEnabled: (id: LayerId, enabled: boolean) => void;
  setOpacity: (id: LayerId, value: number) => void;
  toggleKecamatan: (name: string) => void;
  togglePriority: (label: PriorityLabel) => void;
  setKecamatanFilter: (names: string[]) => void;
  setPriorityFilter: (labels: PriorityLabel[]) => void;
  resetFilters: () => void;
  selectFeature: (feature: SelectedFeature | null) => void;
  setHovered: (id: string | null) => void;
  setActiveTab: (tab: PanelTab) => void;
  setMobileTab: (tab: MobileSheetTab) => void;
  setMobileSheetOpen: (open: boolean) => void;
  setMobileSheetSnap: (snap: "peek" | "half" | "full") => void;
  setCommandOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

const DEFAULT_LAYERS: Record<LayerId, boolean> = {
  priority: true,
  flood: false,
  admin: true,
  landcover: false,
  slope: false,
  elevation: false,
  river: false,
};

const DEFAULT_OPACITY: Record<LayerId, number> = {
  priority: 0.92,
  flood: 0.68,
  admin: 1,
  landcover: 0.72,
  slope: 0.72,
  elevation: 0.72,
  river: 0.72,
};

const EMPTY_FILTERS: Filters = { kecamatan: [], priorities: [] };

export const useAppStore = create<AppState>((set, get) => ({
  basemap: "light",
  layers: DEFAULT_LAYERS,
  opacity: DEFAULT_OPACITY,
  filters: EMPTY_FILTERS,
  selected: null,
  hoveredId: null,
  activeTab: "layers",
  mobileTab: "layers",
  mobileSheetOpen: false,
  mobileSheetSnap: "peek",
  commandOpen: false,
  mobileMenuOpen: false,

  setBasemap: (basemap) => set({ basemap }),

  setLayerEnabled: (id, enabled) => {
    const state = get();
    const nextLayers = { ...state.layers };

    if (id === "admin") {
      nextLayers.admin = enabled;
      set({ layers: nextLayers });
      return;
    }

    if (enabled) {
      if (id === "priority") {
        nextLayers.priority = true;
        nextLayers.flood = false;
        nextLayers.landcover = false;
        nextLayers.slope = false;
        nextLayers.elevation = false;
        nextLayers.river = false;
      } else if (id === "flood") {
        nextLayers.flood = true;
        nextLayers.priority = false;
        nextLayers.landcover = false;
        nextLayers.slope = false;
        nextLayers.elevation = false;
        nextLayers.river = false;
      } else {
        nextLayers[id] = true;
        nextLayers.priority = false;
        nextLayers.flood = false;
        for (const factor of ["landcover", "slope", "elevation", "river"] as const) {
          if (factor !== id) nextLayers[factor] = false;
        }
      }
    } else {
      nextLayers[id] = false;
      if (id === "flood") {
        nextLayers.priority = true;
      }
      if (id === "landcover" || id === "slope" || id === "elevation" || id === "river") {
        nextLayers.priority = true;
      }
    }

    set({ layers: nextLayers, selected: null, hoveredId: null });
  },

  setOpacity: (id, value) =>
    set((state) => ({ opacity: { ...state.opacity, [id]: value } })),

  toggleKecamatan: (name) =>
    set((state) => {
      const exists = state.filters.kecamatan.includes(name);
      return {
        selected: null,
        filters: {
          ...state.filters,
          kecamatan: exists
            ? state.filters.kecamatan.filter((item) => item !== name)
            : [...state.filters.kecamatan, name],
        },
      };
    }),

  togglePriority: (label) =>
    set((state) => {
      const exists = state.filters.priorities.includes(label);
      return {
        selected: null,
        filters: {
          ...state.filters,
          priorities: exists
            ? state.filters.priorities.filter((item) => item !== label)
            : [...state.filters.priorities, label],
        },
      };
    }),

  resetFilters: () => set({ filters: EMPTY_FILTERS, selected: null }),

  setKecamatanFilter: (names) =>
    set((state) => ({
      selected: null,
      filters: { ...state.filters, kecamatan: names },
    })),

  setPriorityFilter: (labels) =>
    set((state) => ({
      selected: null,
      filters: { ...state.filters, priorities: labels },
    })),

  selectFeature: (feature) => set({ selected: feature }),

  setHovered: (id) => set({ hoveredId: id }),

  setActiveTab: (activeTab) => set({ activeTab }),

  setMobileTab: (mobileTab) => set({ mobileTab }),

  setMobileSheetOpen: (mobileSheetOpen) => set({ mobileSheetOpen }),

  setMobileSheetSnap: (mobileSheetSnap) => set({ mobileSheetSnap }),

  setCommandOpen: (commandOpen) => set({ commandOpen }),

  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
}));
