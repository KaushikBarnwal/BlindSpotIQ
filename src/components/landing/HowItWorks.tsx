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
    desc: "Paste URLs, upload PDFs, or directly type source notices. BlindspotIQ accepts HTML pages, government PDFs, and raw circular text — with authority tier assignment built in.",
  },
  {
    num: "02",
    icon: Grid3x3,
    color: "text-violet-600",
    ring: "ring-violet-100",
    bg: "bg-violet-50",
    title: "Map",
    desc: "The AI detects the decision domain (scholarship, visa, grant) and generates a complete expected schema — then scans all sources against every dimension to reveal coverage gaps.",
  },
  {
    num: "03",
    icon: Scale,
    color: "text-amber-600",
    ring: "ring-amber-100",
    bg: "bg-amber-50",
    title: "Resolve",
    desc: "Contradictory claims are surfaced side-by-side with exact source quotes. Authority trust weights resolve conflicts toward the highest-credibility source — transparently explained.",
  },
  {
    num: "04",
    icon: CheckSquare,
    color: "text-emerald-600",
    ring: "ring-emerald-100",
    bg: "bg-emerald-50",
    title: "Act",
    desc: "Every gap and clash becomes an actionable checklist item with a search shortcut targeting official domains, a pre-written inquiry email, and a link to the verified portal.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-24 bg-white" id="how-it-works">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-xl mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
            Workflow
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            From raw sources to verified clarity in 4 steps
          </h2>
          <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
            A linear, transparent pipeline — every step is visible and auditable so judges and users always know exactly what the AI did and why.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden sm:block absolute top-5 left-[22px] right-[22px] h-px bg-gradient-to-r from-indigo-200 via-violet-200 via-amber-200 to-emerald-200" />

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {STEPS.map(({ num, icon: Icon, color, ring, bg, title, desc }) => (
              <div key={num} className="relative flex flex-col items-start sm:items-center sm:text-center">
                {/* Icon circle */}
                <div className={`w-11 h-11 rounded-full ${bg} ring-4 ${ring} flex items-center justify-center mb-4 shrink-0 z-10`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>

                <div>
                  <div className={`text-[10px] font-black font-mono ${color} mb-0.5 tracking-widest`}>
                    STEP {num}
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 mb-1.5">{title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
