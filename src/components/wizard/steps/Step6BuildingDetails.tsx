import { Minus, Plus } from "lucide-react";
import {
  CEILING_TYPES,
  DOOR_MATERIALS,
  FLOOR_FINISHES,
  FOUNDATION_TYPES,
  MEP_COMPLEXITY_OPTIONS,
  ROOF_TYPES,
  STRUCTURAL_SYSTEMS,
  WALL_MATERIALS,
  WINDOW_SYSTEMS,
} from "@/data/buildingOptions";
import { Select } from "@/components/ui/Select";
import { useWizardStore } from "@/store/wizardStore";
import type { MepComplexity } from "@/types/estimate";

export function Step6BuildingDetails() {
  const { selections, setBuilding } = useWizardStore();
  const b = selections.building;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink-950 dark:text-white">Building specifications</h2>
      <p className="mt-2 text-ink-500 dark:text-ink-400">Fine-tune the structural and finish assumptions.</p>

      <div className="mt-8 flex items-center justify-between rounded-2xl border border-ink-100 bg-white p-5 dark:border-white/[0.06] dark:bg-ink-900">
        <div>
          <p className="font-semibold text-ink-900 dark:text-white">Number of Floors</p>
          <p className="text-sm text-ink-500 dark:text-ink-400">Including ground floor</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setBuilding({ floors: Math.max(1, b.floors - 1) })}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-600 hover:bg-ink-50 dark:border-white/15 dark:text-ink-300 dark:hover:bg-white/5"
          >
            <Minus size={16} />
          </button>
          <span className="w-6 text-center font-display text-2xl font-semibold text-ink-950 dark:text-white">{b.floors}</span>
          <button
            onClick={() => setBuilding({ floors: Math.min(60, b.floors + 1) })}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-600 hover:bg-ink-50 dark:border-white/15 dark:text-ink-300 dark:hover:bg-white/5"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Select label="Roof Type" value={b.roofType} onChange={(v) => setBuilding({ roofType: v })} options={ROOF_TYPES} />
        <Select label="Foundation Type" value={b.foundationType} onChange={(v) => setBuilding({ foundationType: v })} options={FOUNDATION_TYPES} />
        <Select label="Structural System" value={b.structuralSystem} onChange={(v) => setBuilding({ structuralSystem: v })} options={STRUCTURAL_SYSTEMS} />
        <Select label="Wall Material" value={b.wallMaterial} onChange={(v) => setBuilding({ wallMaterial: v })} options={WALL_MATERIALS} />
        <Select label="Ceiling Type" value={b.ceilingType} onChange={(v) => setBuilding({ ceilingType: v })} options={CEILING_TYPES} />
        <Select label="Floor Finish" value={b.floorFinish} onChange={(v) => setBuilding({ floorFinish: v })} options={FLOOR_FINISHES} />
        <Select label="Window System" value={b.windowSystem} onChange={(v) => setBuilding({ windowSystem: v })} options={WINDOW_SYSTEMS} />
        <Select label="Door Material" value={b.doorMaterial} onChange={(v) => setBuilding({ doorMaterial: v })} options={DOOR_MATERIALS} />
        <Select
          label="MEP Complexity"
          value={b.mepComplexity}
          onChange={(v) => setBuilding({ mepComplexity: v as MepComplexity })}
          options={MEP_COMPLEXITY_OPTIONS}
        />
      </div>
    </div>
  );
}
