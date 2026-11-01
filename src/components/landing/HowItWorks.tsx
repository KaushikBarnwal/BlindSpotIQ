"use client";

import React from "react";
import { Upload, Grid3x3, Scale, CheckSquare } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: Upload,
    color: "text-emerald-600",
    ring: "ring-emerald-100",
    bg: "bg-emerald-50",
    title: "1. Add Sources",
    desc: "Search the web automatically with AI, paste website links, or paste document excerpts directly from official notices.",
  },
  {
    num: "02",
    icon: Grid3x3,
    color: "text-teal-600",
    ring: "ring-teal-100",
    bg: "bg-teal-50",
    title: "2. Spot Omissions",
    desc: "BlindspotIQ identifies your category (scholarship, visa, or grant) and compares your sources against what a complete application requires.",
  },
  {
    num: "03",
    icon: Scale,
    color: "text-amber-600",
    ring: "ring-amber-100",
    bg: "bg-amber-50",
    title: "3. Catch Conflicts",
    desc: "Contradictory claims are placed side-by-side with exact quotes. Official notices always override secondary blogs and forums.",
  },
  {
    num: "04",
    icon: CheckSquare,
    color: "text-zinc-900",
    ring: "ring-zinc-100",
    bg: "bg-zinc-100",
    title: "4. Follow Checklist",
    desc: "Get an actionable checklist with Google search shortcuts and pre-written emails to contact the institution directly.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-white" id="how-it-works">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-800 mb-2.5 font-mono">
            Simple 4-Step Process
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight font-heading">
            From confusing sources to clear answers in 4 steps
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 leading-relaxed">
            A transparent verification process where every check is backed by direct quotes so you always know why a rule was flagged.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden sm:block absolute top-6 left-[28px] right-[28px] h-0.5 bg-gradient-to-r from-emerald-200 via-teal-200 via-amber-200 to-zinc-300" />

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {STEPS.map(({ num, icon: Icon, color, ring, bg, title, desc }) => (
              <div key={num} className="relative flex flex-col items-start sm:items-center sm:text-center">
                {/* Icon circle */}
                <div className={`w-12 h-12 rounded-full ${bg} ring-4 ${ring} flex items-center justify-center mb-4 shrink-0 z-10 shadow-xs`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>

                <div className="space-y-1.5">
                  <div className={`text-xs font-black font-mono ${color} tracking-widest`}>
                    STEP {num}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-950">{title}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed pt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
