import { cn } from "@/lib/format";

export function BrandMark({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="BGI Cirebon"
    >
      <defs>
        <linearGradient id="brand-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b63b8" />
          <stop offset="0.55" stopColor="#1683e8" />
          <stop offset="1" stopColor="#18b6c9" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#brand-gradient)" />
      <path
        d="M13 39c6-8 11-8 17 0s11 8 17 0 8-7 8-7v8c0 6-4 10-10 10H18c-6 0-10-4-10-10v-8s2 0 5 7z"
        fill="#f5fafe"
        opacity=".92"
      />
      <path
        d="M32 13c6 4 9 9 9 14 0 5-4 9-9 9s-9-4-9-9c0-5 3-10 9-14z"
        fill="#f5fafe"
      />
      <path
        d="M32 19v14"
        stroke="#0b63b8"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".55"
      />
      {animated && (
        <circle cx="48" cy="17" r="9" fill="#f2a93b" opacity=".24">
          <animate
            attributeName="r"
            values="6;11;6"
            dur="2.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values=".3;.08;.3"
            dur="2.8s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
}

export function BrandLockup({
  compact = false,
  inverted = false,
  className,
}: {
  compact?: boolean;
  inverted?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark className={compact ? "h-9 w-9" : "h-10 w-10"} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[15px] font-extrabold tracking-[-0.035em]",
            inverted ? "text-white" : "text-ink"
          )}
        >
          BGI Cirebon
        </span>
        <span
          className={cn(
            "mt-1 font-mono text-[8.5px] font-medium uppercase tracking-[0.16em]",
            inverted ? "text-white/50" : "text-ink-faint"
          )}
        >
          Blue-Green Atlas
        </span>
      </span>
    </span>
  );
}
