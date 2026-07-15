import type { AdditionalService } from "@/types/estimate";

/** Placeholder pricing — tune via admin panel in a later phase. */
export const ADDITIONAL_SERVICES: AdditionalService[] = [
  { id: "architectural-design", label: "Architectural Design", category: "design", feeType: "per_sqm", value: 250 },
  { id: "structural-design", label: "Structural Design", category: "engineering", feeType: "per_sqm", value: 180 },
  { id: "electrical-design", label: "Electrical Design", category: "engineering", feeType: "per_sqm", value: 90 },
  { id: "plumbing-design", label: "Plumbing Design", category: "engineering", feeType: "per_sqm", value: 70 },
  { id: "mechanical-design", label: "Mechanical Design", category: "engineering", feeType: "per_sqm", value: 110 },
  { id: "fire-protection", label: "Fire Protection", category: "engineering", feeType: "per_sqm", value: 60 },
  { id: "sanitary", label: "Sanitary", category: "engineering", feeType: "per_sqm", value: 50 },
  { id: "interior-design", label: "Interior Design", category: "design", feeType: "per_sqm", value: 300 },
  { id: "landscape-design", label: "Landscape Design", category: "design", feeType: "per_sqm", value: 120 },
  { id: "permit-processing", label: "Permit Processing", category: "documentation", feeType: "flat", value: 85000 },
  { id: "3d-perspective", label: "3D Perspective", category: "design", feeType: "flat", value: 25000 },
  { id: "walkthrough-animation", label: "Walkthrough Animation", category: "design", feeType: "flat", value: 65000 },
  { id: "bill-of-quantities", label: "Bill of Quantities", category: "documentation", feeType: "flat", value: 35000 },
  { id: "project-management", label: "Project Management", category: "construction", feeType: "percent", value: 0.05 },
  { id: "construction-supervision", label: "Construction Supervision", category: "construction", feeType: "percent", value: 0.04 },
  { id: "as-built-plans", label: "As-Built Plans", category: "documentation", feeType: "flat", value: 20000 },
  { id: "bim-modeling", label: "BIM Modeling", category: "design", feeType: "percent", value: 0.015 },
  { id: "drone-survey", label: "Drone Survey", category: "survey", feeType: "flat", value: 18000 },
  { id: "site-inspection", label: "Site Inspection", category: "survey", feeType: "flat", value: 12000 },
  { id: "geotechnical-investigation", label: "Geotechnical Investigation", category: "survey", feeType: "flat", value: 45000 },
];

export const SERVICE_CATEGORY_LABELS: Record<AdditionalService["category"], string> = {
  design: "Design Services",
  engineering: "Engineering Services",
  construction: "Construction Management",
  documentation: "Documentation & Permits",
  survey: "Survey & Investigation",
};
