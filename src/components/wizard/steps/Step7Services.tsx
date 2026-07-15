import { Check } from "lucide-react";
import { ADDITIONAL_SERVICES, SERVICE_CATEGORY_LABELS } from "@/data/services";
import type { AdditionalService } from "@/types/estimate";
import { useWizardStore } from "@/store/wizardStore";
import { formatPHP } from "@/lib/formatters";
import { cn } from "@/lib/cn";

const CATEGORY_ORDER: AdditionalService["category"][] = ["design", "engineering", "construction", "documentation", "survey"];

function estimateLabel(svc: AdditionalService) {
  if (svc.feeType === "flat") return formatPHP(svc.value, { compact: true });
  if (svc.feeType === "per_sqm") return `${formatPHP(svc.value)}/sqm`;
  return `${(svc.value * 100).toFixed(1)}% of cost`;
}

export function Step7Services() {
  const { selections, toggleService } = useWizardStore();

  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink-950 dark:text-white">Additional services</h2>
      <p className="mt-2 text-ink-500 dark:text-ink-400">Select any extra deliverables you'd like included in your estimate.</p>

      <div className="mt-8 space-y-8">
        {CATEGORY_ORDER.map((cat) => (
          <div key={cat}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-400">{SERVICE_CATEGORY_LABELS[cat]}</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ADDITIONAL_SERVICES.filter((s) => s.category === cat).map((svc) => {
                const selected = selections.services.includes(svc.id);
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => toggleService(svc.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                      selected
                        ? "border-olive-500 bg-olive-50/60 dark:bg-olive-500/10"
                        : "border-ink-100 bg-white hover:border-ink-300 dark:border-white/[0.06] dark:bg-ink-900 dark:hover:border-white/20",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2",
                        selected ? "border-olive-500 bg-olive-500 text-white" : "border-ink-200 dark:border-white/20",
                      )}
                    >
                      {selected && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-ink-900 dark:text-white">{svc.label}</span>
                      <span className="mt-0.5 block text-xs text-ink-400">{estimateLabel(svc)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
