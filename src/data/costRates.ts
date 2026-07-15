import type { MepComplexity, ProjectCategory, ProjectType, QualityStandard } from "@/types/estimate";

/**
 * All figures below are illustrative placeholders (PHP) for prototype purposes only.
 * TODO: replace with verified Archiunite cost data via the admin panel before production use.
 */

export const CATEGORY_BASE_RATE: Record<ProjectCategory, number> = {
  Residential: 32000,
  Commercial: 38000,
  Office: 40000,
  Industrial: 26000,
  Institutional: 34000,
  Hospital: 55000,
  Warehouse: 20000,
  "Mixed-use": 42000,
  Subdivision: 28000,
  Others: 30000,
};

export const QUALITY_MULTIPLIER: Record<QualityStandard, number> = {
  Basic: 0.75,
  Standard: 1.0,
  Premium: 1.35,
  Luxury: 1.8,
  "Ultra Luxury": 2.6,
};

export const PROJECT_TYPE_MULTIPLIER: Record<ProjectType, number> = {
  "New Construction": 1.0,
  Renovation: 0.65,
  Extension: 0.8,
  "Interior Fit-out": 0.55,
  "Design Only": 0.12,
  "Design & Build": 1.05,
};

export const MEP_MULTIPLIER: Record<MepComplexity, number> = {
  Simple: 1.0,
  Standard: 1.08,
  Advanced: 1.2,
  "Mission-Critical": 1.42,
};

/** Professional design fee as % of construction cost, tiered by project value (PH-typical bands). */
export const ARCHITECTURAL_FEE_TIERS = [
  { upTo: 3_000_000, rate: 0.12 },
  { upTo: 10_000_000, rate: 0.1 },
  { upTo: 30_000_000, rate: 0.085 },
  { upTo: 100_000_000, rate: 0.07 },
  { upTo: Infinity, rate: 0.06 },
];

export const ENGINEERING_FEE_RATE = 0.045;
export const INTERIOR_FEE_RATE = 0.06;

export const FLOORS_COST_ADDER_PER_LEVEL = 0.03; // +3% per additional floor above 1 (vertical circulation, structure)

export const QUALITY_TIMELINE_FACTOR: Record<QualityStandard, number> = {
  Basic: 0.85,
  Standard: 1.0,
  Premium: 1.15,
  Luxury: 1.35,
  "Ultra Luxury": 1.6,
};
