"use client";

import React from "react";
import { Upload, Grid3x3, Scale, CheckSquare } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: Upload,
    color: "text-indigo-600",
    ring: "ring-indigo-100",
    bg: "bg-indigo-50",
    title: "Ingest",
    desc: "Auto-search with Tavily AI, paste URLs, or directly paste notice text. BlindspotIQ parses HTML pages and government PDFs with authority tier assignment built in.",
  },
  {
    num: "02",
    icon: Grid3x3,
    color: "text-violet-600",
    ring: "ring-violet-100",
    bg: "bg-violet-50",
    title: "Map",
    desc: "The AI detects the decision domain (scholarship, visa, grant) and generates a complete expected schema — then scans all sources to reveal coverage gaps.",
  },
  {
    num: "03",
    icon: Scale,
    color: "text-amber-600",
    ring: "ring-amber-100",
    bg: "bg-amber-50",
    title: "Resolve",
    desc: "Contradictory claims are surfaced side-by-side with exact source quotes. Official portal trust weights resolve conflicts toward the highest-credibility source.",
  },
  {
    num: "04",
    icon: CheckSquare,
    color: "text-emerald-600",
    ring: "ring-emerald-100",
    bg: "bg-emerald-50",
    title: "Act",
    desc: "Every gap and clash becomes an actionable checklist item with an official search query shortcut, a pre-written inquiry email, and a direct portal link.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-white" id="how-it-works">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-600 mb-2.5">
            Workflow
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight">
            From raw sources to verified clarity in 4 steps
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 leading-relaxed">
            A linear, transparent pipeline — every step is visible and auditable so judges and users always know exactly what the AI did and why.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden sm:block absolute top-6 left-[28px] right-[28px] h-0.5 bg-gradient-to-r from-indigo-200 via-violet-200 via-amber-200 to-emerald-200" />

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
