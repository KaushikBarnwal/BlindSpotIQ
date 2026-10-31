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
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
