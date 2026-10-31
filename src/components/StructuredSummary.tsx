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
  Layers,
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
    <div className="space-y-4">
      {/* 1. Official Application Gateway Banner (Directly satisfies Section 3 Example Use Case requirement) */}
      {officialApplicationUrl && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mt-0.5 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Verified Official Portal
                </span>
                <span className="text-xs text-zinc-400 hidden sm:inline">
                  Statutory Application Link
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">
                {officialApplicationTitle || "Primary Official Application Gateway"}
              </h4>
              <p className="text-xs text-zinc-300 font-mono mt-0.5 truncate max-w-xl">
                {officialApplicationUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Link!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={officialApplicationUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/30 transition cursor-pointer"
            >
              <span>Visit Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* 2. Side-by-Side Dual-Panel: Confirmed Facts vs Missing Dark Spots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Panel A: Structured Summary of Key Information Found */}
        <div className="bg-zinc-900/90 border border-emerald-500/20 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-100">
                  Structured Summary of Confirmed Key Information
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Verified claims corroborated by primary authoritative sources
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {confirmedFacts.length} Confirmed
            </span>
          </div>

          <div className="space-y-2.5">
            {confirmedFacts.map((fact, idx) => {
              const isExpanded = expandedFactIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3.5 space-y-2 transition hover:border-zinc-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      {fact.dimensionName}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium">
                      {fact.sourceTitle}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-zinc-200">
                    {fact.fact}
                  </p>

                  {fact.verifiedQuote && (
                    <div>
                      <button
                        onClick={() => toggleFact(idx)}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Quote className="w-3 h-3 text-emerald-500/60" />
                        <span>{isExpanded ? "Hide source quote" : "Show source quote"}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-2 bg-zinc-900 border border-zinc-800 rounded font-mono text-[11px] text-zinc-300 leading-relaxed italic">
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
        <div className="bg-zinc-900/90 border border-rose-500/20 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-100">
                  Critical Information Gaps & Unanswered Decisions
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Mandatory criteria omitted across evaluated sources (Dark Spots)
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
              {gaps.length} Dark Spots
            </span>
          </div>

          <div className="space-y-2.5">
            {gaps.map((gap) => (
              <div
                key={gap.id}
                className="bg-zinc-950/80 border border-rose-500/20 rounded-xl p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300">
                    {gap.dimensionName}
                  </span>
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {gap.riskLevel} Risk Gap
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {gap.description}
                </p>

                <div className="bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-lg text-[11px] space-y-1">
                  <div>
                    <span className="text-zinc-500 font-semibold">Consequence: </span>
                    <span className="text-zinc-300">{gap.impactReason}</span>
                  </div>
                  <div>
                    <span className="text-rose-400 font-semibold">Action: </span>
                    <span className="text-zinc-300">{gap.actionRequired}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
