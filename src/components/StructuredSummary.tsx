"use client";

import React, { useState } from "react";
import { ConfirmedFact, DarkSpotGap, GapType } from "@/types";
import {
  CheckCircle2,
  AlertOctagon,
  Quote,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface StructuredSummaryProps {
  confirmedFacts: ConfirmedFact[];
  gaps: DarkSpotGap[];
  officialApplicationUrl?: string;
  officialApplicationTitle?: string;
  topic: string;
}

export function StructuredSummary({
  confirmedFacts,
  gaps,
  topic,
}: StructuredSummaryProps) {
  const [expandedFactIdx, setExpandedFactIdx] = useState<number | null>(null);
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);

  const toggleFact = (idx: number) => {
    setExpandedFactIdx(expandedFactIdx === idx ? null : idx);
  };

  const renderGapTypeBadge = (type?: GapType) => {
    switch (type) {
      case "completely_omitted":
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
            Missing
          </span>
        );
      case "unspecified_conditions":
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
            Unclear Terms
          </span>
        );
      case "single_source_outlier":
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 border border-violet-200">
            Single Source
          </span>
        );
      case "scope_mismatch":
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
            Scope Mismatch
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Collapsible Toggle Header for Dual Panel */}
      <div className="flex items-center justify-between bg-zinc-100/80 border border-zinc-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-zinc-900">
            Summary Breakdown:
          </span>
          <span className="text-emerald-700 font-semibold">
            {confirmedFacts.length} Found
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-rose-600 font-semibold">
            {gaps.length} Dark Spots
          </span>
        </div>

        <button
          onClick={() => setIsSectionCollapsed(!isSectionCollapsed)}
          className="text-zinc-600 hover:text-zinc-950 flex items-center gap-1 font-bold text-xs sm:text-sm cursor-pointer"
        >
          <span>{isSectionCollapsed ? "Show Breakdown" : "Hide Breakdown"}</span>
          {isSectionCollapsed ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Side-by-Side Dual-Panel: Confirmed Facts vs Missing Dark Spots */}
      {!isSectionCollapsed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          {/* Panel A: What Was Found */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">
                    What Was Found
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Corroborated by official sources
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                {confirmedFacts.length} Items
              </span>
            </div>

            <div className="space-y-2.5">
              {confirmedFacts.map((fact, idx) => {
                const isExpanded = expandedFactIdx === idx;
                return (
                  <div
                    key={idx}
                    className="bg-zinc-50/80 border border-zinc-200/80 rounded-xl p-3.5 space-y-2 transition hover:border-zinc-300"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
                        {fact.dimensionName}
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">
                        {fact.sourceTitle}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-zinc-900 leading-snug">
                      {fact.fact}
                    </p>

                    {fact.verifiedQuote && (
                      <div>
                        <button
                          onClick={() => toggleFact(idx)}
                          className="text-xs text-zinc-500 hover:text-zinc-800 flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <Quote className="w-3 h-3 text-emerald-600" />
                          <span>{isExpanded ? "Hide quote" : "Show source quote"}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-2 p-2.5 bg-white border border-zinc-200 rounded-lg font-mono text-xs text-zinc-700 leading-relaxed italic">
                            &ldquo;{fact.verifiedQuote}&rdquo;
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel B: What Was Left Out (Dark Spots) */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200/60">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">
                    What Was Left Out (Dark Spots)
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Mandatory requirements missing across sources
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80">
                {gaps.length} Gaps
              </span>
            </div>

            <div className="space-y-2.5">
              {gaps.map((gap) => (
                <div
                  key={gap.id}
                  className="bg-rose-50/30 border border-rose-200/80 rounded-xl p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm font-bold text-rose-950">
                      {gap.dimensionName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {renderGapTypeBadge(gap.gapType)}
                      <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                        {gap.riskLevel} Risk
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-800 leading-relaxed">
                    {gap.description}
                  </p>

                  <div className="bg-white border border-zinc-200 p-2.5 rounded-lg text-xs space-y-1">
                    <div>
                      <span className="text-zinc-500 font-semibold">Risk: </span>
                      <span className="text-zinc-700">{gap.impactReason}</span>
                    </div>
                    <div>
                      <span className="text-rose-600 font-semibold">Action: </span>
                      <span className="text-zinc-900 font-medium">{gap.actionRequired}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}