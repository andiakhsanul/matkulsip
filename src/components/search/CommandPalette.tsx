import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import {
  ArrowsOut,
  Check,
  Compass,
  Copy,
  Database,
  Drop,
  Info,
  MapPin,
  MapTrifold,
  MoonStars,
  Mountains,
  Path,
  Plant,
  RoadHorizon,
  Ruler,
  ShareNetwork,
  SlidersHorizontal,
  Sparkle,
  Stack,
  Waves,
  X,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useAppStore } from "@/stores/useAppStore";
import { useData } from "@/providers/DataProvider";
import { BASEMAPS, BASEMAP_ORDER } from "@/lib/basemaps";
import { NAV_ITEMS } from "@/lib/navigation";
import { LAYER_META } from "@/lib/constants";
import { cn, formatArea } from "@/lib/format";
import type { LayerId } from "@/types";

const layerIcons: Record<LayerId, React.ReactNode> = {
  priority: <Stack size={16} weight="fill" />,
  flood: <Waves size={16} weight="fill" />,
  roads: <RoadHorizon size={16} weight="fill" />,
  landcover: <Plant size={16} weight="fill" />,
  slope: <Mountains size={16} weight="fill" />,
  elevation: <Ruler size={16} weight="fill" />,
  river: <Path size={16} weight="fill" />,
  admin: <MapPin size={16} weight="fill" />,
};

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-md border border-mist-200 bg-mist-50 px-1.5 py-0.5 font-mono text-[9px] font-medium text-ink-faint">
      {children}
    </kbd>
  );
}

export function CommandPalette() {
  const open = useAppStore((state) => state.commandOpen);
  const setOpen = useAppStore((state) => state.setCommandOpen);
  const setLayerEnabled = useAppStore((state) => state.setLayerEnabled);
  const setBasemap = useAppStore((state) => state.setBasemap);
  const resetFilters = useAppStore((state) => state.resetFilters);
  const toggleKecamatan = useAppStore((state) => state.toggleKecamatan);
  const setMobileSheetOpen = useAppStore((state) => state.setMobileSheetOpen);
  const { summary } = useData();
  const navigate = useNavigate();

  function run(action: () => void) {
    action();
    setOpen(false);
  }

  function go(to: string) {
    run(() => navigate(to));
  }

  function enableLayer(id: LayerId) {
    setLayerEnabled(id, true);
    setMobileSheetOpen(false);
    run(() => {
      if (window.location.pathname !== "/") navigate("/");
    });
  }

  function copyLink() {
    void navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success("Tautan disalin");
    });
    setOpen(false);
  }

  function resetView() {
    window.dispatchEvent(new CustomEvent("bgi:reset-view"));
    setOpen(false);
  }

  function fullscreen() {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen();
    }
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-ocean-950/38 backdrop-blur-[3px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-[12vh] z-[90] w-[min(92vw,640px)] -translate-x-1/2 overflow-hidden rounded-[24px] border border-white/80 bg-white/95 shadow-[0_34px_100px_-24px_rgba(4,30,51,.6)] outline-none backdrop-blur-2xl">
          <Dialog.Title className="sr-only">Pencarian dan perintah atlas</Dialog.Title>
          <Dialog.Description className="sr-only">
            Cari halaman, layer, kecamatan, atau jalankan aksi peta.
          </Dialog.Description>
          <Command
            label="Pencarian dan perintah"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[9.5px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-ink-faint [&_[cmdk-group]]:px-2 [&_[cmdk-item]]:flex [&_[cmdk-item]]:cursor-pointer [&_[cmdk-item]]:items-center [&_[cmdk-item]]:gap-3 [&_[cmdk-item]]:rounded-xl [&_[cmdk-item]]:px-2.5 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]]:text-[12px] [&_[cmdk-item]]:font-medium [&_[cmdk-item]]:text-ink [&_[cmdk-item][data-selected=true]]:bg-mist-100 [&_[cmdk-item][data-selected=true]]:text-blue-700 [&_[cmdk-item]_svg]:shrink-0"
          >
            <div className="flex items-center gap-3 border-b border-mist-200/80 px-4 py-3.5">
              <Compass size={19} className="text-blue-600" weight="bold" />
              <Command.Input
                autoFocus
                placeholder="Cari layer, kecamatan, atau perintah…"
                className="h-7 w-full bg-transparent text-[13.5px] font-medium text-ink outline-none placeholder:text-ink-faint"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup pencarian"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-mist-100 hover:text-ink"
              >
                <X size={14} weight="bold" />
              </button>
            </div>
            <Command.List className="max-h-[min(58vh,460px)] overflow-y-auto overscroll-contain pb-2 thin-scrollbar">
              <Command.Empty className="px-5 py-12 text-center text-[12px] text-ink-soft">
                Tidak ada hasil. Coba kata kunci lain.
              </Command.Empty>

              <Command.Group heading="Navigasi">
                {NAV_ITEMS.map((item) => (
                  <Command.Item key={item.to} value={`halaman ${item.label}`} onSelect={() => go(item.to)}>
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist-100 text-blue-700">
                      {item.to === "/" ? (
                        <MapTrifold size={15} weight="bold" />
                      ) : (
                        <Sparkle size={15} weight="bold" />
                      )}
                    </span>
                    <span>{item.label}</span>
                    <span className="ml-auto font-mono text-[9px] uppercase tracking-wider text-ink-faint">
                      halaman
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading="Layer peta">
                {(Object.keys(LAYER_META) as LayerId[]).map((id) => (
                  <Command.Item
                    key={id}
                    value={`layer ${LAYER_META[id].label} ${LAYER_META[id].shortLabel}`}
                    onSelect={() => enableLayer(id)}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist-100 text-blue-700">
                      {layerIcons[id]}
                    </span>
                    <span>{LAYER_META[id].label}</span>
                    <span className="ml-auto text-[10px] text-ink-faint">
                      {id === "priority" ? formatArea(summary.priority.totalAreaHa) : "tampilkan"}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading="Filter kecamatan">
                {summary.priority.kecamatan.map((kecamatan) => (
                  <Command.Item
                    key={kecamatan.name}
                    value={`kecamatan ${kecamatan.name} filter`}
                    onSelect={() =>
                      run(() => {
                        toggleKecamatan(kecamatan.name);
                        if (window.location.pathname !== "/") navigate("/");
                      })
                    }
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist-100 text-blue-700">
                      <MapPin size={15} weight="bold" />
                    </span>
                    <span>{kecamatan.name}</span>
                    <span className="ml-auto text-[10px] text-ink-faint">
                      {formatArea(kecamatan.totalAreaHa)}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading="Latar peta">
                {BASEMAP_ORDER.map((id) => (
                  <Command.Item
                    key={id}
                    value={`basemap ${BASEMAPS[id].label} latar`}
                    onSelect={() => run(() => setBasemap(id))}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist-100 text-blue-700">
                      {id === "satellite" ? (
                        <MapTrifold size={15} weight="bold" />
                      ) : id === "dark" ? (
                        <MoonStars size={15} weight="bold" />
                      ) : (
                        <MapPin size={15} weight="bold" />
                      )}
                    </span>
                    <span>Latar {BASEMAPS[id].label}</span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading="Aksi">
                <Command.Item value="reset filter" onSelect={() => run(resetFilters)}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist-100 text-blue-700">
                    <SlidersHorizontal size={15} weight="bold" />
                  </span>
                  <span>Reset semua filter</span>
                </Command.Item>
                <Command.Item value="reset tampilan peta zoom kota" onSelect={resetView}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist-100 text-blue-700">
                    <Compass size={15} weight="bold" />
                  </span>
                  <span>Kembali ke tampilan kota</span>
                </Command.Item>
                <Command.Item value="salin tautan share" onSelect={copyLink}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist-100 text-blue-700">
                    <Copy size={15} weight="bold" />
                  </span>
                  <span>Salin tautan atlas</span>
                </Command.Item>
                <Command.Item value="layar penuh fullscreen" onSelect={fullscreen}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist-100 text-blue-700">
                    <ArrowsOut size={15} weight="bold" />
                  </span>
                  <span>Layar penuh</span>
                </Command.Item>
                <Command.Item value="bagikan share" onSelect={copyLink}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist-100 text-blue-700">
                    <ShareNetwork size={15} weight="bold" />
                  </span>
                  <span>Bagikan atlas</span>
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Tentang data">
                <Command.Item value="metodologi data kualitas duplikat" onSelect={() => go("/metodologi")}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist-100 text-blue-700">
                    <Info size={15} weight="bold" />
                  </span>
                  <span>Baca metodologi & catatan data</span>
                </Command.Item>
                <Command.Item value="sumber data database" onSelect={() => go("/tentang")}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist-100 text-blue-700">
                    <Database size={15} weight="bold" />
                  </span>
                  <span>Sumber data dan kredit</span>
                </Command.Item>
              </Command.Group>
            </Command.List>
            <div className="flex items-center justify-between border-t border-mist-200/80 bg-mist-50/60 px-4 py-2.5">
              <div className="flex items-center gap-3 text-[9.5px] text-ink-faint">
                <span className="flex items-center gap-1">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd>
                  jelajah
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>↵</Kbd>
                  pilih
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-faint">
                BGI Cirebon
              </span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
