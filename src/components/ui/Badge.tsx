import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "olive" | "cream" | "neutral" | "success" | "warning" | "danger";
}

const tones = {
  olive: "bg-olive-50 text-olive-700 dark:bg-olive-500/15 dark:text-olive-300",
  cream: "bg-cream-400/15 text-cream-600 dark:text-cream-400",
  neutral: "bg-ink-100 text-ink-600 dark:bg-white/10 dark:text-ink-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  danger: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
