import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BuildingDetails, ProjectCategory, ProjectLocation, ProjectType, QualityStandard, WizardSelections } from "@/types/estimate";
import {
  CEILING_TYPES,
  DOOR_MATERIALS,
  FLOOR_FINISHES,
  FOUNDATION_TYPES,
  ROOF_TYPES,
  STRUCTURAL_SYSTEMS,
  WALL_MATERIALS,
  WINDOW_SYSTEMS,
} from "@/data/buildingOptions";

export const TOTAL_STEPS = 7;

const defaultBuilding: BuildingDetails = {
  floors: 1,
  roofType: ROOF_TYPES[0],
  foundationType: FOUNDATION_TYPES[0],
  structuralSystem: STRUCTURAL_SYSTEMS[0],
  wallMaterial: WALL_MATERIALS[0],
  ceilingType: CEILING_TYPES[0],
  floorFinish: FLOOR_FINISHES[0],
  windowSystem: WINDOW_SYSTEMS[0],
  doorMaterial: DOOR_MATERIALS[0],
  mepComplexity: "Standard",
};

const defaultLocation: ProjectLocation = { province: "", city: "", municipality: "" };

const defaultSelections: WizardSelections = {
  category: null,
  projectType: null,
  location: defaultLocation,
  floorArea: 150,
  quality: null,
  building: defaultBuilding,
  services: [],
};

interface WizardStore {
  step: number;
  selections: WizardSelections;
  completed: boolean;
  setStep: (step: number) => void;
  next: () => void;
  back: () => void;
  setCategory: (v: ProjectCategory) => void;
  setProjectType: (v: ProjectType) => void;
  setLocation: (v: Partial<ProjectLocation>) => void;
  setFloorArea: (v: number) => void;
  setQuality: (v: QualityStandard) => void;
  setBuilding: (v: Partial<BuildingDetails>) => void;
  toggleService: (id: string) => void;
  setCompleted: (v: boolean) => void;
  reset: () => void;
  isStepValid: (step: number) => boolean;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
}

export const useWizardStore = create<WizardStore>()(
  persist(
    (set, get) => ({
      step: 1,
      selections: defaultSelections,
      completed: false,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      setStep: (step) => set({ step: Math.min(Math.max(step, 1), TOTAL_STEPS) }),
      next: () => set((s) => ({ step: Math.min(s.step + 1, TOTAL_STEPS) })),
      back: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
      setCategory: (v) => set((s) => ({ selections: { ...s.selections, category: v } })),
      setProjectType: (v) => set((s) => ({ selections: { ...s.selections, projectType: v } })),
      setLocation: (v) => set((s) => ({ selections: { ...s.selections, location: { ...s.selections.location, ...v } } })),
      setFloorArea: (v) => set((s) => ({ selections: { ...s.selections, floorArea: v } })),
      setQuality: (v) => set((s) => ({ selections: { ...s.selections, quality: v } })),
      setBuilding: (v) => set((s) => ({ selections: { ...s.selections, building: { ...s.selections.building, ...v } } })),
      toggleService: (id) =>
        set((s) => {
          const has = s.selections.services.includes(id);
          return {
            selections: {
              ...s.selections,
              services: has ? s.selections.services.filter((x) => x !== id) : [...s.selections.services, id],
            },
          };
        }),
      setCompleted: (v) => set({ completed: v }),
      reset: () => set({ step: 1, selections: defaultSelections, completed: false }),
      isStepValid: (step) => {
        const sel = get().selections;
        switch (step) {
          case 1:
            return !!sel.category;
          case 2:
            return !!sel.projectType;
          case 3:
            return !!sel.location.province && !!sel.location.city;
          case 4:
            return sel.floorArea > 0;
          case 5:
            return !!sel.quality;
          case 6:
            return true;
          case 7:
            return true;
          default:
            return false;
        }
      },
    }),
    {
      name: "archiunite.wizard",
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
