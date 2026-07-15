import type { ProjectCategory } from "@/types/estimate";

/** Placeholder indicative monthly rent (PHP/sqm) by category — refine with market data later. */
const RENT_PER_SQM: Partial<Record<ProjectCategory, number>> = {
  Commercial: 900,
  Office: 750,
  "Mixed-use": 800,
  Warehouse: 250,
  Industrial: 220,
};

export function calculateRoi(category: ProjectCategory, floorArea: number, totalInvestment: number) {
  const rentRate = RENT_PER_SQM[category];
  if (!rentRate || totalInvestment <= 0) return null;

  const monthlyRent = rentRate * floorArea;
  const annualRent = monthlyRent * 12;
  const occupancyFactor = 0.9;
  const annualNetIncome = annualRent * occupancyFactor * 0.75; // less opex/vacancy allowance
  const grossYield = (annualRent / totalInvestment) * 100;
  const netYield = (annualNetIncome / totalInvestment) * 100;
  const paybackYears = totalInvestment / annualNetIncome;

  return { monthlyRent, annualRent, annualNetIncome, grossYield, netYield, paybackYears };
}
