import { motion } from "framer-motion";
import type { ProjectType } from "@/types/estimate";

const PHASE_SETS: Record<string, { label: string; pct: number; color: string }[]> = {
  "Design Only": [
    { label: "Concept Design", pct: 0.25, color: "#626f39" },
    { label: "Design Development", pct: 0.35, color: "#7a8a49" },
    { label: "Construction Documents", pct: 0.25, color: "#97a563" },
    { label: "Permitting", pct: 0.15, color: "#d1d7b1" },
  ],
  "Interior Fit-out": [
    { label: "Design", pct: 0.15, color: "#626f39" },
    { label: "Procurement", pct: 0.2, color: "#7a8a49" },
    { label: "Fit-out Construction", pct: 0.5, color: "#97a563" },
    { label: "Handover", pct: 0.15, color: "#d1d7b1" },
  ],
  default: [
    { label: "Design & Permitting", pct: 0.2, color: "#626f39" },
    { label: "Foundation & Structure", pct: 0.3, color: "#7a8a49" },
    { label: "Enclosure & MEP Rough-in", pct: 0.25, color: "#97a563" },
    { label: "Finishes & Turnover", pct: 0.25, color: "#d1d7b1" },
  ],
};

export function TimelinePhases({ projectType, months }: { projectType: ProjectType; months: number }) {
  const phases = PHASE_SETS[projectType] ?? PHASE_SETS.default;

  return (
    <div>
      <div className="flex h-9 w-full overflow-hidden rounded-xl">
        {phases.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ width: 0 }}
            animate={{ width: `${p.pct * 100}%` }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: p.color }}
            className="flex items-center justify-center"
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {phases.map((p) => (
          <div key={p.label} className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
            <div>
              <p className="text-xs font-medium text-ink-700 dark:text-ink-200">{p.label}</p>
              <p className="text-[11px] text-ink-400">{Math.max(1, Math.round(months * p.pct))} mo</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
