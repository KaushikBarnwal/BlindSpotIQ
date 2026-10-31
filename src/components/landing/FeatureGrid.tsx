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
    title: "Decision Criteria Gap Matrix",
    desc:
      "An AI cannot detect what is missing unless it understands what a complete answer looks like. BlindspotIQ dynamically generates an expected decision schema per domain — then audits every source against it, surfacing exact missing requirements.",
  },
  {
    num: "02",
    icon: Scale,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    title: "Official Source Conflict Resolution",
    desc:
      "When sources disagree on numbers or deadlines, simple majority vote is wrong. BlindspotIQ assigns institutional trust weights (.gov = 95%, .edu = 80%, blogs = 35%) and resolves contradictions in favor of the official source — clearly explained.",
  },
  {
    num: "03",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    title: "Cycle & Freshness Guardian",
    desc:
      "A circular from the 2024 application cycle looks identical to a 2026 notice. BlindspotIQ detects cycle references, flags stale content, and warns you when a guide references an outdated statutory window before it derails your application.",
  },
  {
    num: "04",
    icon: ListChecks,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    title: "Actionable Next Steps Checklist",
    desc:
      "Gaps and clashes become a prioritized, interactive checklist. Every item includes a targeted official search query, a pre-filled inquiry email draft, and a direct link to the verified application portal.",
  },
];

export function FeatureGrid() {
  return (
    <section className="py-20 sm:py-28 bg-white" id="features">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-600 mb-2.5">
            Core Architecture
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
            Four engines working in concert
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 leading-relaxed">
            Detecting what is missing requires more than keyword search. BlindspotIQ combines four
            complementary reasoning engines to give you a complete picture of uncertainty.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILLARS.map(({ num, icon: Icon, color, bg, border, title, desc }) => (
            <div
              key={num}
              className={`group p-6 sm:p-7 rounded-2xl border ${border} bg-white hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className={`shrink-0 w-12 h-12 rounded-xl ${bg} ${border} border flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-black ${color} font-mono tracking-widest`}>
                      ENGINE {num}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950">{title}</h3>
                  <p className="text-sm sm:text-base text-zinc-600 leading-relaxed pt-1">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
