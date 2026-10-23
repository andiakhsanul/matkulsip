import { MapView } from "@/features/map/MapView";
import { LayerPanel } from "@/features/panel/LayerPanel";
import { DetailPanel } from "@/features/detail/DetailPanel";
import { MobileDock, MobileSheet } from "@/features/mobile/MobileSheet";

export function MapPage() {
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-mist-100">
      <MapView />
      <div className="pointer-events-none fixed inset-0 z-[1] map-vignette" />
      <LayerPanel />
      <DetailPanel />
      <MobileDock />
      <MobileSheet />
    </div>
  );
}
