"use client";

import React from "react";
import { Contradiction } from "@/types";
import { AlertCircle, ArrowRightLeft, ShieldAlert, CheckCircle } from "lucide-react";

interface ContradictionViewerProps {
  contradictions: Contradiction[];
}

export function ContradictionViewer({ contradictions }: ContradictionViewerProps) {
  if (!contradictions || contradictions.length === 0) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 text-center text-zinc-400">
        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
        <h4 className="font-semibold text-zinc-200">No Direct Fact Clashes Found</h4>
        <p className="text-xs text-zinc-500 mt-1">
          The analyzed sources are aligned on reported facts, or differences are minor.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100">
              Cross-Source Contradiction Engine
            </h3>
            <p className="text-xs text-zinc-400">
              Detected conflicting statements across evaluated publishers with side-by-side evidence quotes.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {contradictions.length} Active Conflict{contradictions.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-4">
        {contradictions.map((conflict) => (
          <div
            key={conflict.id}
            className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  Dimension:
                </span>
                <span className="text-sm font-extrabold text-white">
                  {conflict.dimensionName}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  conflict.severity === "high"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {conflict.severity} Severity Clash
              </span>
            </div>

            {/* Side-by-side claim comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Claim A */}
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-semibold text-rose-400">Source A</span>
                  <span className="font-medium text-zinc-300 truncate max-w-[200px]">
                    {conflict.claimA.sourceTitle}
                  </span>
                </div>
                <p className="text-xs font-semibold text-zinc-200">
                  {conflict.claimA.statement}
                </p>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 font-mono text-[11px] text-zinc-300">
                  &ldquo;{conflict.claimA.quote}&rdquo;
                </div>
              </div>

              {/* Claim B */}
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-semibold text-amber-400">Source B</span>
                  <span className="font-medium text-zinc-300 truncate max-w-[200px]">
                    {conflict.claimB.sourceTitle}
                  </span>
                </div>
                <p className="text-xs font-semibold text-zinc-200">
                  {conflict.claimB.statement}
                </p>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 font-mono text-[11px] text-zinc-300">
                  &ldquo;{conflict.claimB.quote}&rdquo;
                </div>
              </div>
            </div>

            {/* Real world impact & recommendation */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">Why this matters: </span>
                  <span className="text-zinc-300">{conflict.whyItMatters}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-amber-500/20">
                <span className="font-bold text-emerald-400 shrink-0">Safe Resolution:</span>
                <span className="text-zinc-300">{conflict.recommendation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

