import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const variants = {
  primary:
    "bg-ink-900 text-white hover:bg-ink-800 shadow-[var(--shadow-soft)] dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100",
  secondary:
    "bg-white text-ink-800 border border-ink-200 hover:border-ink-300 hover:bg-ink-50 dark:bg-white/5 dark:text-ink-100 dark:border-white/10 dark:hover:bg-white/10",
  ghost: "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-white/10",
  outline: "bg-transparent border border-ink-200 text-ink-800 hover:bg-ink-50 dark:border-white/15 dark:text-ink-100 dark:hover:bg-white/5",
};

const sizes = {
  sm: "text-sm px-4 py-2 gap-1.5",
  md: "text-[15px] px-5 py-3 gap-2",
  lg: "text-base px-7 py-4 gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}
