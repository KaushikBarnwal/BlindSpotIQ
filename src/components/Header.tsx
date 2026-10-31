"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowLeft,
  BookOpen,
  Compass,
  ExternalLink,
  Sparkles,
  Layers,
} from "lucide-react";

interface HeaderProps {
  onLoadScholarshipSample: () => void;
  onLoadVisaSample: () => void;
  activeScenarioId?: string;
}

export function Header({
  onLoadScholarshipSample,
  onLoadVisaSample,
  activeScenarioId,
}: HeaderProps) {
  return (
    <header className="border-b border-zinc-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Home Navigation & Branding */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
            title="Return to Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Landing</span>
          </Link>

          <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-zinc-950">
                  Blindspot<span className="text-indigo-600">IQ</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-full uppercase tracking-wider">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Platform</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Scenario Switcher Navbar Component */}
        <div className="flex items-center bg-zinc-100/80 border border-zinc-200/90 rounded-xl p-1 text-xs">
          <span className="text-[11px] font-medium text-zinc-400 px-2 hidden lg:inline">
            Load Pre-curated Test Case:
          </span>
          <button
            onClick={onLoadScholarshipSample}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              activeScenarioId === "scenario-scholarship-2026"
                ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/80"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Scholarship Grant</span>
          </button>

          <button
            onClick={onLoadVisaSample}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              activeScenarioId === "scenario-visa-2026"
                ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/80"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-violet-600" />
            <span>Nomad Visa</span>
          </button>
        </div>

        {/* Right: Live Status & External Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Engine Ready</span>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>
    </header>
  );
}
