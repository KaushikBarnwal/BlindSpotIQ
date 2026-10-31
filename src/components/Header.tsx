"use client";

import React from "react";
import { ShieldAlert, Compass, Sparkles, BookOpen, ExternalLink } from "lucide-react";

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
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-950/40 border border-amber-400/30">
            <ShieldAlert className="w-5 h-5 text-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Blindspot<span className="text-rose-500">IQ</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full tracking-wide uppercase">
                Dark Spot Engine
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              AI-assisted multi-source information gap & conflict detection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
            <span className="text-zinc-500 px-2 font-medium hidden md:inline">
              Pre-curated Test Scenarios:
            </span>
            <button
              onClick={onLoadScholarshipSample}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                activeScenarioId === "scenario-scholarship-2026"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Scholarship Grant</span>
            </button>
            <button
              onClick={onLoadVisaSample}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                activeScenarioId === "scenario-visa-2026"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Nomad Visa</span>
            </button>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 px-3 py-2 border border-zinc-800 rounded-lg hover:border-zinc-700 transition"
          >
            <span>Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
}

