import { Ruler } from "lucide-react";
import { Slider } from "@/components/ui/Slider";
import { useWizardStore } from "@/store/wizardStore";

const PRESETS = [60, 100, 150, 250, 400, 800];

export function Step4FloorArea() {
  const { selections, setFloorArea } = useWizardStore();

  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink-950 dark:text-white">What's the total floor area?</h2>
      <p className="mt-2 text-ink-500 dark:text-ink-400">Drag the slider or type an exact value in square meters.</p>

      <div className="mt-10 rounded-2xl border border-ink-100 bg-white p-8 text-center dark:border-white/[0.06] dark:bg-ink-900">
        <span className="flex items-center justify-center gap-1.5 text-sm font-medium text-ink-400">
          <Ruler size={15} /> Floor Area
        </span>
        <div className="mt-3 flex items-center justify-center gap-2">
          <input
            type="number"
            min={10}
            max={20000}
            value={selections.floorArea}
            onChange={(e) => setFloorArea(Math.max(10, Number(e.target.value) || 0))}
            className="w-40 bg-transparent text-center font-display text-5xl font-semibold text-ink-950 outline-none dark:text-white"
          />
          <span className="font-display text-2xl font-medium text-ink-400">sqm</span>
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <Slider min={20} max={2000} step={5} value={Math.min(selections.floorArea, 2000)} onChange={setFloorArea} />
          <div className="mt-2 flex justify-between text-xs text-ink-400">
            <span>20 sqm</span>
            <span>2,000 sqm</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setFloorArea(p)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                selections.floorArea === p
                  ? "border-olive-500 bg-olive-50 text-olive-700 dark:bg-olive-500/15 dark:text-olive-300"
                  : "border-ink-200 text-ink-600 hover:border-ink-300 dark:border-white/10 dark:text-ink-300"
              }`}
            >
              {p} sqm
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
