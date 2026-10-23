import * as React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  Circle,
  GlobeHemisphereWest,
  List,
  MagnifyingGlass,
  MapTrifold,
  MoonStars,
  ShareNetwork,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { BrandLockup, BrandMark } from "@/components/brand/BrandMark";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BASEMAPS, BASEMAP_ORDER } from "@/lib/basemaps";
import { NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/format";
import { useAppStore } from "@/stores/useAppStore";

const basemapVisuals: Record<string, string> = {
  light: "linear-gradient(135deg,#f7fbfe 0%,#dcecf5 52%,#bcd9e9 100%)",
  satellite: "linear-gradient(135deg,#244435 0%,#7c9a72 42%,#31586a 100%)",
  dark: "linear-gradient(135deg,#061723 0%,#0a3149 55%,#0c4a68 100%)",
};

function BasemapMenu() {
  const basemap = useAppStore((state) => state.basemap);
  const setBasemap = useAppStore((state) => state.setBasemap);
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Pilih latar peta"
          className="text-ink-soft"
        >
          <MapTrifold size={18} weight="bold" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[286px]">
        <div className="px-2 pb-1 pt-1.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
            Latar peta
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
            Pilih dasar visual yang paling nyaman untuk membaca data.
          </p>
        </div>
        <div className="mt-1 space-y-1">
          {BASEMAP_ORDER.map((id) => {
            const item = BASEMAPS[id];
            const active = basemap === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setBasemap(id);
                  setOpen(false);
                }}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-2xl p-1.5 pr-2 text-left transition-colors",
                  active ? "bg-mist-100" : "hover:bg-mist-50"
                )}
              >
                <span
                  className="relative h-11 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-inset ring-black/5"
                  style={{ background: basemapVisuals[id] }}
                >
                  <span className="absolute inset-x-2 top-2 h-px rotate-[-12deg] bg-white/60" />
                  <span className="absolute inset-x-1 top-5 h-px rotate-[8deg] bg-white/35" />
                  <span className="absolute bottom-2 left-2 h-3 w-3 rounded-full border border-white/60" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-ink">
                    {item.label}
                    {id === "satellite" && (
                      <GlobeHemisphereWest size={13} className="text-blue-600" />
                    )}
                    {id === "dark" && <MoonStars size={13} className="text-blue-600" />}
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-snug text-ink-soft">
                    {item.description}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                    active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-mist-300 text-transparent"
                  )}
                >
                  <Check size={11} weight="bold" />
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function useShare() {
  const [copied, setCopied] = React.useState(false);

  const share = React.useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share && window.innerWidth < 768) {
        await navigator.share({
          title: "BGI Cirebon — Blue-Green Atlas",
          text: "Atlas prioritas Blue-Green Infrastructure Kota Cirebon",
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Tautan disalin", {
        description: "Bagikan atlas ini ke rekan atau pemangku kepentingan.",
      });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Tautan tidak dapat dibagikan");
    }
  }, []);

  return { share, copied };
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();

  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[70] overflow-y-auto bg-ocean-950 text-white"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <svg
              viewBox="0 0 800 900"
              className="absolute -right-48 -top-32 h-[720px] w-[720px] opacity-[0.12]"
              fill="none"
            >
              {[0, 1, 2, 3, 4].map((index) => (
                <ellipse
                  key={index}
                  cx="400"
                  cy="430"
                  rx={120 + index * 54}
                  ry={170 + index * 72}
                  stroke="#5ed6e2"
                  strokeWidth="1"
                  transform={`rotate(${-24 + index * 5} 400 430)`}
                />
              ))}
            </svg>
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#021523] to-transparent" />
          </div>

          <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[640px] flex-col px-6 pb-8 pt-5">
            <div className="flex items-center justify-between">
              <BrandLockup inverted />
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition-colors hover:bg-white/12"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="mt-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-aqua-300/70">
                Navigasi atlas
              </p>
              <nav className="mt-5 flex flex-col">
                {NAV_ITEMS.map((item, index) => {
                  const active = item.end
                    ? location.pathname === item.to
                    : location.pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={cn(
                        "group flex items-center justify-between border-b border-white/8 py-5 transition-colors",
                        active ? "text-white" : "text-white/55 hover:text-white"
                      )}
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-[10px] text-aqua-300/55">
                          0{index + 1}
                        </span>
                        <span className="text-[28px] font-bold tracking-[-0.04em]">
                          {item.label}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full border transition-all",
                          active
                            ? "border-aqua-300/40 bg-aqua-300/10 text-aqua-300"
                            : "border-white/10 text-white/30 group-hover:border-white/25 group-hover:text-white/70"
                        )}
                      >
                        <ArrowUpRight size={16} weight="bold" />
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-10 rounded-[24px] border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aqua-300/10 text-aqua-300">
                  <Sparkle size={17} weight="fill" />
                </span>
                <div>
                  <p className="text-[12px] font-bold text-white">Atlas BGI Kota Cirebon</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/45">
                    Empat parameter, satu prioritas: membaca peluang Blue-Green
                    Infrastructure dari data spasial.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between pt-12">
              <div className="flex items-center gap-2 text-[10px] text-white/35">
                <Circle size={5} weight="fill" className="text-aqua-300" />
                <span>Versi 1.0 · 2026</span>
              </div>
              <Link
                to="/metodologi"
                onClick={onClose}
                className="text-[11px] font-semibold text-white/60 underline decoration-white/20 underline-offset-4"
              >
                Metodologi
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const setCommandOpen = useAppStore((state) => state.setCommandOpen);
  const mobileMenuOpen = useAppStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useAppStore((state) => state.setMobileMenuOpen);
  const { share, copied } = useShare();
  const isMap = location.pathname === "/";

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div
          className={cn(
            "mx-auto flex h-[58px] max-w-[1560px] items-center justify-between gap-3 rounded-[22px] border border-white/70 bg-white/78 px-2.5 shadow-[0_18px_50px_-26px_rgba(4,30,51,.34)] backdrop-blur-2xl transition-colors sm:px-3",
            !isMap && "bg-white/88"
          )}
        >
          <Link
            to="/"
            aria-label="BGI Cirebon, ke peta"
            className="group flex min-w-0 items-center rounded-full pl-0.5 pr-1"
          >
            <BrandLockup className="transition-opacity group-hover:opacity-80" />
          </Link>

          <nav className="hidden items-center gap-0.5 rounded-full border border-mist-200/70 bg-mist-50/80 p-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "relative rounded-full px-3.5 py-2 text-[11.5px] font-semibold tracking-[-0.01em] transition-colors",
                    isActive
                      ? "bg-ocean-950 text-white shadow-[0_6px_14px_-8px_rgba(4,30,51,.9)]"
                      : "text-ink-soft hover:bg-white hover:text-ink"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="hidden h-10 items-center gap-2 rounded-full border border-mist-200/80 bg-white/60 px-3 text-[11.5px] font-medium text-ink-soft transition-colors hover:border-mist-300 hover:bg-white hover:text-ink sm:flex"
            >
              <MagnifyingGlass size={15} weight="bold" />
              <span className="hidden lg:inline">Cari atau perintah</span>
              <span className="hidden rounded-md border border-mist-200 bg-mist-50 px-1.5 py-0.5 font-mono text-[9px] text-ink-faint lg:inline">
                ⌘K
              </span>
            </button>
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              aria-label="Cari"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-mist-100 hover:text-ink sm:hidden"
            >
              <MagnifyingGlass size={18} weight="bold" />
            </button>

            <BasemapMenu />

            <Button
              variant="ghost"
              size="icon"
              aria-label="Bagikan atlas"
              onClick={share}
              className="hidden text-ink-soft sm:flex"
            >
              {copied ? (
                <Check size={18} weight="bold" className="text-emerald-600" />
              ) : (
                <ShareNetwork size={18} weight="bold" />
              )}
            </Button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka menu"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ocean-950 text-white transition-colors hover:bg-ocean-800 md:hidden"
            >
              <List size={19} weight="bold" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
