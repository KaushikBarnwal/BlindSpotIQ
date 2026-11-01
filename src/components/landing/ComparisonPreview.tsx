"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, CalendarX } from "lucide-react";

const STANDARD_AI = {
  label: "Standard AI Search",
  tag: "Generic Summarizer",
  tagColor: "bg-zinc-100 text-zinc-600 border-zinc-200",
  headerBg: "bg-zinc-50",
  content: (
    <div className="space-y-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
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
      <div className="mt-4 p-3.5 bg-zinc-100 rounded-xl text-xs sm:text-sm text-zinc-500 italic">
        &ldquo;A summary of gathered content from 3 sources.&rdquo; — No hidden gaps or missing renewal clauses flagged.
      </div>
    </div>
  ),
};

const BLINDSPOTIQ = {
  label: "BlindspotIQ Analysis",
  tag: "Deep Verification",
  tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  headerBg: "bg-white",
  content: (
    <div className="space-y-3.5">
      {/* Confirmed fact */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <span className="font-bold text-emerald-900">Award Amount Confirmed: </span>
          <span className="text-emerald-800">$10,000/year — verified across official sources.</span>
        </div>
      </div>

      {/* Dark spot */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200/80">
        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <span className="font-bold text-rose-950">Missing Requirement: </span>
          <span className="text-rose-800">
            None of the 3 websites mention renewal GPA requirements. Without this, students risk losing funding after year one.
          </span>
        </div>
      </div>

      {/* Contradiction */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <span className="font-bold text-amber-950">Conflicting Rules: </span>
          <span className="text-amber-800">
            Official foundation requires 2 letters. Blog claims 1 letter is enough. Official portal takes priority.
          </span>
        </div>
      </div>

      {/* Stale */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-100 border border-zinc-200/80">
        <CalendarX className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <span className="font-bold text-zinc-900">Outdated Rule Warning: </span>
          <span className="text-zinc-700">
            Student blog cites an expired October 2024 deadline. Official deadline is November 15, 2026.
          </span>
        </div>
      </div>
    </div>
  ),
};

export function ComparisonPreview() {
  const [active, setActive] = useState<"standard" | "blindspot">("blindspot");

  return (
    <section className="py-20 sm:py-28 bg-zinc-50/70 border-y border-zinc-200/60" id="comparison">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Label */}
        <div className="text-center mb-10">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-600 mb-2.5">
            See the difference
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight">
            Basic AI Summary vs BlindspotIQ
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto">
            See what happens when the same 3 websites are fed into standard AI vs BlindspotIQ.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-zinc-100 border border-zinc-200 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActive("standard")}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                active === "standard"
                  ? "bg-white shadow-sm text-zinc-950 border border-zinc-200"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Standard AI
            </button>
            <button
              onClick={() => setActive("blindspot")}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                active === "blindspot"
                  ? "bg-white shadow-sm text-indigo-700 border border-indigo-200"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              BlindspotIQ
            </button>
          </div>
        </div>

        {/* Preview card */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden max-w-3xl mx-auto">
          {/* Card header */}
          <div
            className={`px-6 py-4 border-b border-zinc-200/80 flex items-center justify-between ${
              active === "blindspot" ? "bg-indigo-50/60" : "bg-zinc-50"
            }`}
          >
            <span className="text-base font-bold text-zinc-900">
              {active === "standard" ? STANDARD_AI.label : BLINDSPOTIQ.label}
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${
                active === "standard" ? STANDARD_AI.tagColor : BLINDSPOTIQ.tagColor
              }`}
            >
              {active === "standard" ? STANDARD_AI.tag : BLINDSPOTIQ.tag}
            </span>
          </div>

          {/* Card body */}
          <div className="p-6">
            {active === "standard" ? STANDARD_AI.content : BLINDSPOTIQ.content}
          </div>

          {/* Card footer */}
          {active === "blindspot" && (
            <div className="px-6 pb-5 pt-1 border-t border-zinc-100">
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Verified by primary source
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Missing Condition Signal
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Factual Contradiction
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
