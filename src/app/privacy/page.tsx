import { Metadata } from "next";
import { PrivacyPolicy } from "@/components/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy — BlindspotIQ",
  description:
    "Learn about BlindspotIQ's zero-retention privacy policy, in-memory processing, SSRF security boundaries, and data protection practices.",
};

export default function Page() {
  return <PrivacyPolicy />;
}

