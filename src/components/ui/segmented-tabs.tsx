import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/format";

export interface SegmentedTabOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface SegmentedTabsProps<T extends string> {
  options: SegmentedTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  ariaLabel?: string;
}

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  className,
  ariaLabel = "Pilihan tampilan",
}: SegmentedTabsProps<T>) {
  const id = React.useId();

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = options[(index + direction + options.length) % options.length];
    onChange(next.value);
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "relative flex items-center gap-1 rounded-full border border-white/60 bg-mist-100/80 p-1",
        className
      )}
    >
      {options.map((option, index) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "relative flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full px-2.5 text-[11.5px] font-semibold tracking-[-0.01em] transition-colors duration-200",
              active ? "text-white" : "text-ink-soft hover:text-ink"
            )}
          >
            {active && (
              <motion.span
                layoutId={`segmented-active-${id}`}
                className="absolute inset-0 rounded-full bg-ocean-950 shadow-[0_6px_16px_-8px_rgba(4,30,51,.8)]"
                transition={{ type: "spring", stiffness: 480, damping: 38 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {option.icon}
              {option.label}
              {typeof option.count === "number" && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 font-mono text-[9px] leading-none",
                    active ? "bg-white/15 text-white" : "bg-white text-ink-faint"
                  )}
                >
                  {option.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
