import { Hero } from "@/components/landing/Hero";
import { StatsSection } from "@/components/landing/StatsSection";
import { EstimateGrid } from "@/components/landing/EstimateGrid";
import { PortfolioSection } from "@/components/landing/PortfolioSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FinalCta } from "@/components/landing/FinalCta";

export function LandingPage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <EstimateGrid />
      <PortfolioSection />
      <HowItWorks />
      <FinalCta />
    </>
  );
}
