import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/format";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PageShell({
  children,
  className,
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        wide ? "max-w-[1440px]" : "max-w-[1240px]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  tone = "blue",
  className,
}: {
  children: React.ReactNode;
  tone?: "blue" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.18em]",
        tone === "blue"
          ? "border-blue-600/15 bg-blue-500/[0.055] text-blue-700"
          : "border-white/15 bg-white/[0.06] text-aqua-300",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone === "blue" ? "bg-aqua-500" : "bg-aqua-300"
        )}
      />
      {children}
    </span>
  );
}

export function ContourBackground({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 700"
      className={cn("pointer-events-none absolute", className)}
      fill="none"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4, 5, 6].map((index) => (
        <ellipse
          key={index}
          cx="470"
          cy="350"
          rx={160 + index * 62}
          ry={110 + index * 52}
          stroke="currentColor"
          strokeWidth="1"
          transform={`rotate(${-18 + index * 3} 470 350)`}
          opacity={0.52 - index * 0.055}
        />
      ))}
    </svg>
  );
}
