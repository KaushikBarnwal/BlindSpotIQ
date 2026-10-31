import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlindspotIQ — AI-Assisted Information Gap & Contradiction Platform",
  description:
    "Detect what's missing, outdated, or contradictory across multiple web sources for high-stakes decision making.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
