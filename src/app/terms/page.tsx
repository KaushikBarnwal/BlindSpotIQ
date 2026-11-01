import { Metadata } from "next";
import { TermsOfService } from "@/components/terms";

export const metadata: Metadata = {
  title: "Terms of Service — BlindspotIQ",
  description:
    "Review the Terms of Service, Acceptable Use Policy, source credibility disclosures, and AI usage terms for BlindspotIQ.",
};

export default function Page() {
  return <TermsOfService />;
}

