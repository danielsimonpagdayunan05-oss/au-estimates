import { motion } from "framer-motion";
import type { PhaseItem } from "@/types/content";

const PHASE_COLORS = ["#626f39", "#7a8a49", "#97a563", "#d1d7b1", "#4d572f", "#b3bd85"];

export function TimelinePhases({ phases, months }: { phases: PhaseItem[]; months: number }) {
  return (
    <div>
      <div className="flex h-9 w-full overflow-hidden rounded-xl">
        {phases.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ width: 0 }}
            animate={{ width: `${p.pct}%` }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: PHASE_COLORS[i % PHASE_COLORS.length] }}
            className="flex items-center justify-center"
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {phases.map((p, i) => (
          <div key={p.label} className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: PHASE_COLORS[i % PHASE_COLORS.length] }} />
            <div>
              <p className="text-xs font-medium text-ink-700 dark:text-ink-200">{p.label}</p>
              <p className="text-[11px] text-ink-400">{Math.max(1, Math.round(months * (p.pct / 100)))} mo</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
