import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const baseInputClass =
  "w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-900 outline-none transition-colors focus:border-olive-500 dark:border-white/10 dark:bg-ink-900 dark:text-white";

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  onChange: (value: string) => void;
}

export function TextField({ label, onChange, className, ...props }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">{label}</span>
      <input {...props} onChange={(e) => onChange(e.target.value)} className={cn(baseInputClass, className)} />
    </label>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  className?: string;
}

export function NumberField({ label, value, onChange, step, className }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">{label}</span>
      <input
        type="number"
        value={value}
        step={step ?? "any"}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(baseInputClass, className)}
      />
    </label>
  );
}
