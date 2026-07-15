import { cn } from "@/lib/cn";

interface GaugeBarProps {
  label: string;
  value: number;
  max?: number;
  invert?: boolean;
  suffix?: string;
}

export function GaugeBar({ label, value, max = 100, invert = false, suffix = "" }: GaugeBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const level = invert ? 100 - pct : pct;
  const color = level < 40 ? "bg-emerald-500" : level < 70 ? "bg-amber-500" : "bg-red-500";
  const textColor = level < 40 ? "text-emerald-600 dark:text-emerald-400" : level < 70 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-ink-500 dark:text-ink-400">{label}</span>
        <span className={cn("text-xs font-semibold", textColor)}>
          {Math.round(value)}
          {suffix}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-ink-100 dark:bg-white/10">
        <div className={cn("h-1.5 rounded-full transition-all duration-500", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
