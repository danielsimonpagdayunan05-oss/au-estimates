import type { EstimateResult, WizardSelections } from "@/types/estimate";

/**
 * Deterministic, rules-based recommendation engine (no external AI calls).
 */
export function buildRecommendations(
  s: WizardSelections,
  estimate: EstimateResult,
  provinceMultiplier: number,
): string[] {
  const recs: string[] = [];

  if (s.building.floors >= 4 || ["Commercial", "Office", "Hospital", "Institutional"].includes(s.category ?? "")) {
    recs.push("Reinforced Concrete Frame for structural rigidity at this height/occupancy");
    recs.push("200A+ Electrical Service Entrance to support building load");
  } else {
    recs.push("Load-bearing CHB or light structural frame is sufficient for this scale");
  }

  recs.push("Standing Seam Metal Roofing for typhoon and wind-uplift resistance");
  recs.push("Full waterproofing system on roof deck, wet areas, and foundation");

  if (s.quality === "Premium" || s.quality === "Luxury" || s.quality === "Ultra Luxury") {
    recs.push("Double-Glazed Windows for thermal and acoustic insulation");
  }

  if (s.building.floors >= 3) {
    recs.push("Underground Cistern with booster pump for consistent water pressure");
  } else if (s.category === "Residential") {
    recs.push("Septic tank sized for projected household occupancy");
  }

  if (s.quality === "Luxury" || s.quality === "Ultra Luxury" || estimate.sustainabilityScore >= 65) {
    recs.push("Rainwater Harvesting System to reduce utility costs");
    recs.push("Solar-Ready Roof Design (conduit + panel mounting provisions)");
  }

  if (s.building.mepComplexity === "Advanced" || s.building.mepComplexity === "Mission-Critical") {
    recs.push("Backup Generator and UPS system for uninterrupted operations");
  }

  if (provinceMultiplier < 0.85) {
    recs.push("Prioritize locally sourced materials to reduce logistics and lead time");
  }

  if (estimate.riskScore >= 55) {
    recs.push("Geotechnical Investigation recommended before finalizing foundation design");
  }

  return recs;
}
