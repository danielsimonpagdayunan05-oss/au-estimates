import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { QualityStandard } from "@/types/estimate";
import { useWizardStore } from "@/store/wizardStore";
import { useSiteData } from "@/lib/useSiteData";
import { DEFAULT_SITE_DATA } from "@/lib/defaultSiteData";
import { cn } from "@/lib/cn";

const TIERS: { value: QualityStandard; desc: string; specs: string[] }[] = [
  { value: "Basic", desc: "Functional, budget-conscious finishes", specs: ["Standard CHB walls", "Ceramic tile flooring", "Basic fixtures"] },
  { value: "Standard", desc: "Balanced quality and value", specs: ["Painted finishes", "Porcelain tile flooring", "Mid-range fixtures"] },
  { value: "Premium", desc: "Elevated finishes & materials", specs: ["Feature walls", "Engineered wood accents", "Branded fixtures"] },
  { value: "Luxury", desc: "High-end custom finishes", specs: ["Natural stone finishes", "Custom millwork", "Smart-home ready"] },
  { value: "Ultra Luxury", desc: "Bespoke, no-compromise build", specs: ["Imported materials", "Full custom design", "Concierge-grade MEP"] },
];

export function Step5Quality() {
  const { selections, setQuality } = useWizardStore();
  const { data } = useSiteData();
  const qualityMultiplier = data.settings["estimator.qualityMultipliers"] ?? DEFAULT_SITE_DATA.settings["estimator.qualityMultipliers"]!;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink-950 dark:text-white">Choose your quality standard</h2>
      <p className="mt-2 text-ink-500 dark:text-ink-400">This is the single biggest driver of cost per square meter.</p>

      <div className="mt-8 space-y-3">
        {TIERS.map((tier) => {
          const selected = selections.quality === tier.value;
          return (
            <motion.button
              key={tier.value}
              type="button"
              whileTap={{ scale: 0.99 }}
              onClick={() => setQuality(tier.value)}
              className={cn(
                "flex w-full flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all sm:flex-row sm:items-center sm:justify-between",
                selected
                  ? "border-olive-500 bg-olive-50/60 shadow-[var(--shadow-glow-olive)] dark:bg-olive-500/10"
                  : "border-ink-100 bg-white hover:border-ink-300 dark:border-white/[0.06] dark:bg-ink-900 dark:hover:border-white/20",
              )}
            >
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                    selected ? "border-olive-500 bg-olive-500 text-white" : "border-ink-200 dark:border-white/20",
                  )}
                >
                  {selected && <Check size={13} strokeWidth={3} />}
                </span>
                <div>
                  <p className="font-semibold text-ink-900 dark:text-white">{tier.value}</p>
                  <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">{tier.desc}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tier.specs.map((s) => (
                      <span key={s} className="rounded-full bg-ink-100 px-2.5 py-0.5 text-[11px] font-medium text-ink-500 dark:bg-white/10 dark:text-ink-400">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span className="shrink-0 self-end text-sm font-semibold text-ink-400 sm:self-center">
                {(qualityMultiplier[tier.value] ?? 1).toFixed(2)}&times; base rate
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
