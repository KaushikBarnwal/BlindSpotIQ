"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden bg-white">
      {/* Minimal grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #f4f4f5 1px, transparent 1px), linear-gradient(to bottom, #f4f4f5 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Soft radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-50/80 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Beyond Summarization · Gap Detection Engine</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 leading-[1.08] mb-5">
          Stop guessing
          <br />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500 bg-clip-text text-transparent">
            what the web left out.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed mb-8">
          Most AI tools summarize what is already there. BlindspotIQ scans multiple
          sources to surface what is <strong className="text-zinc-700 font-semibold">missing</strong>,{" "}
          <strong className="text-zinc-700 font-semibold">outdated</strong>, or{" "}
          <strong className="text-zinc-700 font-semibold">contradictory</strong> — before you
          submit a high-stakes application.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            Analyze a Decision Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-sm border border-zinc-200 hover:border-zinc-300 shadow-sm transition-all"
          >
            View Live Scholarship Demo
          </Link>
        </div>

        {/* Trust line */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400 font-medium">
          {["Scholarships", "Immigration Visas", "Public Grants", "Statutory Policies"].map((tag) => (
            <span key={tag} className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
