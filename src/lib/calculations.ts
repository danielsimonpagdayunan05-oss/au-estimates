import {
  ARCHITECTURAL_FEE_TIERS,
  CATEGORY_BASE_RATE,
  ENGINEERING_FEE_RATE,
  FLOORS_COST_ADDER_PER_LEVEL,
  INTERIOR_FEE_RATE,
  MEP_MULTIPLIER,
  PROJECT_TYPE_MULTIPLIER,
  QUALITY_MULTIPLIER,
  QUALITY_TIMELINE_FACTOR,
} from "@/data/costRates";
import { PROVINCES } from "@/data/provinces";
import { ADDITIONAL_SERVICES, SERVICE_CATEGORY_LABELS } from "@/data/services";
import type { AdditionalService, CostBreakdownItem, EstimateResult, WizardSelections } from "@/types/estimate";
import { buildRecommendations } from "@/lib/recommendations";

const TYPE_TIMELINE_FACTOR: Record<string, number> = {
  "New Construction": 1.0,
  Renovation: 0.6,
  Extension: 0.7,
  "Interior Fit-out": 0.45,
  "Design Only": 0.22,
  "Design & Build": 1.1,
};

const MEP_RISK: Record<string, number> = { Simple: 0, Standard: 5, Advanced: 12, "Mission-Critical": 20 };
const MEP_INDEX: Record<string, number> = { Simple: 1, Standard: 2, Advanced: 3, "Mission-Critical": 4 };
const QUALITY_INDEX: Record<string, number> = { Basic: 1, Standard: 2, Premium: 3, Luxury: 4, "Ultra Luxury": 5 };
const HIGH_RISK_CATEGORIES = new Set(["Hospital", "Industrial", "Institutional", "Warehouse"]);

function getArchitecturalRate(feeBasis: number) {
  const tier = ARCHITECTURAL_FEE_TIERS.find((t) => feeBasis <= t.upTo);
  return tier ? tier.rate : ARCHITECTURAL_FEE_TIERS[ARCHITECTURAL_FEE_TIERS.length - 1].rate;
}

function serviceCost(service: AdditionalService, floorArea: number, feeBasis: number) {
  switch (service.feeType) {
    case "per_sqm":
      return service.value * floorArea;
    case "percent":
      return service.value * feeBasis;
    case "flat":
    default:
      return service.value;
  }
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function calculateEstimate(s: WizardSelections): EstimateResult | null {
  if (!s.category || !s.projectType || !s.quality || !s.floorArea) return null;

  const base = CATEGORY_BASE_RATE[s.category];
  const quality = QUALITY_MULTIPLIER[s.quality];
  const mep = MEP_MULTIPLIER[s.building.mepComplexity];
  const provinceEntry = PROVINCES.find((p) => p.name === s.location.province);
  const provinceMultiplier = provinceEntry?.multiplier ?? 1;
  const floorsAdder = 1 + Math.max(0, s.building.floors - 1) * FLOORS_COST_ADDER_PER_LEVEL;

  const referenceCostPerSqm = base * quality * mep * provinceMultiplier * floorsAdder;
  const referenceCost = referenceCostPerSqm * s.floorArea;

  const isDesignOnly = s.projectType === "Design Only";
  const isInteriorFitout = s.projectType === "Interior Fit-out";
  const typeMultiplier = PROJECT_TYPE_MULTIPLIER[s.projectType];

  const constructionCost = isDesignOnly ? 0 : referenceCost * typeMultiplier;
  const constructionCostPerSqm = isDesignOnly ? 0 : referenceCostPerSqm * typeMultiplier;
  const feeBasis = isDesignOnly ? referenceCost : constructionCost;

  const designApplicable = !isInteriorFitout;
  const architecturalFee = designApplicable ? feeBasis * getArchitecturalRate(feeBasis) : 0;
  const engineeringFee = designApplicable ? feeBasis * ENGINEERING_FEE_RATE : 0;
  const interiorFee = isInteriorFitout ? feeBasis * INTERIOR_FEE_RATE : 0;

  const categoryTotals: Record<string, number> = {};
  let additionalServicesCost = 0;
  for (const id of s.services) {
    const svc = ADDITIONAL_SERVICES.find((x) => x.id === id);
    if (!svc) continue;
    const cost = serviceCost(svc, s.floorArea, feeBasis || referenceCost);
    additionalServicesCost += cost;
    categoryTotals[svc.category] = (categoryTotals[svc.category] ?? 0) + cost;
  }

  const professionalFees: CostBreakdownItem[] = [
    { label: "Architectural Design Fee", amount: architecturalFee },
    { label: "Engineering Design Fee", amount: engineeringFee },
    { label: "Interior Design Fee", amount: interiorFee },
    ...Object.entries(categoryTotals).map(([cat, amount]) => ({
      label: `${SERVICE_CATEGORY_LABELS[cat as AdditionalService["category"]]} (Add-ons)`,
      amount,
    })),
  ].filter((item) => item.amount > 0);

  const totalInvestment = constructionCost + architecturalFee + engineeringFee + interiorFee + additionalServicesCost;

  const timelineMonths = Math.max(
    1,
    Math.round(
      (2 + Math.sqrt(s.floorArea / 40)) *
        QUALITY_TIMELINE_FACTOR[s.quality] *
        (TYPE_TIMELINE_FACTOR[s.projectType] ?? 1) *
        (1 + Math.max(0, s.building.floors - 1) * 0.08),
    ),
  );

  const teamSize = Math.max(
    3,
    Math.round(s.floorArea / 150 + s.building.floors + MEP_INDEX[s.building.mepComplexity]),
  );

  const riskScore = clamp(
    20 +
      (s.building.floors > 5 ? 15 : s.building.floors > 2 ? 8 : 0) +
      MEP_RISK[s.building.mepComplexity] +
      (s.projectType === "Renovation" ? 15 : s.projectType === "Extension" ? 8 : 0) +
      (HIGH_RISK_CATEGORIES.has(s.category) ? 10 : 0) +
      (provinceMultiplier < 0.85 ? 8 : 0) +
      (s.quality === "Ultra Luxury" ? 10 : s.quality === "Luxury" ? 5 : 0),
    5,
    98,
  );

  const complexityIndex = clamp(
    10 +
      s.building.floors * 4 +
      MEP_INDEX[s.building.mepComplexity] * 10 +
      s.services.length * 1.5 +
      QUALITY_INDEX[s.quality] * 6 +
      (HIGH_RISK_CATEGORIES.has(s.category) ? 12 : 0),
    5,
    100,
  );

  const budgetCategoryMap: Record<string, EstimateResult["budgetCategory"]> = {
    Basic: "Economy",
    Standard: "Mid-Market",
    Premium: "Premium",
    Luxury: "Luxury",
    "Ultra Luxury": "Luxury",
  };

  const sustainabilityScore = clamp(
    45 +
      (s.services.includes("landscape-design") ? 6 : 0) +
      (s.building.windowSystem.includes("Double-Glazed") ? 12 : 0) +
      (s.building.roofType.includes("Green") ? 15 : 0) +
      (s.building.structuralSystem === "Precast Concrete" ? 6 : 0) +
      (s.building.mepComplexity === "Advanced" || s.building.mepComplexity === "Mission-Critical" ? 6 : 0),
    10,
    98,
  );

  const structuralFactor = s.building.structuralSystem === "Steel Frame" ? 1.1 : s.building.structuralSystem === "Precast Concrete" ? 0.85 : 1.0;
  const carbonFootprintTons = Math.round(s.floorArea * 0.35 * structuralFactor * (1 - sustainabilityScore / 500) * 10) / 10;

  const result: EstimateResult = {
    constructionCostPerSqm,
    constructionCost,
    architecturalFee,
    engineeringFee,
    interiorFee,
    professionalFees,
    additionalServicesCost,
    totalInvestment,
    timelineMonths,
    teamSize,
    riskScore,
    complexityIndex,
    budgetCategory: budgetCategoryMap[s.quality],
    sustainabilityScore,
    carbonFootprintTons,
    recommendations: [],
  };

  result.recommendations = buildRecommendations(s, result, provinceMultiplier);
  return result;
}
