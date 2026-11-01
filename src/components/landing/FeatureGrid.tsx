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
    title: "Finds What Websites Left Out",
    desc:
      "An AI cannot detect missing rules unless it knows what a complete application requires. BlindspotIQ knows the standard checklist for your category (scholarships, visas, grants) and flags every unstated requirement.",
  },
  {
    num: "02",
    icon: Scale,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    title: "Resolves Conflicting Rules",
    desc:
      "When sources disagree on amounts or dates, standard search gets confused. BlindspotIQ ranks verified government (.gov) and university (.edu) sites above student blogs and forums, clearly explaining which rule to follow.",
  },
  {
    num: "03",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    title: "Flags Expired Dates & Rules",
    desc:
      "A blog article from 2024 can look identical to a 2026 update. BlindspotIQ checks dates across the web and warns you when a guide quotes an old deadline or an outdated form.",
  },
  {
    num: "04",
    icon: ListChecks,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    title: "Clear Next-Steps Checklist",
    desc:
      "Every missing requirement and conflict turns into an actionable checklist with one-click Google search shortcuts, ready-to-send draft inquiry emails, and direct links to official portals.",
  },
];

export function FeatureGrid() {
  return (
    <section className="py-20 sm:py-28 bg-white" id="features">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-600 mb-2.5">
            How It Protects You
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
            Four ways BlindspotIQ protects your application
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 leading-relaxed">
            Finding what official websites left out takes more than standard keyword search. Here is how BlindspotIQ double-checks every rule before you submit:
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
