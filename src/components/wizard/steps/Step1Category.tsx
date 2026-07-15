import {
  Home,
  Store,
  Briefcase,
  Factory,
  Landmark,
  HeartPulse,
  Warehouse,
  Layers,
  Map,
  MoreHorizontal,
} from "lucide-react";
import type { ProjectCategory } from "@/types/estimate";
import { SelectionCard } from "@/components/ui/SelectionCard";
import { useWizardStore } from "@/store/wizardStore";

const CATEGORIES: { value: ProjectCategory; icon: typeof Home; desc: string }[] = [
  { value: "Residential", icon: Home, desc: "Homes, townhouses, condos" },
  { value: "Commercial", icon: Store, desc: "Retail, F&B, mixed retail" },
  { value: "Office", icon: Briefcase, desc: "Corporate & co-working" },
  { value: "Industrial", icon: Factory, desc: "Factories & plants" },
  { value: "Institutional", icon: Landmark, desc: "Schools, government" },
  { value: "Hospital", icon: HeartPulse, desc: "Healthcare facilities" },
  { value: "Warehouse", icon: Warehouse, desc: "Storage & logistics" },
  { value: "Mixed-use", icon: Layers, desc: "Multiple use types" },
  { value: "Subdivision", icon: Map, desc: "Housing developments" },
  { value: "Others", icon: MoreHorizontal, desc: "Something else" },
];

export function Step1Category() {
  const { selections, setCategory } = useWizardStore();

  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink-950 dark:text-white">What type of project is this?</h2>
      <p className="mt-2 text-ink-500 dark:text-ink-400">Select the category that best describes your project.</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CATEGORIES.map((c) => (
          <SelectionCard
            key={c.value}
            label={c.value}
            description={c.desc}
            icon={c.icon}
            selected={selections.category === c.value}
            onClick={() => setCategory(c.value)}
          />
        ))}
      </div>
    </div>
  );
}
