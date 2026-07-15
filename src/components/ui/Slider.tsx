import { cn } from "@/lib/cn";

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  className?: string;
}

export function Slider({ min, max, step = 1, value, onChange, className }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("relative w-full", className)}>
      <div className="h-2 w-full rounded-full bg-ink-100 dark:bg-white/10">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-olive-500 to-olive-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 top-1/2 h-6 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent
          [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:bg-olive-500 [&::-webkit-slider-thumb]:shadow-[0_2px_10px_rgba(122,138,73,0.5)]
          [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-olive-500"
      />
    </div>
  );
}
