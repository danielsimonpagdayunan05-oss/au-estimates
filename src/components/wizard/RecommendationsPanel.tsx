import { useMemo } from "react";
import { Wand2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useWizardStore } from "@/store/wizardStore";
import { calculateEstimate } from "@/lib/calculations";
import { useSiteData } from "@/lib/useSiteData";
import { GlassCard } from "@/components/ui/Card";

export function RecommendationsPanel() {
  const { selections } = useWizardStore();
  const { data: siteData } = useSiteData();
  const estimate = useMemo(() => calculateEstimate(selections, siteData), [selections, siteData]);

  if (!estimate || estimate.recommendations.length === 0) return null;

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream-400/15 text-cream-600 dark:text-cream-400">
          <Wand2 size={16} />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink-900 dark:text-white">AI Recommendations</p>
          <p className="text-xs text-ink-400">Based on your selections</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2.5">
        {estimate.recommendations.map((rec, i) => (
          <motion.li
            key={rec}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-start gap-2.5 text-sm text-ink-600 dark:text-ink-300"
          >
            <Check size={15} className="mt-0.5 shrink-0 text-emerald-500" />
            {rec}
          </motion.li>
        ))}
      </ul>
    </GlassCard>
  );
}
