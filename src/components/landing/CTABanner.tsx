"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-20 sm:py-24 bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">
          Start Analyzing
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Verify before you submit.
        </h2>
        <p className="text-base text-zinc-400 mb-8 max-w-lg mx-auto leading-relaxed">
          Test your high-stakes decision against multiple sources in seconds.
          Surface what is missing, what conflicts, and what you should do next.
        </p>
        <Link
          href="/app"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm shadow-sm hover:shadow-md transition-all"
        >
          Launch BlindspotIQ Platform
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Metric tags */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-600">
          {[
            "0% Hallucination Vagueness",
            "Schema-Driven Detection",
            "Authority-Weighted Resolution",
            "No Paywall",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

