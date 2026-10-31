"use client";

import React from "react";
import { Contradiction, AuthorityTier } from "@/types";
import {
  ArrowRightLeft,
  ShieldAlert,
  CheckCircle,
  Scale,
  Award,
  Quote,
  Sparkles,
} from "lucide-react";

interface ContradictionViewerProps {
  contradictions: Contradiction[];
}

export function ContradictionViewer({
  contradictions,
}: ContradictionViewerProps) {
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

  const renderAuthorityBadge = (tier: AuthorityTier, weight: number) => {
    switch (tier) {
      case "primary_official":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Award className="w-3 h-3 text-emerald-400" />
            <span>Primary Authority ({weight}%)</span>
          </span>
        );
      case "secondary_aggregator":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
            <span>Secondary Registry ({weight}%)</span>
          </span>
        );
      case "third_party_unverified":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
            <span>Third-Party Guide ({weight}%)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <span>Cross-Source Contradiction Engine</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Authority-Weighted
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Evaluates conflicting claims using institutional domain trust weights rather than naive text matching.
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
                  Contested Dimension:
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

            {/* Side-by-side claim comparison with Authority Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Claim A */}
              <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-400">
                    Source A
                  </span>
                  {renderAuthorityBadge(
                    conflict.claimA.authorityTier,
                    conflict.claimA.authorityWeight
                  )}
                </div>
                <div className="text-xs font-semibold text-zinc-200">
                  {conflict.claimA.sourceTitle}
                </div>
                <p className="text-xs text-zinc-300">
                  {conflict.claimA.statement}
                </p>

                {/* Direct Quoted Snippet: Monospace, Gray Background, Quoted */}
                <div className="bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-lg text-xs font-mono text-zinc-300 flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  <span className="italic leading-relaxed">
                    &ldquo;{conflict.claimA.quote}&rdquo;
                  </span>
                </div>
              </div>

              {/* Claim B */}
              <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-400">
                    Source B
                  </span>
                  {renderAuthorityBadge(
                    conflict.claimB.authorityTier,
                    conflict.claimB.authorityWeight
                  )}
                </div>
                <div className="text-xs font-semibold text-zinc-200">
                  {conflict.claimB.sourceTitle}
                </div>
                <p className="text-xs text-zinc-300">
                  {conflict.claimB.statement}
                </p>

                {/* Direct Quoted Snippet */}
                <div className="bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-lg text-xs font-mono text-zinc-300 flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  <span className="italic leading-relaxed">
                    &ldquo;{conflict.claimB.quote}&rdquo;
                  </span>
                </div>
              </div>
            </div>

            {/* AI Source Authority Resolution Verdict */}
            <div className="bg-zinc-950 border border-indigo-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Authority Resolution Signal:
                </span>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {conflict.authorityVerdict?.rationale || conflict.recommendation}
              </p>
            </div>

            {/* Why it matters & Practical resolution */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">Why this matters: </span>
                  <span className="text-zinc-300">{conflict.whyItMatters}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-amber-500/20">
                <span className="font-bold text-emerald-400 shrink-0">
                  Safe Resolution:
                </span>
                <span className="text-zinc-300">{conflict.recommendation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
