import { Hammer, Wrench, Expand, Sofa, PenTool, Blocks } from "lucide-react";
import type { ProjectType } from "@/types/estimate";
import { SelectionCard } from "@/components/ui/SelectionCard";
import { useWizardStore } from "@/store/wizardStore";

const TYPES: { value: ProjectType; icon: typeof Hammer; desc: string }[] = [
  { value: "New Construction", icon: Hammer, desc: "Building from the ground up" },
  { value: "Renovation", icon: Wrench, desc: "Upgrading an existing structure" },
  { value: "Extension", icon: Expand, desc: "Adding to an existing footprint" },
  { value: "Interior Fit-out", icon: Sofa, desc: "Interiors within an existing shell" },
  { value: "Design Only", icon: PenTool, desc: "Plans & documentation only" },
  { value: "Design & Build", icon: Blocks, desc: "End-to-end design and construction" },
];

export function Step2ProjectType() {
  const { selections, setProjectType } = useWizardStore();

  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink-950 dark:text-white">What's the scope of work?</h2>
      <p className="mt-2 text-ink-500 dark:text-ink-400">This shapes how we calculate cost and timeline.</p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TYPES.map((t) => (
          <SelectionCard
            key={t.value}
            label={t.value}
            description={t.desc}
            icon={t.icon}
            selected={selections.projectType === t.value}
            onClick={() => setProjectType(t.value)}
          />
        ))}
      </div>
    </div>
  );
}
