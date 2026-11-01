import React from "react";
import { LandingNavbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ComparisonPreview } from "@/components/landing/ComparisonPreview";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { UseCases } from "@/components/landing/UseCases";
import { CTABanner } from "@/components/landing/CTABanner";
import { LandingFooter } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-emerald-100 selection:text-emerald-950">
      <LandingNavbar />
      <Hero />
      <ComparisonPreview />
      <FeatureGrid />
      <HowItWorks />
      <UseCases />
      <CTABanner />
      <LandingFooter />
    </div>
  );
}
