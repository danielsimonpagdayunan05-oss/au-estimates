import { PROVINCES } from "@/data/provinces";
import { ADDITIONAL_SERVICES } from "@/data/services";
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
import type { SiteDataResponse } from "@/types/content";

const PROJECT_TYPE_TIMELINE_FACTORS: Record<string, number> = {
  "New Construction": 1.0,
  Renovation: 0.6,
  Extension: 0.7,
  "Interior Fit-out": 0.45,
  "Design Only": 0.22,
  "Design & Build": 1.1,
};

/**
 * Client-side fallback used when /api/site-data is unavailable (local dev without
 * Netlify Functions, or a transient outage) — mirrors the database seed data so the
 * site keeps working with the same figures either way.
 */
export const DEFAULT_SITE_DATA: SiteDataResponse = {
  settings: {
    "company.name": "Archiunite Design & Construction",
    "company.shortName": "Archiunite",
    "hero.headline": "Build Your Dream Project with Confidence",
    "hero.subtitle":
      "Instantly estimate your design fee and construction cost using AI-powered calculations — tailored to your province, quality standard, and building program.",
    "hero.tagline": "Together, let us share and build your story.",
    "hero.sampleEstimate": { investment: 12480000, timelineMonths: 14, riskLabel: "Low", riskPct: 28 },
    "estimator.categoryRates": CATEGORY_BASE_RATE,
    "estimator.qualityMultipliers": QUALITY_MULTIPLIER,
    "estimator.projectTypeMultipliers": PROJECT_TYPE_MULTIPLIER,
    "estimator.mepMultipliers": MEP_MULTIPLIER,
    "estimator.architecturalFeeTiers": ARCHITECTURAL_FEE_TIERS.map((t) => ({ upTo: Number.isFinite(t.upTo) ? t.upTo : null, rate: t.rate })),
    "estimator.engineeringFeeRate": ENGINEERING_FEE_RATE,
    "estimator.interiorFeeRate": INTERIOR_FEE_RATE,
    "estimator.floorsCostAdderPerLevel": FLOORS_COST_ADDER_PER_LEVEL,
    "estimator.qualityTimelineFactors": QUALITY_TIMELINE_FACTOR,
    "estimator.projectTypeTimelineFactors": PROJECT_TYPE_TIMELINE_FACTORS,
  },
  stats: [
    { id: -1, label: "Projects Estimated", value: 2400, prefix: "", suffix: "+", sortOrder: 0 },
    { id: -2, label: "Project Value Estimated", value: 18, prefix: "₱", suffix: "B+", sortOrder: 1 },
    { id: -3, label: "Client Satisfaction", value: 98, prefix: "", suffix: "%", sortOrder: 2 },
    { id: -4, label: "Average Estimate Time", value: 2, prefix: "", suffix: " min", sortOrder: 3 },
  ],
  provinces: PROVINCES.map((p, i) => ({ id: -(i + 1), name: p.name, region: p.region, multiplier: p.multiplier, cities: p.cities, sortOrder: i })),
  services: ADDITIONAL_SERVICES.map((s, i) => ({ id: s.id, label: s.label, category: s.category, feeType: s.feeType, value: s.value, sortOrder: i })),
  portfolio: [],
};
