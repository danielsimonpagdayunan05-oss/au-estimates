import { useEffect, useRef, useState, type TouchEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useWizardStore, TOTAL_STEPS } from "@/store/wizardStore";
import { Stepper } from "@/components/wizard/Stepper";
import { LiveCostPanel } from "@/components/wizard/LiveCostPanel";
import { RecommendationsPanel } from "@/components/wizard/RecommendationsPanel";
import { Button } from "@/components/ui/Button";
import { calculateEstimate } from "@/lib/calculations";
import { formatPHP } from "@/lib/formatters";
import { useSiteData } from "@/lib/useSiteData";

import { Step1Category } from "@/components/wizard/steps/Step1Category";
import { Step2ProjectType } from "@/components/wizard/steps/Step2ProjectType";
import { Step3Location } from "@/components/wizard/steps/Step3Location";
import { Step4FloorArea } from "@/components/wizard/steps/Step4FloorArea";
import { Step5Quality } from "@/components/wizard/steps/Step5Quality";
import { Step6BuildingDetails } from "@/components/wizard/steps/Step6BuildingDetails";
import { Step7Services } from "@/components/wizard/steps/Step7Services";

const STEP_COMPONENTS = [Step1Category, Step2ProjectType, Step3Location, Step4FloorArea, Step5Quality, Step6BuildingDetails, Step7Services];

export function WizardShell() {
  const navigate = useNavigate();
  const { step, setStep, next, back, isStepValid, selections, setCompleted, hasHydrated } = useWizardStore();
  const [maxReached, setMaxReached] = useState(step);
  const StepComponent = STEP_COMPONENTS[step - 1];
  const valid = isStepValid(step);
  const { data: siteData } = useSiteData();
  const estimate = calculateEstimate(selections, siteData);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (hasHydrated) setMaxReached((m) => Math.max(m, step));
  }, [hasHydrated, step]);

  if (!hasHydrated) return null;

  const goNext = () => {
    if (!valid) return;
    if (step === TOTAL_STEPS) {
      setCompleted(true);
      navigate("/summary");
      return;
    }
    next();
    setMaxReached((m) => Math.max(m, step + 1));
  };

  const handleStepClick = (n: number) => setStep(n);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta < -60 && valid) goNext();
    else if (delta > 60 && step > 1) back();
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-32 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:pb-16">
      <Stepper step={step} onStepClick={handleStepClick} maxReached={maxReached} />

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <StepComponent />
          </motion.div>

          <div className="mt-2 lg:hidden">
            <RecommendationsPanel />
          </div>

          <div className="mt-10 hidden items-center justify-between lg:flex">
            <Button variant="secondary" onClick={back} disabled={step === 1} icon={<ArrowLeft size={16} />} iconPosition="left">
              Back
            </Button>
            <Button onClick={goNext} disabled={!valid} icon={step === TOTAL_STEPS ? <Sparkles size={16} /> : <ArrowRight size={16} />}>
              {step === TOTAL_STEPS ? "See Full Report" : "Continue"}
            </Button>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <LiveCostPanel />
            <RecommendationsPanel />
          </div>
        </div>
      </div>

      <div className="glass fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-ink-100 px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden dark:border-white/10">
        <button
          onClick={back}
          disabled={step === 1}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-600 disabled:opacity-30 dark:border-white/15 dark:text-ink-300"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-wide text-ink-400">Estimated Total</p>
          <p className="truncate font-display text-base font-semibold text-ink-950 dark:text-white">
            {estimate ? formatPHP(estimate.totalInvestment, { compact: true }) : "—"}
          </p>
        </div>
        <Button onClick={goNext} disabled={!valid} size="md" className="shrink-0" icon={step === TOTAL_STEPS ? <Sparkles size={16} /> : <ArrowRight size={16} />}>
          {step === TOTAL_STEPS ? "Finish" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
