import * as React from "react";
import { toast } from "sonner";
import summaryJson from "@/data/summary.json";
import metadataJson from "@/data/metadata.json";
import type {
  AdminCollection,
  ElevationCollection,
  FloodCollection,
  LandcoverCollection,
  LayerId,
  Metadata,
  PriorityCollection,
  RiverCollection,
  RoadCollection,
  SlopeCollection,
  SummaryData,
} from "@/types";

interface LayerDataMap {
  priority: PriorityCollection | null;
  flood: FloodCollection | null;
  roads: RoadCollection | null;
  admin: AdminCollection | null;
  landcover: LandcoverCollection | null;
  slope: SlopeCollection | null;
  elevation: ElevationCollection | null;
  river: RiverCollection | null;
}

interface DataContextValue {
  summary: SummaryData;
  metadata: Metadata;
  data: LayerDataMap;
  loading: Record<LayerId, boolean>;
  errors: Partial<Record<LayerId, string>>;
  loadLayer: (id: LayerId) => Promise<void>;
  isInitialLoading: boolean;
  initialError: string | null;
  retryInitial: () => void;
}

const initialLoading: Record<LayerId, boolean> = {
  priority: false,
  flood: false,
  roads: false,
  admin: false,
  landcover: false,
  slope: false,
  elevation: false,
  river: false,
};

const DataContext = React.createContext<DataContextValue | null>(null);

const PATHS: Record<LayerId, string> = {
  priority: "data/priority.geojson",
  flood: "data/flood.geojson",
  roads: "data/roads.geojson",
  admin: "data/admin.geojson",
  landcover: "data/factors/landcover.geojson",
  slope: "data/factors/slope.geojson",
  elevation: "data/factors/elevation.geojson",
  river: "data/factors/river-distance.geojson",
};

function dataUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

async function fetchGeoJSON<T>(path: string): Promise<T> {
  const response = await fetch(dataUrl(path), { cache: "force-cache" });
  if (!response.ok) {
    throw new Error(`Gagal memuat data (${response.status})`);
  }
  return (await response.json()) as T;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<LayerDataMap>({
    priority: null,
    flood: null,
    roads: null,
    admin: null,
    landcover: null,
    slope: null,
    elevation: null,
    river: null,
  });
  const [loading, setLoading] = React.useState<Record<LayerId, boolean>>(initialLoading);
  const [errors, setErrors] = React.useState<Partial<Record<LayerId, string>>>({});
  const [initialError, setInitialError] = React.useState<string | null>(null);
  const promises = React.useRef(new Map<LayerId, Promise<void>>());
  const dataRef = React.useRef(data);
  dataRef.current = data;

  const loadLayer = React.useCallback(async (id: LayerId) => {
    if (dataRef.current[id]) return;
    const existing = promises.current.get(id);
    if (existing) return existing;

    const task = (async () => {
      setLoading((current) => ({ ...current, [id]: true }));
      setErrors((current) => ({ ...current, [id]: undefined }));
      try {
        const result = await fetchGeoJSON<unknown>(PATHS[id]);
        setData((current) => ({ ...current, [id]: result }));
        if (id === "priority" || id === "admin") setInitialError(null);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Terjadi kesalahan saat memuat data";
        setErrors((current) => ({ ...current, [id]: message }));
        if (id === "priority" || id === "admin") setInitialError(message);
        toast.error("Data peta gagal dimuat", { description: message });
        throw error;
      } finally {
        setLoading((current) => ({ ...current, [id]: false }));
        promises.current.delete(id);
      }
    })();

    promises.current.set(id, task);
    return task;
  }, []);

  React.useEffect(() => {
    void loadLayer("priority");
    void loadLayer("admin");
    void loadLayer("roads");
  }, [loadLayer]);

  const retryInitial = React.useCallback(() => {
    setInitialError(null);
    void loadLayer("priority");
    void loadLayer("admin");
    void loadLayer("roads");
  }, [loadLayer]);

  const isInitialLoading =
    (!data.priority && loading.priority) || (!data.admin && loading.admin);

  const value = React.useMemo<DataContextValue>(
    () => ({
      summary: summaryJson as unknown as SummaryData,
      metadata: metadataJson as unknown as Metadata,
      data,
      loading,
      errors,
      loadLayer,
      isInitialLoading,
      initialError,
      retryInitial,
    }),
    [data, loading, errors, loadLayer, isInitialLoading, initialError, retryInitial]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

export function useLayerData(id: LayerId, enabled = true) {
  const context = useData();
  React.useEffect(() => {
    if (enabled) {
      void context.loadLayer(id);
    }
  }, [context, enabled, id]);

  return {
    data: context.data[id],
    loading: context.loading[id],
    error: context.errors[id],
  };
}
