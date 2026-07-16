import { SERVICE_CATEGORY_LABELS } from "@/data/services";
import type { AdditionalService, CostBreakdownItem, EstimateResult, WizardSelections } from "@/types/estimate";
import type { PricingRuleRow, ServiceRow, SiteDataResponse } from "@/types/content";
import { buildRecommendations } from "@/lib/recommendations";

const MEP_RISK: Record<string, number> = { Simple: 0, Standard: 5, Advanced: 12, "Mission-Critical": 20 };
const MEP_INDEX: Record<string, number> = { Simple: 1, Standard: 2, Advanced: 3, "Mission-Critical": 4 };
const QUALITY_INDEX: Record<string, number> = { Basic: 1, Standard: 2, Premium: 3, Luxury: 4, "Ultra Luxury": 5 };
const HIGH_RISK_CATEGORIES = new Set(["Hospital", "Industrial", "Institutional", "Warehouse"]);

function getArchitecturalRate(feeBasis: number, tiers: { upTo: number | null; rate: number }[]) {
  const tier = tiers.find((t) => t.upTo !== null && feeBasis <= t.upTo);
  return tier ? tier.rate : tiers[tiers.length - 1]?.rate ?? 0.06;
}

function serviceCost(service: ServiceRow, floorArea: number, feeBasis: number) {
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

function ruleMatches(rule: PricingRuleRow, s: WizardSelections): boolean {
  switch (rule.conditionField) {
    case "projectType":
      return s.projectType === rule.conditionValue;
    case "category":
      return s.category === rule.conditionValue;
    case "quality":
      return s.quality === rule.conditionValue;
    case "mepComplexity":
      return s.building.mepComplexity === rule.conditionValue;
    default:
      return false;
  }
}

function applyRules(amount: number, target: string, rules: PricingRuleRow[], s: WizardSelections, appliedLabels: string[]) {
  let result = amount;
  for (const rule of rules) {
    if (!rule.enabled || rule.actionTarget !== target || !ruleMatches(rule, s)) continue;
    result = rule.actionType === "waive" ? 0 : result * (1 - rule.actionValue / 100);
    appliedLabels.push(rule.label);
  }
  return result;
}

export function calculateEstimate(s: WizardSelections, siteData: SiteDataResponse): EstimateResult | null {
  if (!s.category || !s.projectType || !s.quality || !s.floorArea) return null;

  const settings = siteData.settings;
  const categoryRates = settings["estimator.categoryRates"] ?? {};
  const qualityMultipliers = settings["estimator.qualityMultipliers"] ?? {};
  const projectTypeMultipliers = settings["estimator.projectTypeMultipliers"] ?? {};
  const mepMultipliers = settings["estimator.mepMultipliers"] ?? {};
  const architecturalFeeTiers = settings["estimator.architecturalFeeTiers"] ?? [{ upTo: null, rate: 0.06 }];
  const engineeringFeeRate = settings["estimator.engineeringFeeRate"] ?? 0.045;
  const interiorFeeRate = settings["estimator.interiorFeeRate"] ?? 0.06;
  const floorsCostAdderPerLevel = settings["estimator.floorsCostAdderPerLevel"] ?? 0.03;
  const qualityTimelineFactors = settings["estimator.qualityTimelineFactors"] ?? {};
  const projectTypeTimelineFactors = settings["estimator.projectTypeTimelineFactors"] ?? {};

  const base = categoryRates[s.category] ?? 30000;
  const quality = qualityMultipliers[s.quality] ?? 1;
  const mep = mepMultipliers[s.building.mepComplexity] ?? 1;
  const provinceEntry = siteData.provinces.find((p) => p.name === s.location.province);
  const provinceMultiplier = provinceEntry?.multiplier ?? 1;
  const floorsAdder = 1 + Math.max(0, s.building.floors - 1) * floorsCostAdderPerLevel;

  const referenceCostPerSqm = base * quality * mep * provinceMultiplier * floorsAdder;
  const referenceCost = referenceCostPerSqm * s.floorArea;

  const isDesignOnly = s.projectType === "Design Only";
  const isInteriorFitout = s.projectType === "Interior Fit-out";
  const typeMultiplier = projectTypeMultipliers[s.projectType] ?? 1;

  const feeBasis = isDesignOnly ? referenceCost : referenceCost * typeMultiplier;

  const designApplicable = !isInteriorFitout;
  const rawArchitecturalFee = designApplicable ? feeBasis * getArchitecturalRate(feeBasis, architecturalFeeTiers) : 0;
  const rawEngineeringFee = designApplicable ? feeBasis * engineeringFeeRate : 0;
  const rawInteriorFee = isInteriorFitout ? feeBasis * interiorFeeRate : 0;
  const rawConstructionCost = isDesignOnly ? 0 : referenceCost * typeMultiplier;

  const activeRules = (siteData.pricingRules ?? []).filter((r) => r.enabled);
  const appliedRuleLabels: string[] = [];
  const architecturalNotes: string[] = [];
  const engineeringNotes: string[] = [];
  const interiorNotes: string[] = [];

  const architecturalFee = applyRules(rawArchitecturalFee, "architecturalFee", activeRules, s, architecturalNotes);
  const engineeringFee = applyRules(rawEngineeringFee, "engineeringFee", activeRules, s, engineeringNotes);
  const interiorFee = applyRules(rawInteriorFee, "interiorFee", activeRules, s, interiorNotes);
  const constructionCostNotes: string[] = [];
  const constructionCost = applyRules(rawConstructionCost, "constructionCost", activeRules, s, constructionCostNotes);
  const constructionCostPerSqm = rawConstructionCost > 0 ? (isDesignOnly ? 0 : referenceCostPerSqm * typeMultiplier) * (constructionCost / rawConstructionCost) : 0;
  appliedRuleLabels.push(...architecturalNotes, ...engineeringNotes, ...interiorNotes, ...constructionCostNotes);

  const categoryTotals: Record<string, number> = {};
  let additionalServicesCost = 0;
  for (const id of s.services) {
    const svc = siteData.services.find((x) => x.id === id);
    if (!svc) continue;
    const cost = serviceCost(svc, s.floorArea, feeBasis || referenceCost);
    additionalServicesCost += cost;
    categoryTotals[svc.category] = (categoryTotals[svc.category] ?? 0) + cost;
  }

  const rawProfessionalFees: CostBreakdownItem[] = [
    { label: "Architectural Design Fee", amount: architecturalFee, note: architecturalNotes[0] },
    { label: "Engineering Design Fee", amount: engineeringFee, note: engineeringNotes[0] },
    { label: "Interior Design Fee", amount: interiorFee, note: interiorNotes[0] },
    ...Object.entries(categoryTotals).map(([cat, amount]) => ({
      label: `${SERVICE_CATEGORY_LABELS[cat as AdditionalService["category"]]} (Add-ons)`,
      amount,
    })),
  ];
  const professionalFees = rawProfessionalFees.filter((item) => item.amount > 0 || item.note);

  const totalInvestment = constructionCost + architecturalFee + engineeringFee + interiorFee + additionalServicesCost;

  const timelineMonths = Math.max(
    1,
    Math.round(
      (2 + Math.sqrt(s.floorArea / 40)) *
        (qualityTimelineFactors[s.quality] ?? 1) *
        (projectTypeTimelineFactors[s.projectType] ?? 1) *
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
    appliedRules: appliedRuleLabels,
    recommendations: [],
  };

  result.recommendations = buildRecommendations(s, result, provinceMultiplier);
  return result;
}
