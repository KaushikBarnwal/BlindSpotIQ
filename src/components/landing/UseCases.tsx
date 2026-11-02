"use client";

import React, { useState } from "react";
import { BookOpen, Plane, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

const CASES = [
  {
    id: "scholarship",
    icon: BookOpen,
    label: "Academic Scholarships",
    shortLabel: "Scholarships",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    activeBorder: "border-emerald-300",
    scenario: "A student applying for the Global STEM Excellence Scholarship notices eligibility details across 3 sites but nothing about renewal conditions, income limits, or disqualification triggers.",
    gaps: ["Renewal GPA requirement not mentioned in any source", "Appeal process completely absent from all 3 sources", "Disbursement schedule conflicts: annual vs. bi-term"],
    clashes: ["Required letters: 2 (official) vs 1 (blog)", "Deadline: Nov 15 2026 (official) vs Oct 1 2024 (stale guide)"],
    stale: "ScholarshipInsider guide references the 2024 application cycle.",
  },
  {
    id: "visa",
    icon: Plane,
    label: "Immigration & Visas",
    shortLabel: "Visas",
    color: "text-teal-700",
    bg: "bg-teal-50",
    activeBorder: "border-teal-300",
    scenario: "A freelancer researching a Digital Nomad Visa finds income thresholds, insurance requirements, and permitted work types spread inconsistently across government portals and expat blogs.",
    gaps: ["Health insurance minimum coverage amount unclear", "Tax treaty exemption conditions absent across sources", "Dependent inclusion rules not addressed"],
    clashes: ["Monthly income floor: €2,000 (official) vs €2,500 (forum)", "Processing time: 4 weeks (gov.pt) vs 12 weeks (blog)"],
    stale: "One forum post references pre-2024 visa regulations.",
  },
  {
    id: "grant",
    icon: Building2,
    label: "Public Grants & Policy",
    shortLabel: "Grants & Policy",
    color: "text-amber-700",
    bg: "bg-amber-50",
    activeBorder: "border-amber-300",
    scenario: "An NGO applying for a government infrastructure grant finds matching fund percentages, eligible expenditure categories, and reporting deadlines differ across multiple official circulars.",
    gaps: ["Audit reporting format not specified in any circular", "Penalty clauses for late delivery absent from all sources", "Eligible beneficiary definitions inconsistent"],
    clashes: ["Matching funds: 30% (Circular A) vs 40% (Ministry FAQ)", "Submission portal: two different URLs cited"],
    stale: "Circular A references the FY2023 budget cycle, not FY2026.",
  },
];

export function UseCases() {
  const [active, setActive] = useState("scholarship");
  const current = CASES.find((c) => c.id === active)!;
  const Icon = current.icon;

  return (
    <section className="py-20 sm:py-28 bg-zinc-50/70 border-y border-zinc-200/60" id="use-cases">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-800 mb-2.5 font-mono">
            Real-World Examples
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight font-heading">
            Important applications need zero blind spots
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 leading-relaxed">
            One missing detail — an unstated renewal rule, a changed income requirement, or an outdated circular — can delay or disqualify your application.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs: 3 clean columns on mobile, full sidebar on desktop */}
          <div className="grid grid-cols-3 lg:flex lg:flex-col gap-2 sm:gap-2.5 lg:w-64 shrink-0">
            {CASES.map(({ id, icon: TabIcon, label, shortLabel, color, bg, activeBorder }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-3 p-2.5 sm:px-4 sm:py-3 rounded-xl border text-xs sm:text-sm font-bold text-center sm:text-left transition-all cursor-pointer ${
                  active === id
                    ? `bg-white shadow-sm ${activeBorder} ${color}`
                    : "bg-white border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:border-zinc-300"
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${active === id ? bg : "bg-zinc-100"} shrink-0`}>
                  <TabIcon className={`w-4 h-4 ${active === id ? color : "text-zinc-500"}`} />
                </div>
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden text-[11px] leading-tight font-semibold">{shortLabel}</span>
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="flex-1 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            {/* Scenario description */}
            <div className="flex items-start gap-4 pb-5 border-b border-zinc-100">
              <div className={`w-11 h-11 rounded-xl ${current.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${current.color}`} />
              </div>
              <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">
                {current.scenario}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Dark Spots */}
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-rose-600">
                  Missing Info ({current.gaps.length})
                </p>
                <ul className="space-y-2">
                  {current.gaps.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700 leading-snug">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clashes */}
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-amber-600">
                  Contradictions ({current.clashes.length})
                </p>
                <ul className="space-y-2">
                  {current.clashes.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700 leading-snug">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stale */}
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
                  Outdated Cycle Alert
                </p>
                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">{current.stale}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <Link
                href={
                  active === "scholarship"
                    ? "/demo-scholarship"
                    : active === "visa"
                    ? "/demo-visa"
                    : "/app"
                }
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
              >
                <span>
                  {active === "scholarship"
                    ? "Open Scholarship Demo Audit"
                    : active === "visa"
                    ? "Open Nomad Visa Demo Audit"
                    : "Check your own grant in the workspace"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
