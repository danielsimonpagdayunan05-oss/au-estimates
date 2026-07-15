export type ProjectCategory =
  | "Residential"
  | "Commercial"
  | "Office"
  | "Industrial"
  | "Institutional"
  | "Hospital"
  | "Warehouse"
  | "Mixed-use"
  | "Subdivision"
  | "Others";

export type ProjectType =
  | "New Construction"
  | "Renovation"
  | "Extension"
  | "Interior Fit-out"
  | "Design Only"
  | "Design & Build";

export type QualityStandard = "Basic" | "Standard" | "Premium" | "Luxury" | "Ultra Luxury";

export type MepComplexity = "Simple" | "Standard" | "Advanced" | "Mission-Critical";

export interface ProjectLocation {
  province: string;
  city: string;
  municipality: string;
}

export interface BuildingDetails {
  floors: number;
  roofType: string;
  foundationType: string;
  structuralSystem: string;
  wallMaterial: string;
  ceilingType: string;
  floorFinish: string;
  windowSystem: string;
  doorMaterial: string;
  mepComplexity: MepComplexity;
}

export interface AdditionalService {
  id: string;
  label: string;
  category: "design" | "engineering" | "construction" | "documentation" | "survey";
  feeType: "percent" | "flat" | "per_sqm";
  value: number;
}

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  projectLocation: string;
  budget: string;
  targetCompletion: string;
  consultationDate: string;
  notes: string;
}

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal"
  | "Negotiation"
  | "Won"
  | "Lost";

export interface WizardSelections {
  category: ProjectCategory | null;
  projectType: ProjectType | null;
  location: ProjectLocation;
  floorArea: number;
  quality: QualityStandard | null;
  building: BuildingDetails;
  services: string[];
}

export interface CostBreakdownItem {
  label: string;
  amount: number;
}

export interface EstimateResult {
  constructionCostPerSqm: number;
  constructionCost: number;
  architecturalFee: number;
  engineeringFee: number;
  interiorFee: number;
  professionalFees: CostBreakdownItem[];
  additionalServicesCost: number;
  totalInvestment: number;
  timelineMonths: number;
  teamSize: number;
  riskScore: number;
  complexityIndex: number;
  budgetCategory: "Economy" | "Mid-Market" | "Premium" | "Luxury";
  sustainabilityScore: number;
  carbonFootprintTons: number;
  recommendations: string[];
}
