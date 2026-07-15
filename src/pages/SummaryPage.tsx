import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Building2,
  Clock3,
  Users,
  ShieldAlert,
  Leaf,
  TrendingUp,
  FileDown,
  Wrench,
  ListChecks,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useWizardStore } from "@/store/wizardStore";
import { calculateEstimate } from "@/lib/calculations";
import { formatMonths, formatNumber, formatPHP } from "@/lib/formatters";
import { buildAiNotes, buildConstructionPhases, buildDeliverables, buildMaintenanceTips } from "@/lib/reportContent";
import { calculateRoi } from "@/lib/roi";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GaugeBar } from "@/components/ui/GaugeBar";
import { CostBreakdownChart } from "@/components/summary/CostBreakdownChart";
import { TimelinePhases } from "@/components/summary/TimelinePhases";
import { ClientInfoForm } from "@/components/client/ClientInfoForm";
import type { ClientInfo } from "@/types/estimate";

export function SummaryPage() {
  const navigate = useNavigate();
  const { selections, reset, hasHydrated } = useWizardStore();
  const estimate = useMemo(() => calculateEstimate(selections), [selections]);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const firedConfetti = useRef(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!estimate) {
      navigate("/estimate");
      return;
    }
    if (!firedConfetti.current) {
      firedConfetti.current = true;
      confetti({ particleCount: 100, spread: 75, origin: { y: 0.3 }, colors: ["#7a8a49", "#c7a94f", "#3f6b5e"] });
    }
  }, [hasHydrated, estimate, navigate]);

  if (!hasHydrated) return null;

  if (!estimate || !selections.category || !selections.projectType || !selections.quality) return null;

  const deliverables = buildDeliverables(selections);
  const maintenanceTips = buildMaintenanceTips(selections);
  const aiNotes = buildAiNotes(selections, estimate);
  const constructionPhases = buildConstructionPhases();
  const roi = calculateRoi(selections.category, selections.floorArea, estimate.totalInvestment);
  const reportId = `AU-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { downloadEstimatePdf } = await import("@/lib/generatePdf");
      await downloadEstimatePdf(selections, estimate, leadId ?? reportId, client);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 pb-28 pt-10 sm:px-8 sm:pb-16">
      <button onClick={() => navigate("/estimate")} className="flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-white">
        <ArrowLeft size={15} /> Edit answers
      </button>

      <div className="mt-6 text-center">
        <Badge tone="success" className="mx-auto">
          <Sparkles size={12} /> Your estimate is ready
        </Badge>
        <h1 className="mt-4 text-3xl font-semibold text-ink-950 sm:text-4xl dark:text-white">
          {formatPHP(estimate.totalInvestment)}
        </h1>
        <p className="mt-2 text-ink-500 dark:text-ink-400">
          Estimated total investment for your {selections.floorArea} sqm {selections.category?.toLowerCase()} project
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Building2, label: "Construction Cost", value: formatPHP(estimate.constructionCost, { compact: true }) },
          { icon: Sparkles, label: "Design Fee", value: formatPHP(estimate.architecturalFee, { compact: true }) },
          { icon: Clock3, label: "Timeline", value: formatMonths(estimate.timelineMonths) },
          { icon: Users, label: "Team Size", value: `${estimate.teamSize} specialists` },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <s.icon size={16} className="text-olive-500" />
            <p className="mt-2 text-[11px] font-medium text-ink-400">{s.label}</p>
            <p className="mt-0.5 text-[15px] font-semibold text-ink-900 dark:text-white">{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-ink-900 dark:text-white">Cost Breakdown</h2>
        <div className="mt-6">
          <CostBreakdownChart estimate={estimate} />
        </div>
      </Card>

      <Card className="mt-6 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-ink-900 dark:text-white">Project Timeline</h2>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          Estimated {formatMonths(estimate.timelineMonths)} from design to turnover.
        </p>
        <div className="mt-6">
          <TimelinePhases projectType={selections.projectType} months={estimate.timelineMonths} />
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card className="p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-ink-900 dark:text-white">
            <ListChecks size={18} className="text-olive-500" /> Deliverables
          </h2>
          <ul className="mt-4 space-y-2">
            {deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                {d}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-ink-900 dark:text-white">
            <Layers size={18} className="text-olive-500" /> Construction Phases
          </h2>
          <div className="mt-4 space-y-3">
            {constructionPhases.map((p) => (
              <div key={p.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-ink-500 dark:text-ink-400">{p.label}</span>
                  <span className="font-semibold text-ink-700 dark:text-ink-200">{p.pct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-ink-100 dark:bg-white/10">
                  <div className="h-1.5 rounded-full bg-olive-500" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink-900 dark:text-white">
          <Wrench size={18} className="text-olive-500" /> Recommended Materials & Systems
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {estimate.recommendations.map((r) => (
            <div key={r} className="flex items-start gap-2 rounded-xl bg-ink-50/70 p-3 text-sm text-ink-600 dark:bg-white/[0.04] dark:text-ink-300">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
              {r}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6 p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink-900 dark:text-white">
          <ShieldAlert size={18} className="text-olive-500" /> Risk & Sustainability Analysis
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-5">
            <GaugeBar label="Risk Score" value={estimate.riskScore} invert />
            <GaugeBar label="Project Complexity" value={estimate.complexityIndex} invert />
            <GaugeBar label="Sustainability Score" value={estimate.sustainabilityScore} />
          </div>
          <div className="rounded-xl bg-ink-50/70 p-4 text-sm leading-relaxed text-ink-600 dark:bg-white/[0.04] dark:text-ink-300">
            <p className="flex items-center gap-1.5 font-semibold text-ink-900 dark:text-white">
              <Leaf size={14} className="text-emerald-500" /> Carbon Footprint (estimated)
            </p>
            <p className="mt-1">~{formatNumber(estimate.carbonFootprintTons)} tons CO₂e embodied carbon for this build.</p>
            <p className="mt-3 font-semibold text-ink-900 dark:text-white">AI Notes</p>
            <p className="mt-1">{aiNotes}</p>
          </div>
        </div>
      </Card>

      {roi && (
        <Card className="mt-6 p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-ink-900 dark:text-white">
            <TrendingUp size={18} className="text-olive-500" /> ROI Estimate (Commercial)
          </h2>
          <p className="mt-1 text-xs text-ink-400">Indicative — based on placeholder market rent assumptions.</p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-[11px] font-medium text-ink-400">Est. Monthly Rent</p>
              <p className="mt-1 font-semibold text-ink-900 dark:text-white">{formatPHP(roi.monthlyRent, { compact: true })}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-ink-400">Gross Yield</p>
              <p className="mt-1 font-semibold text-ink-900 dark:text-white">{roi.grossYield.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-ink-400">Net Yield</p>
              <p className="mt-1 font-semibold text-ink-900 dark:text-white">{roi.netYield.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-ink-400">Payback Period</p>
              <p className="mt-1 font-semibold text-ink-900 dark:text-white">{roi.paybackYears.toFixed(1)} yrs</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="mt-6 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-ink-900 dark:text-white">Maintenance Tips</h2>
        <ul className="mt-4 space-y-2">
          {maintenanceTips.map((t) => (
            <li key={t} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
              {t}
            </li>
          ))}
        </ul>
      </Card>

      <div ref={formRef} className="mt-10 scroll-mt-24">
        {!leadId ? (
          <ClientInfoForm
            selections={selections}
            estimate={estimate}
            onSubmitted={(id, submittedClient) => {
              setLeadId(id);
              setClient(submittedClient);
              import("@/lib/generatePdf").then(({ downloadEstimatePdf }) => downloadEstimatePdf(selections, estimate, id, submittedClient));
            }}
          />
        ) : (
          <Card className="p-8 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <CheckCircle2 size={22} />
            </span>
            <h3 className="mt-4 text-xl font-semibold text-ink-950 dark:text-white">You're all set!</h3>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
              Report {leadId} has been saved and your PDF download should have started. Our team will reach out shortly.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="secondary" onClick={handleDownload} disabled={downloading} icon={downloading ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}>
                {downloading ? "Preparing..." : "Download PDF Again"}
              </Button>
              <Button
                onClick={() => {
                  reset();
                  navigate("/estimate");
                }}
              >
                Start a New Estimate
              </Button>
            </div>
          </Card>
        )}
      </div>

      <div className="glass fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-ink-100 px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:hidden dark:border-white/10">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-ink-400">Total Investment</p>
          <p className="truncate font-display text-base font-semibold text-ink-950 dark:text-white">{formatPHP(estimate.totalInvestment, { compact: true })}</p>
        </div>
        <Button onClick={leadId ? handleDownload : scrollToForm} icon={<FileDown size={16} />} className="shrink-0">
          {leadId ? "Download PDF" : "Get Full Report"}
        </Button>
      </div>
    </div>
  );
}
