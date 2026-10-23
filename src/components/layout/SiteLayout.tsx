import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CommandPalette } from "@/components/search/CommandPalette";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/format";

function ScrollToTop() {
  const location = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);
  return null;
}

export function SiteLayout() {
  const location = useLocation();
  const isMap = location.pathname === "/";
  const setCommandOpen = useAppStore((state) => state.setCommandOpen);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(!useAppStore.getState().commandOpen);
        return;
      }
      if (event.key === "/" && !typing && !useAppStore.getState().commandOpen) {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setCommandOpen]);

  return (
    <div className="min-h-[100dvh] bg-mist-50">
      <ScrollToTop />
      <Header />
      <main className={cn(isMap ? "" : "pt-[84px]")}>
        <Outlet />
      </main>
      {!isMap && <SiteFooter />}
      <CommandPalette />
      <Toaster
        position="top-center"
        closeButton
        toastOptions={{
          className:
            "!rounded-2xl !border !border-white/80 !bg-white/95 !text-ink !shadow-[0_24px_60px_-24px_rgba(4,30,51,.45)] !backdrop-blur-xl !font-sans",
          descriptionClassName: "!text-ink-soft",
        }}
      />
    </div>
  );
}
