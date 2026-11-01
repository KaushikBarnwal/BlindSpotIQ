"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-24 sm:py-32 bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-400 mb-3.5 font-mono">
          Free Verification
        </p>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-5 font-heading">
          Double-check before you apply.
        </h2>
        <p className="text-lg sm:text-xl text-zinc-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Cross-examine multiple official websites in seconds. Catch missing conditions, conflicting requirements, and outdated rules before you submit.
        </p>
        <Link
          href="/app"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-base shadow-sm hover:shadow-md transition-all font-heading"
        >
          <span>Open Research Workspace</span>
          <ArrowRight className="w-5 h-5" />
        </Link>

        {/* Metric tags */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400 font-medium font-mono">
          {[
            "100% Verifiable Source Quotes",
            "Official Source Priority",
            "Dual AI Cross-Checking",
            "Free Open Research",
          ].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
