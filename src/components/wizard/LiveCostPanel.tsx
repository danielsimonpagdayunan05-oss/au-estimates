import { useMemo } from "react";
import { Sparkles, Users, Building2, Clock3, Leaf } from "lucide-react";
import { useWizardStore } from "@/store/wizardStore";
import { calculateEstimate } from "@/lib/calculations";
import { formatMonths, formatPHP } from "@/lib/formatters";
import { useSiteData } from "@/lib/useSiteData";
import { GlassCard } from "@/components/ui/Card";
import { GaugeBar } from "@/components/ui/GaugeBar";
import { Badge } from "@/components/ui/Badge";
import { AnimatedValue } from "@/components/ui/AnimatedValue";

export function LiveCostPanel({ compact = false }: { compact?: boolean }) {
  const { selections } = useWizardStore();
  const { data: siteData } = useSiteData();
  const estimate = useMemo(() => calculateEstimate(selections, siteData), [selections, siteData]);

  if (!estimate) {
    return (
      <GlassCard className="p-6 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-olive-50 text-olive-600 dark:bg-olive-500/15 dark:text-olive-400">
          <Sparkles size={20} />
        </span>
        <p className="mt-4 font-semibold text-ink-900 dark:text-white">Your live estimate</p>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          Answer a few questions and your cost breakdown will appear here — updating in real time.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className={compact ? "p-5" : "p-6"}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Live Cost Estimate</span>
      </div>

      <p className="mt-4 text-xs font-medium text-ink-400">Estimated Total Investment</p>
      <AnimatedValue value={estimate.totalInvestment} className="mt-1 block font-display text-3xl font-semibold text-ink-950 dark:text-white">
        {formatPHP(estimate.totalInvestment)}
      </AnimatedValue>
      <Badge tone="olive" className="mt-2">
        {estimate.budgetCategory}
      </Badge>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-ink-50/70 p-3.5 dark:bg-white/[0.04]">
          <p className="flex items-center gap-1 text-[11px] font-medium text-ink-400">
            <Building2 size={12} /> Construction Cost
          </p>
          <AnimatedValue value={estimate.constructionCost} className="mt-1 block text-[15px] font-semibold text-ink-900 dark:text-white">
            {formatPHP(estimate.constructionCost, { compact: true })}
          </AnimatedValue>
        </div>
        <div className="rounded-xl bg-ink-50/70 p-3.5 dark:bg-white/[0.04]">
          <p className="flex items-center gap-1 text-[11px] font-medium text-ink-400">
            <Sparkles size={12} /> Design Fee
          </p>
          <AnimatedValue value={estimate.architecturalFee} className="mt-1 block text-[15px] font-semibold text-ink-900 dark:text-white">
            {formatPHP(estimate.architecturalFee, { compact: true })}
          </AnimatedValue>
        </div>
        <div className="rounded-xl bg-ink-50/70 p-3.5 dark:bg-white/[0.04]">
          <p className="flex items-center gap-1 text-[11px] font-medium text-ink-400">
            <Clock3 size={12} /> Timeline
          </p>
          <AnimatedValue value={estimate.timelineMonths} className="mt-1 block text-[15px] font-semibold text-ink-900 dark:text-white">
            {formatMonths(estimate.timelineMonths)}
          </AnimatedValue>
        </div>
        <div className="rounded-xl bg-ink-50/70 p-3.5 dark:bg-white/[0.04]">
          <p className="flex items-center gap-1 text-[11px] font-medium text-ink-400">
            <Users size={12} /> Team Size
          </p>
          <AnimatedValue value={estimate.teamSize} className="mt-1 block text-[15px] font-semibold text-ink-900 dark:text-white">
            {estimate.teamSize} specialists
          </AnimatedValue>
        </div>
      </div>

      {estimate.professionalFees.length > 0 && (
        <div className="mt-5 border-t border-ink-100 pt-4 dark:border-white/[0.06]">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-ink-400">Professional Fee Breakdown</p>
          <div className="space-y-1.5">
            {estimate.professionalFees.map((f) => (
              <div key={f.label} className="flex items-center justify-between text-[13px]">
                <span className="text-ink-500 dark:text-ink-400">{f.label}</span>
                <span className="font-medium text-ink-900 dark:text-white">{formatPHP(f.amount, { compact: true })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 space-y-4 border-t border-ink-100 pt-4 dark:border-white/[0.06]">
        <GaugeBar label="Risk Score" value={estimate.riskScore} invert />
        <GaugeBar label="Project Complexity" value={estimate.complexityIndex} invert />
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-ink-500 dark:text-ink-400">
            <Leaf size={13} className="text-emerald-500" /> Sustainability Score
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{Math.round(estimate.sustainabilityScore)}/100</span>
        </div>
      </div>
    </GlassCard>
  );
}
