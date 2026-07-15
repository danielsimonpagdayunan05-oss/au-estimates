import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { EstimateResult } from "@/types/estimate";
import { formatPHP } from "@/lib/formatters";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ["#7a8a49", "#c7a94f", "#b5652f", "#3f6b5e", "#8a5a6b", "#b3bd85", "#6b5335", "#e5d8a4"];

export function CostBreakdownChart({ estimate }: { estimate: EstimateResult }) {
  const segments = [
    { label: "Construction Cost", value: estimate.constructionCost },
    ...estimate.professionalFees.map((f) => ({ label: f.label, value: f.amount })),
  ].filter((s) => s.value > 0);

  const data = {
    labels: segments.map((s) => s.label),
    datasets: [
      {
        data: segments.map((s) => s.value),
        backgroundColor: COLORS,
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-52 w-52 shrink-0">
        <Doughnut
          data={data}
          options={{
            cutout: "72%",
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${formatPHP(Number(ctx.raw))}` } } },
          }}
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] font-medium text-ink-400">Total</span>
          <span className="font-display text-lg font-semibold text-ink-950 dark:text-white">
            {formatPHP(estimate.totalInvestment, { compact: true })}
          </span>
        </div>
      </div>
      <div className="w-full space-y-2.5">
        {segments.map((s, i) => (
          <div key={s.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink-600 dark:text-ink-300">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              {s.label}
            </span>
            <span className="font-semibold text-ink-900 dark:text-white">{formatPHP(s.value, { compact: true })}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
