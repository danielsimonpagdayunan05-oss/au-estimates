import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

const STEP_LABELS = ["Category", "Project Type", "Location", "Floor Area", "Quality", "Building", "Services"];

interface StepperProps {
  step: number;
  onStepClick: (step: number) => void;
  maxReached: number;
}

export function Stepper({ step, onStepClick, maxReached }: StepperProps) {
  return (
    <div className="w-full">
      <div className="hidden items-center sm:flex">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1;
          const active = num === step;
          const done = num < step;
          const clickable = num <= maxReached;
          return (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick(num)}
                className="flex flex-col items-center gap-2 disabled:cursor-not-allowed"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all",
                    active && "bg-olive-500 text-white shadow-[var(--shadow-glow-olive)]",
                    done && !active && "bg-ink-900 text-white dark:bg-white dark:text-ink-950",
                    !active && !done && "bg-ink-100 text-ink-400 dark:bg-white/10 dark:text-ink-500",
                  )}
                >
                  {done ? <Check size={15} strokeWidth={3} /> : num}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap text-[11px] font-medium",
                    active ? "text-ink-900 dark:text-white" : "text-ink-400 dark:text-ink-500",
                  )}
                >
                  {label}
                </span>
              </button>
              {i < STEP_LABELS.length - 1 && (
                <div className={cn("mx-2 h-px flex-1 transition-colors", done ? "bg-ink-900 dark:bg-white" : "bg-ink-100 dark:bg-white/10")} />
              )}
            </div>
          );
        })}
      </div>

      <div className="sm:hidden">
        <div className="flex items-center justify-between text-xs font-medium text-ink-500 dark:text-ink-400">
          <span>
            Step {step} of {STEP_LABELS.length}
          </span>
          <span className="text-ink-900 dark:text-white">{STEP_LABELS[step - 1]}</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-ink-100 dark:bg-white/10">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-olive-500 to-olive-400 transition-all duration-400"
            style={{ width: `${(step / STEP_LABELS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
