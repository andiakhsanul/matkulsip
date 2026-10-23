import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/format";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "soft" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-[0_10px_24px_-12px_rgba(11,99,184,.8)] hover:brightness-[1.06] active:brightness-95",
  secondary:
    "bg-ocean-950 text-white shadow-[0_10px_24px_-14px_rgba(4,30,51,.9)] hover:bg-ocean-800",
  ghost: "text-ink-soft hover:bg-mist-100 hover:text-ink",
  outline:
    "border border-mist-200 bg-white/70 text-ink hover:border-mist-300 hover:bg-white",
  soft: "bg-mist-100 text-blue-700 hover:bg-mist-200",
  danger: "bg-coral-500/10 text-coral-500 hover:bg-coral-500/15",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 rounded-full px-3 text-[12px]",
  md: "h-10 gap-2 rounded-full px-4 text-[13px]",
  lg: "h-12 gap-2.5 rounded-full px-5 text-[14px]",
  icon: "h-10 w-10 rounded-full",
  "icon-sm": "h-8 w-8 rounded-full",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex shrink-0 items-center justify-center font-semibold tracking-[-0.01em] transition-all duration-200 disabled:pointer-events-none disabled:opacity-45",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
