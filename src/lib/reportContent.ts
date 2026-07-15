import type { EstimateResult, WizardSelections } from "@/types/estimate";
import type { ServiceRow } from "@/types/content";
import { formatMonths, formatPHP } from "@/lib/formatters";

export function buildDeliverables(s: WizardSelections, services: ServiceRow[]): string[] {
  const base: Record<string, string[]> = {
    "New Construction": ["Architectural Plans", "Structural Plans", "Building Permit Set", "Bill of Quantities"],
    Renovation: ["Renovation Plans", "Scope of Work Document", "Permit Set (as required)"],
    Extension: ["Extension Plans", "Structural Tie-in Details", "Permit Set"],
    "Interior Fit-out": ["Interior Layout Plans", "Finish Schedule", "Furniture Layout"],
    "Design Only": ["Full Design Development Set", "Construction Documents", "3D Renders"],
    "Design & Build": ["Full Design Set", "Construction Schedule", "As-Built Plans"],
  };
  const core = (s.projectType && base[s.projectType]) || base["New Construction"];
  const extras = s.services.map((id) => services.find((sv) => sv.id === id)?.label).filter(Boolean) as string[];
  return Array.from(new Set([...core, ...extras]));
}

export function buildMaintenanceTips(s: WizardSelections): string[] {
  const tips: string[] = ["Schedule roof and gutter inspection every 6 months to prevent leaks."];
  if (s.building.roofType.includes("Metal")) tips.push("Re-check roof screws and sealant annually to prevent rust and water ingress.");
  if (s.building.floorFinish.includes("Wood")) tips.push("Avoid prolonged water exposure on wood flooring; re-seal every 2–3 years.");
  if (s.building.windowSystem.includes("Double-Glazed")) tips.push("Clean window seals yearly to preserve thermal performance.");
  if (s.building.mepComplexity === "Advanced" || s.building.mepComplexity === "Mission-Critical") {
    tips.push("Set up a quarterly preventive maintenance contract for MEP systems.");
  }
  tips.push("Repaint exterior surfaces every 3–5 years depending on sun and rain exposure.");
  return tips;
}

export function buildAiNotes(s: WizardSelections, e: EstimateResult): string {
  const parts: string[] = [];
  parts.push(
    `This ${s.quality?.toLowerCase()} ${s.category?.toLowerCase()} project (${s.floorArea} sqm, ${s.building.floors} floor${s.building.floors > 1 ? "s" : ""}) is estimated at ${formatPHP(e.totalInvestment)} total investment, with a projected timeline of ${formatMonths(e.timelineMonths)}.`,
  );
  parts.push(
    e.riskScore < 40
      ? "Overall execution risk is low given the current scope and location."
      : e.riskScore < 65
        ? "Execution risk is moderate — plan contingency budget of 8–10% and confirm long-lead items early."
        : "Execution risk is elevated — recommend a detailed geotechnical study and phased procurement to de-risk the schedule.",
  );
  parts.push(`Estimated to require a team of ${e.teamSize} specialists across design and construction management.`);
  return parts.join(" ");
}

export function buildConstructionPhases(): { label: string; pct: number }[] {
  return [
    { label: "Pre-construction & Permitting", pct: 10 },
    { label: "Foundation & Substructure", pct: 15 },
    { label: "Structural Frame", pct: 25 },
    { label: "Enclosure (Roof, Walls, Windows)", pct: 20 },
    { label: "MEP Installation", pct: 15 },
    { label: "Finishes & Turnover", pct: 15 },
  ];
}
