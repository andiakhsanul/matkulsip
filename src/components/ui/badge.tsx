import * as React from "react";
import { cn } from "@/lib/format";
import { PRIORITY_COLORS, PRIORITY_TEXT_COLORS } from "@/lib/constants";
import type { PriorityLabel } from "@/types";

export function Badge({
  children,
  className,
  tone = "mist",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "mist" | "blue" | "ocean" | "amber" | "glass" | "coral";
}) {
  const tones: Record<string, string> = {
    mist: "bg-mist-100 text-ink-soft ring-mist-200/70",
    blue: "bg-blue-500/10 text-blue-700 ring-blue-500/15",
    ocean: "bg-ocean-950 text-white ring-white/10",
    amber: "bg-amber-500/12 text-[#99610c] ring-amber-500/20",
    coral: "bg-coral-500/10 text-coral-500 ring-coral-500/15",
    glass: "bg-white/10 text-white ring-white/15 backdrop-blur",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.08em] ring-1 ring-inset",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function PriorityBadge({
  label,
  className,
}: {
  label: PriorityLabel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.09em] shadow-[inset_0_0_0_1px_rgba(255,255,255,.22)]",
        className
      )}
      style={{
        backgroundColor: PRIORITY_COLORS[label],
        color: PRIORITY_TEXT_COLORS[label],
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor:
            label === "Tinggi" || label === "Sangat Tinggi"
              ? "rgba(255,255,255,.9)"
              : PRIORITY_TEXT_COLORS[label],
        }}
      />
      {label}
    </span>
  );
}
