"use client";

import React from "react";
import { Contradiction, AuthorityTier, ConflictType } from "@/types";
import {
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
      <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center text-zinc-500 shadow-xs">
        <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
        <h4 className="font-bold text-zinc-900 text-base">No Direct Contradictions Found</h4>
        <p className="text-sm text-zinc-500 mt-1">
          The analyzed sources are aligned on reported facts, or differences are minor.
        </p>
      </div>
    );
  }

  const renderAuthorityBadge = (tier: AuthorityTier) => {
    switch (tier) {
      case "primary_official":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Portal</span>
          </span>
        );
      case "secondary_aggregator":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
            <span>Secondary Registry</span>
          </span>
        );
      case "third_party_unverified":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
            <span>Community Guide</span>
          </span>
        );
    }
  };

  const renderConflictTypeBadge = (type?: ConflictType) => {
    switch (type) {
      case "document_list_conflict":
        return (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            Document Mismatch
          </span>
        );
      case "numerical_clash":
        return (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
            Conflicting Numbers
          </span>
        );
      case "cycle_mismatch":
        return (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200">
            Cycle Mismatch
          </span>
        );
      case "scope_difference":
        return (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-mono">
            Scope Difference
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-950 flex items-center gap-2">
              <span>Conflicting Information Between Sources</span>
              <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                Cross-Checked
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Where official portals, community guides, and registries disagree on requirements or figures.
            </p>
          </div>
        </div>
        <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          {contradictions.length} Active Conflict{contradictions.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-4">
        {contradictions.map((conflict) => (
          <div
            key={conflict.id}
            className="bg-white border border-amber-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-bold text-amber-700 tracking-wide">
                  Disputed Requirement:
                </span>
                <span className="text-base sm:text-lg font-black text-zinc-950">
                  {conflict.dimensionName}
                </span>
                {renderConflictTypeBadge(conflict.conflictType)}
              </div>
              <span
                className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  conflict.severity === "high"
                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}
              >
                {conflict.severity === "high"
                  ? "High Impact"
                  : conflict.severity === "medium"
                  ? "Medium Impact"
                  : "Low Impact"}
              </span>
            </div>

            {/* Side-by-side claim comparison with Authority Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Claim A */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase text-zinc-600 tracking-wider">
                    Source A
                  </span>
                  {renderAuthorityBadge(conflict.claimA.authorityTier)}
                </div>
                <div className="text-sm font-bold text-zinc-950">
                  {conflict.claimA.sourceTitle}
                </div>
                <p className="text-sm text-zinc-800 leading-relaxed">
                  {conflict.claimA.statement}
                </p>

                {/* Direct Quoted Snippet: Monospace, Gray Background, Quoted */}
                <div className="bg-white border border-zinc-200 p-3 rounded-lg text-xs sm:text-sm font-mono text-zinc-800 flex items-start gap-2 shadow-2xs">
                  <Quote className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span className="italic leading-relaxed">
                    &ldquo;{conflict.claimA.quote}&rdquo;
                  </span>
                </div>
              </div>

              {/* Claim B */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase text-zinc-600 tracking-wider">
                    Source B
                  </span>
                  {renderAuthorityBadge(conflict.claimB.authorityTier)}
                </div>
                <div className="text-sm font-bold text-zinc-950">
                  {conflict.claimB.sourceTitle}
                </div>
                <p className="text-sm text-zinc-800 leading-relaxed">
                  {conflict.claimB.statement}
                </p>

                {/* Direct Quoted Snippet */}
                <div className="bg-white border border-zinc-200 p-3 rounded-lg text-xs sm:text-sm font-mono text-zinc-800 flex items-start gap-2 shadow-2xs">
                  <Quote className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span className="italic leading-relaxed">
                    &ldquo;{conflict.claimB.quote}&rdquo;
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Verdict */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 font-heading">
                  Recommended Verdict:
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                {conflict.authorityVerdict?.rationale || conflict.recommendation}
              </p>
            </div>

            {/* Why it matters & Practical resolution */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900">Why this matters: </span>
                  <span className="text-zinc-700">{conflict.whyItMatters}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 pt-2 border-t border-amber-200/60">
                <span className="font-bold text-emerald-800 shrink-0">
                  What you should do:
                </span>
                <span className="text-zinc-800 font-medium">{conflict.recommendation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
