import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface SelectionCardProps {
  label: string;
  description?: string;
  icon?: LucideIcon;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export function SelectionCard({ label, description, icon: Icon, selected, onClick, compact }: SelectionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all duration-200",
        compact && "gap-2 p-4",
        selected
          ? "border-olive-500 bg-olive-50/60 shadow-[var(--shadow-glow-olive)] dark:bg-olive-500/10"
          : "border-ink-100 bg-white hover:border-ink-300 hover:shadow-[var(--shadow-soft)] dark:bg-ink-900 dark:border-white/[0.06] dark:hover:border-white/20",
      )}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-olive-500 text-white">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
      {Icon && (
        <span
          className={cn(
            "flex items-center justify-center rounded-xl transition-colors",
            compact ? "h-9 w-9" : "h-11 w-11",
            selected ? "bg-olive-500 text-white" : "bg-ink-100 text-ink-600 group-hover:bg-ink-200 dark:bg-white/10 dark:text-ink-300",
          )}
        >
          <Icon size={compact ? 18 : 20} />
        </span>
      )}
      <div>
        <p className={cn("font-semibold text-ink-900 dark:text-white", compact ? "text-sm" : "text-[15px]")}>{label}</p>
        {description && <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">{description}</p>}
      </div>
    </motion.button>
  );
}
