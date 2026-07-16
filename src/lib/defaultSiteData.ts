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
    "estimator.constructionPhases": [
      { label: "Pre-construction & Permitting", pct: 10 },
      { label: "Foundation & Substructure", pct: 15 },
      { label: "Structural Frame", pct: 25 },
      { label: "Enclosure (Roof, Walls, Windows)", pct: 20 },
      { label: "MEP Installation", pct: 15 },
      { label: "Finishes & Turnover", pct: 15 },
    ],
    "estimator.timelinePhases.default": [
      { label: "Design & Permitting", pct: 20 },
      { label: "Foundation & Structure", pct: 30 },
      { label: "Enclosure & MEP Rough-in", pct: 25 },
      { label: "Finishes & Turnover", pct: 25 },
    ],
    "estimator.timelinePhases.designOnly": [
      { label: "Concept Design", pct: 25 },
      { label: "Design Development", pct: 35 },
      { label: "Construction Documents", pct: 25 },
      { label: "Permitting", pct: 15 },
    ],
    "estimator.timelinePhases.interiorFitout": [
      { label: "Design", pct: 15 },
      { label: "Procurement", pct: 20 },
      { label: "Fit-out Construction", pct: 50 },
      { label: "Handover", pct: 15 },
    ],
    "landing.estimateGrid": [
      { key: "architectural-fee", title: "Architectural Design Fee", desc: "Tiered professional fee based on project value and scope." },
      { key: "engineering-fee", title: "Engineering Design Fee", desc: "Structural, electrical, mechanical & plumbing design." },
      { key: "interior-fee", title: "Interior Design Fee", desc: "Space planning, finishes, and furniture specification." },
      { key: "construction-cost", title: "Construction Cost", desc: "Province-adjusted cost per sqm by quality standard." },
      { key: "renovation-cost", title: "Renovation Cost", desc: "Scoped pricing for upgrades and structural rework." },
      { key: "fitout-cost", title: "Fit-out Cost", desc: "Turnkey interior fit-out for commercial & retail spaces." },
      { key: "project-duration", title: "Project Duration", desc: "AI-modeled timeline from design to turnover." },
      { key: "professional-fees", title: "Professional Fees", desc: "Full breakdown across every service you select." },
    ],
    "landing.howItWorks": [
      { key: "step-1", title: "Tell us about your project", desc: "Category, location, floor area, quality standard, and building details — 7 quick steps." },
      { key: "step-2", title: "Watch your estimate build live", desc: "Construction cost, design fees, timeline, and risk score update instantly as you choose." },
      { key: "step-3", title: "Download your report", desc: "A branded, shareable proposal with cost breakdown, timeline, and material recommendations." },
    ],
    "landing.finalCta.heading": "Ready to see your numbers?",
    "landing.finalCta.subtext": "Get a complete cost and timeline estimate for your project — free, instant, and tailored to your location.",
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
