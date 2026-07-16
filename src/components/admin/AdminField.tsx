import { useEffect, useState, type InputHTMLAttributes } from "react";
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
  // Keep the field's displayed text as local string state rather than deriving it straight
  // from `value` on every keystroke — otherwise typing "0." immediately round-trips through
  // Number("0.") === 0 and the decimal point (or a lone "-", or a trailing zero) gets wiped
  // out mid-type. We only resync from `value` when it changes for a reason other than our
  // own onChange below (e.g. the parent reset the form) — see EditableNumber.tsx for the
  // same pattern.
  const [draft, setDraft] = useState(String(value));

  useEffect(() => setDraft(String(value)), [value]);

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">{label}</span>
      <input
        type="number"
        value={draft}
        step={step ?? "any"}
        onChange={(e) => {
          const raw = e.target.value;
          setDraft(raw);
          if (raw.trim() === "") return;
          const parsed = Number(raw);
          if (!Number.isNaN(parsed)) onChange(parsed);
        }}
        className={cn(baseInputClass, className)}
      />
    </label>
  );
}
