"use client";

import React from "react";
import { Grid3x3, Scale, Clock, ListChecks } from "lucide-react";

const PILLARS = [
  {
    num: "01",
    icon: Grid3x3,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    title: "Schema-Driven Dark Spot Matrix",
    desc:
      "An AI cannot detect what is missing unless it understands what a complete answer looks like. BlindspotIQ dynamically generates an expected decision schema per domain — then audits every source against it, surfacing exact gaps per dimension.",
  },
  {
    num: "02",
    icon: Scale,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    title: "Authority-Weighted Conflict Resolution",
    desc:
      "When two sources disagree, a simple majority vote is wrong. BlindspotIQ assigns institutional trust weights (.gov = 95%, .edu = 80%, blogs = 35%) and resolves contradictions in favor of the most authoritative claim — clearly explained.",
  },
  {
    num: "03",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    title: "Temporal Freshness Guardian",
    desc:
      "A circular from the 2024 application cycle looks identical to a 2026 notice. BlindspotIQ detects cycle references, flags stale content, and warns you when a source references an outdated statutory window — before it derails your application.",
  },
  {
    num: "04",
    icon: ListChecks,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    title: "Actionable Verification Loop",
    desc:
      "Gaps and clashes become a prioritized, interactive checklist. Every item includes a one-click Google Scholar query targeting official domains, a pre-filled authority inquiry email draft, and a direct link to the verified statutory portal.",
  },
];

export function FeatureGrid() {
  return (
    <section className="py-20 sm:py-24 bg-white" id="features">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-xl mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
            Core Architecture
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            Four engines working in concert
          </h2>
          <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
            Detecting what is missing requires more than keyword search. BlindspotIQ combines four
            complementary reasoning engines to give you a complete picture of uncertainty.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PILLARS.map(({ num, icon: Icon, color, bg, border, title, desc }) => (
            <div
              key={num}
              className={`group p-5 rounded-2xl border ${border} bg-white hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-10 h-10 rounded-xl ${bg} ${border} border flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-black ${color} font-mono tracking-widest`}>
                      {num}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
