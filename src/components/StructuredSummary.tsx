"use client";

import React, { useState } from "react";
import { ConfirmedFact, DarkSpotGap } from "@/types";
import {
  CheckCircle2,
  AlertOctagon,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
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
  officialApplicationUrl,
  officialApplicationTitle,
  topic,
}: StructuredSummaryProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedFactIdx, setExpandedFactIdx] = useState<number | null>(null);
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);

  const handleCopyLink = () => {
    if (officialApplicationUrl) {
      navigator.clipboard.writeText(officialApplicationUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const toggleFact = (idx: number) => {
    setExpandedFactIdx(expandedFactIdx === idx ? null : idx);
  };

  return (
    <div className="space-y-3">
      {/* 1. Official Application Gateway Banner (Ultra-compact & prominent) */}
      {officialApplicationUrl && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl px-4 py-2.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-200/60 text-emerald-900 border border-emerald-300">
                  Verified Official Portal
                </span>
                <span className="text-xs font-bold text-zinc-950 truncate">
                  {officialApplicationTitle || "Primary Official Application Gateway"}
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono truncate block mt-0.5">
                {officialApplicationUrl}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 border border-zinc-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={officialApplicationUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
            >
              <span>Visit Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* 2. Collapsible Toggle Header for Dual Panel */}
      <div className="flex items-center justify-between bg-zinc-100/80 border border-zinc-200/80 rounded-xl px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-semibold text-zinc-800">
            Synthesized Findings:
          </span>
          <span className="text-emerald-700 font-medium">
            {confirmedFacts.length} Confirmed Facts
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-rose-600 font-medium">
            {gaps.length} Dark Spots
          </span>
        </div>

        <button
          onClick={() => setIsSectionCollapsed(!isSectionCollapsed)}
          className="text-zinc-500 hover:text-zinc-950 flex items-center gap-1 font-semibold text-xs cursor-pointer"
        >
          <span>{isSectionCollapsed ? "Show Breakdown" : "Hide Breakdown"}</span>
          {isSectionCollapsed ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* 3. Side-by-Side Dual-Panel: Confirmed Facts vs Missing Dark Spots */}
      {!isSectionCollapsed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
          {/* Panel A: Structured Summary of Key Information Found */}
          <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">
                    Confirmed Key Information
                  </h4>
                  <p className="text-[10px] text-zinc-500">
                    Corroborated by primary authoritative sources
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                {confirmedFacts.length} Facts
              </span>
            </div>

            <div className="space-y-2">
              {confirmedFacts.map((fact, idx) => {
                const isExpanded = expandedFactIdx === idx;
                return (
                  <div
                    key={idx}
                    className="bg-zinc-50/80 border border-zinc-200/80 rounded-lg p-2.5 space-y-1.5 transition hover:border-zinc-300"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[9px] uppercase font-bold text-emerald-700 tracking-wider">
                        {fact.dimensionName}
                      </span>
                      <span className="text-[9px] text-zinc-400 font-medium">
                        {fact.sourceTitle}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-zinc-800">
                      {fact.fact}
                    </p>

                    {fact.verifiedQuote && (
                      <div>
                        <button
                          onClick={() => toggleFact(idx)}
                          className="text-[10px] text-zinc-500 hover:text-zinc-800 flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <Quote className="w-2.5 h-2.5 text-emerald-600" />
                          <span>{isExpanded ? "Hide quote" : "Show source quote"}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-2.5 h-2.5" />
                          ) : (
                            <ChevronDown className="w-2.5 h-2.5" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-1.5 p-2 bg-white border border-zinc-200 rounded font-mono text-[10px] text-zinc-600 leading-relaxed italic">
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

          {/* Panel B: Critical Omissions & Information Gaps */}
          <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200/60">
                  <AlertOctagon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">
                    Critical Information Gaps (Dark Spots)
                  </h4>
                  <p className="text-[10px] text-zinc-500">
                    Mandatory criteria omitted across all evaluated sources
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80">
                {gaps.length} Gaps
              </span>
            </div>

            <div className="space-y-2">
              {gaps.map((gap) => (
                <div
                  key={gap.id}
                  className="bg-rose-50/30 border border-rose-200/70 rounded-lg p-2.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900">
                      {gap.dimensionName}
                    </span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200">
                      {gap.riskLevel} Risk
                    </span>
                  </div>

                  <p className="text-xs text-zinc-700 leading-relaxed">
                    {gap.description}
                  </p>

                  <div className="bg-white border border-zinc-200 p-2 rounded text-[10px] space-y-0.5">
                    <div>
                      <span className="text-zinc-500 font-semibold">Risk: </span>
                      <span className="text-zinc-700">{gap.impactReason}</span>
                    </div>
                    <div>
                      <span className="text-rose-600 font-semibold">Action: </span>
                      <span className="text-zinc-800">{gap.actionRequired}</span>
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
