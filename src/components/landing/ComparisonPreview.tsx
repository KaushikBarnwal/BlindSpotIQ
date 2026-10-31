"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, CalendarX, ArrowRight } from "lucide-react";

const STANDARD_AI = {
  label: "Standard AI Search",
  tag: "Generic Summarizer",
  tagColor: "bg-zinc-100 text-zinc-500 border-zinc-200",
  headerBg: "bg-zinc-50",
  content: (
    <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
      <p>
        The Global STEM Excellence Scholarship is a merit-based award for undergraduate
        students in computing and engineering. Applicants should maintain a strong GPA
        and submit required documents by the deadline listed on the official website.
      </p>
      <p>
        The scholarship offers financial support for the academic year. Applicants are
        encouraged to review the program guidelines carefully and contact the foundation
        for any clarifications regarding eligibility or application materials.
      </p>
      <div className="mt-4 p-3 bg-zinc-100 rounded-lg text-xs text-zinc-500 italic">
        "A summary of gathered content from 3 sources." — No gaps flagged.
      </div>
    </div>
  ),
};

const BLINDSPOTIQ = {
  label: "BlindspotIQ Analysis",
  tag: "Gap Detection Engine",
  tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  headerBg: "bg-white",
  content: (
    <div className="space-y-3">
      {/* Confirmed fact */}
      <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/80">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-emerald-800">Award Amount Confirmed: </span>
          <span className="text-emerald-700">$10,000/year — verified across 2 primary sources.</span>
        </div>
      </div>

      {/* Dark spot */}
      <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-rose-50 border border-rose-200/80">
        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-rose-800">Dark Spot — Renewal Criteria: </span>
          <span className="text-rose-700">
            0 of 3 sources mention renewal requirements. Skipping this could result in award cancellation after Year 1.
          </span>
        </div>
      </div>

      {/* Contradiction */}
      <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200/80">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-amber-800">Clash — Recommendation Letters: </span>
          <span className="text-amber-700">
            Source A (Official, 95% trust) requires 2 letters. Source B (Blog, 35% trust) states 1 letter. Trust Primary Source.
          </span>
        </div>
      </div>

      {/* Stale */}
      <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-zinc-100 border border-zinc-200/80">
        <CalendarX className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-zinc-700">Stale Source Detected: </span>
          <span className="text-zinc-600">
            ScholarshipInsider.net references a 2024 cycle deadline (Oct 1, 2024). Current cycle is 2026–2027.
          </span>
        </div>
      </div>
    </div>
  ),
};

export function ComparisonPreview() {
  const [active, setActive] = useState<"standard" | "blindspot">("blindspot");

  return (
    <section className="py-20 sm:py-24 bg-zinc-50/70 border-y border-zinc-200/60" id="comparison">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Label */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
            See the difference
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            Summarization vs Gap Detection
          </h2>
          <p className="mt-2 text-sm text-zinc-500 max-w-xl mx-auto">
            The same 3 scholarship sources fed into a generic AI vs BlindspotIQ.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-7">
          <div className="inline-flex items-center bg-zinc-100 border border-zinc-200 rounded-xl p-1">
            <button
              onClick={() => setActive("standard")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                active === "standard"
                  ? "bg-white shadow-sm text-zinc-950 border border-zinc-200"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Standard AI
            </button>
            <button
              onClick={() => setActive("blindspot")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                active === "blindspot"
                  ? "bg-white shadow-sm text-indigo-700 border border-indigo-200"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              BlindspotIQ
            </button>
          </div>
        </div>

        {/* Preview card */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden max-w-2xl mx-auto">
          {/* Card header */}
          <div
            className={`px-5 py-3 border-b border-zinc-200/80 flex items-center justify-between ${
              active === "blindspot" ? "bg-indigo-50/60" : "bg-zinc-50"
            }`}
          >
            <span className="text-sm font-bold text-zinc-800">
              {active === "standard" ? STANDARD_AI.label : BLINDSPOTIQ.label}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${
                active === "standard" ? STANDARD_AI.tagColor : BLINDSPOTIQ.tagColor
              }`}
            >
              {active === "standard" ? STANDARD_AI.tag : BLINDSPOTIQ.tag}
            </span>
          </div>

          {/* Card body */}
          <div className="p-5">
            {active === "standard" ? STANDARD_AI.content : BLINDSPOTIQ.content}
          </div>

          {/* Card footer */}
          {active === "blindspot" && (
            <div className="px-5 pb-4">
              <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Verified by primary source
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  AI Gap Signal (not guaranteed)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Factual Clash
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

