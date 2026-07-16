export interface StatItemRow {
  id: number;
  label: string;
  value: number;
  prefix: string;
  suffix: string;
  sortOrder: number;
}

export interface ProvinceRow {
  id: number;
  name: string;
  region: string;
  multiplier: number;
  cities: string[];
  sortOrder: number;
}

export interface ServiceRow {
  id: string;
  label: string;
  category: "design" | "engineering" | "construction" | "documentation" | "survey";
  feeType: "percent" | "flat" | "per_sqm";
  value: number;
  sortOrder: number;
}

export interface PortfolioItemRow {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  floorAreaSqm: number | null;
  completionYear: number | null;
  coverImageKey: string | null;
  galleryImageKeys: string[];
  featured: boolean;
  sortOrder: number;
}

export interface FeeTier {
  upTo: number | null;
  rate: number;
}

export interface PhaseItem {
  label: string;
  pct: number;
}

export interface TextCard {
  key: string;
  title: string;
  desc: string;
}

export interface EstimatorSettings {
  categoryRates: Record<string, number>;
  qualityMultipliers: Record<string, number>;
  projectTypeMultipliers: Record<string, number>;
  mepMultipliers: Record<string, number>;
  architecturalFeeTiers: FeeTier[];
  engineeringFeeRate: number;
  interiorFeeRate: number;
  floorsCostAdderPerLevel: number;
  qualityTimelineFactors: Record<string, number>;
  projectTypeTimelineFactors: Record<string, number>;
}

export interface SiteSettings {
  "company.name"?: string;
  "company.shortName"?: string;
  "hero.headline"?: string;
  "hero.subtitle"?: string;
  "hero.tagline"?: string;
  "hero.sampleEstimate"?: { investment: number; timelineMonths: number; riskLabel: string; riskPct: number };
  "estimator.categoryRates"?: Record<string, number>;
  "estimator.qualityMultipliers"?: Record<string, number>;
  "estimator.projectTypeMultipliers"?: Record<string, number>;
  "estimator.mepMultipliers"?: Record<string, number>;
  "estimator.architecturalFeeTiers"?: FeeTier[];
  "estimator.engineeringFeeRate"?: number;
  "estimator.interiorFeeRate"?: number;
  "estimator.floorsCostAdderPerLevel"?: number;
  "estimator.qualityTimelineFactors"?: Record<string, number>;
  "estimator.projectTypeTimelineFactors"?: Record<string, number>;
  "estimator.constructionPhases"?: PhaseItem[];
  "estimator.timelinePhases.default"?: PhaseItem[];
  "estimator.timelinePhases.designOnly"?: PhaseItem[];
  "estimator.timelinePhases.interiorFitout"?: PhaseItem[];
  "landing.estimateGrid"?: TextCard[];
  "landing.howItWorks"?: TextCard[];
  "landing.finalCta.heading"?: string;
  "landing.finalCta.subtext"?: string;
  [key: string]: unknown;
}

export interface SiteDataResponse {
  settings: SiteSettings;
  stats: StatItemRow[];
  provinces: ProvinceRow[];
  services: ServiceRow[];
  portfolio: PortfolioItemRow[];
}
