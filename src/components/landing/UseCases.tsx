"use client";

import React, { useState } from "react";
import { BookOpen, Plane, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

const CASES = [
  {
    id: "scholarship",
    icon: BookOpen,
    label: "Academic Scholarships",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    activeBorder: "border-indigo-300",
    scenario: "A student applying for the Global STEM Excellence Scholarship notices eligibility details across 3 sites but nothing about renewal conditions, income limits, or disqualification triggers.",
    gaps: ["Renewal GPA requirement not mentioned in any source", "Appeal process completely absent from all 3 sources", "Disbursement schedule conflicts: annual vs. bi-term"],
    clashes: ["Required letters: 2 (official) vs 1 (blog)", "Deadline: Nov 15 2026 (official) vs Oct 1 2024 (stale guide)"],
    stale: "ScholarshipInsider guide references the 2024 application cycle.",
  },
  {
    id: "visa",
    icon: Plane,
    label: "Immigration & Visas",
    color: "text-violet-600",
    bg: "bg-violet-50",
    activeBorder: "border-violet-300",
    scenario: "A freelancer researching a Digital Nomad Visa finds income thresholds, insurance requirements, and permitted work types spread inconsistently across government portals and expat blogs.",
    gaps: ["Health insurance minimum coverage amount unclear", "Tax treaty exemption conditions absent across sources", "Dependent inclusion rules not addressed"],
    clashes: ["Monthly income floor: €2,000 (official) vs €2,500 (forum)", "Processing time: 4 weeks (gov.pt) vs 12 weeks (blog)"],
    stale: "One forum post references pre-2024 visa regulations.",
  },
  {
    id: "grant",
    icon: Building2,
    label: "Public Grants & Policy",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    activeBorder: "border-emerald-300",
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
    <section className="py-20 sm:py-24 bg-zinc-50/70 border-y border-zinc-200/60" id="use-cases">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-xl mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
            Real-World Scenarios
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            High-stakes decisions need zero blind spots
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            One missing detail — a renewal clause, a changed income threshold, an outdated portal — can void months of work.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <div className="flex lg:flex-col gap-2 lg:w-52 shrink-0">
            {CASES.map(({ id, icon: TabIcon, label, color, bg, activeBorder }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                  active === id
                    ? `bg-white shadow-sm ${activeBorder} ${color}`
                    : "bg-white border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${active === id ? bg : "bg-zinc-100"} shrink-0`}>
                  <TabIcon className={`w-3.5 h-3.5 ${active === id ? color : "text-zinc-400"}`} />
                </div>
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="flex-1 bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            {/* Scenario description */}
            <div className="flex items-start gap-3 pb-4 border-b border-zinc-100 mb-4">
              <div className={`w-9 h-9 rounded-xl ${current.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${current.color}`} />
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {current.scenario}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Dark Spots */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2">
                  Dark Spots ({current.gaps.length})
                </p>
                <ul className="space-y-1.5">
                  {current.gaps.map((g, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-600">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clashes */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">
                  Clashes ({current.clashes.length})
                </p>
                <ul className="space-y-1.5">
                  {current.clashes.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-600">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stale */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Stale Content
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed">{current.stale}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-100">
              <Link
                href="/app"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Run this scenario in the platform
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
