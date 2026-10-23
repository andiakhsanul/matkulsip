import * as React from "react";
import {
  ArrowsIn,
  ArrowsOut,
  Compass,
  Crosshair,
  Minus,
  Plus,
} from "@phosphor-icons/react";
import type { MapRef } from "react-map-gl/maplibre";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/format";

interface MapControlsProps {
  mapRef: React.RefObject<MapRef | null>;
}

function ControlButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-all hover:bg-mist-100 hover:text-ink active:scale-95",
            className
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}

export function MapControls({ mapRef }: MapControlsProps) {
  const [fullscreen, setFullscreen] = React.useState(false);
  const [locating, setLocating] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const zoomIn = () => mapRef.current?.zoomIn({ duration: 280 });
  const zoomOut = () => mapRef.current?.zoomOut({ duration: 280 });
  const reset = () => window.dispatchEvent(new CustomEvent("bgi:reset-view"));

  const locate = () => {
    if (!navigator.geolocation) {
      toast.error("Perangkat tidak mendukung geolokasi");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        mapRef.current?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 14.8,
          duration: 1100,
        });
        toast.success("Lokasi ditemukan");
      },
      () => {
        setLocating(false);
        toast.error("Lokasi tidak dapat diakses", {
          description: "Izinkan akses lokasi pada peramban untuk menggunakan fitur ini.",
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen().catch(() => {
        toast.error("Layar penuh tidak tersedia");
      });
    }
  };

  return (
    <div className="fixed bottom-[86px] right-3 z-20 flex flex-col items-center gap-1.5 sm:bottom-[90px] sm:right-5 lg:bottom-6">
      <div className="rounded-full border border-white/80 bg-white/86 p-1.5 shadow-[0_18px_50px_-20px_rgba(4,30,51,.42)] backdrop-blur-2xl">
        <div className="flex flex-col gap-0.5">
          <ControlButton label="Perbesar" onClick={zoomIn}>
            <Plus size={17} weight="bold" />
          </ControlButton>
          <span className="mx-auto h-px w-5 bg-mist-200" />
          <ControlButton label="Perkecil" onClick={zoomOut}>
            <Minus size={17} weight="bold" />
          </ControlButton>
          <span className="mx-auto h-px w-5 bg-mist-200" />
          <ControlButton label="Kembali ke Kota Cirebon" onClick={reset}>
            <Compass size={17} weight="bold" />
          </ControlButton>
          <ControlButton label="Temukan lokasi saya" onClick={locate}>
            {locating ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600/25 border-t-blue-600" />
            ) : (
              <Crosshair size={17} weight="bold" />
            )}
          </ControlButton>
          <ControlButton
            label={fullscreen ? "Keluar layar penuh" : "Layar penuh"}
            onClick={toggleFullscreen}
            className="hidden sm:flex"
          >
            {fullscreen ? (
              <ArrowsIn size={17} weight="bold" />
            ) : (
              <ArrowsOut size={17} weight="bold" />
            )}
          </ControlButton>
        </div>
      </div>
      <div className="hidden items-center gap-1.5 rounded-full border border-white/70 bg-white/70 px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-ink-faint shadow-sm backdrop-blur sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
        Peta interaktif
      </div>
    </div>
  );
}
