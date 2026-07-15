import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  className?: string;
}

export function Select({ label, value, onChange, options, className }: SelectProps) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-900 outline-none transition-colors focus:border-olive-500 dark:border-white/10 dark:bg-ink-900 dark:text-white"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-400" />
      </div>
    </label>
  );
}
