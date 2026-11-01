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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-50/70 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold mb-6 tracking-wide uppercase shadow-2xs font-mono">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Catch What Others Miss · Find Hidden Omissions &amp; Conflicts</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-950 leading-[1.08] mb-6 font-heading">
          Stop guessing
          <br />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
            what the web left out.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-zinc-600 max-w-3xl mx-auto leading-relaxed mb-10">
          Most AI tools summarize what is already there. BlindspotIQ scans multiple
          sources to surface what is <strong className="text-zinc-950 font-bold">missing</strong>,{" "}
          <strong className="text-zinc-950 font-bold">outdated</strong>, or{" "}
          <strong className="text-zinc-950 font-bold">contradictory</strong> — before you
          submit an important application.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <Link
            href="/app"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-base shadow-md hover:shadow-lg transition-all"
          >
            <span>Check an Application Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/demo-scholarship"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-base border border-zinc-200 hover:border-zinc-300 shadow-sm transition-all"
          >
            <span>Try Scholarship Demo</span>
          </Link>
        </div>

        {/* Trust line */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500 font-semibold font-mono">
          {["Scholarships", "Immigration Visas", "Student Grants", "Government Policies"].map((tag) => (
            <span key={tag} className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
