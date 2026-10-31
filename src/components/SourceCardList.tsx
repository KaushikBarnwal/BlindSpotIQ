"use client";

import React, { useState } from "react";
import { SourceDocument, AuthorityTier } from "@/types";
import {
  Globe,
  Calendar,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";

interface SourceCardListProps {
  sources: SourceDocument[];
}

export function SourceCardList({ sources }: SourceCardListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderTierBadge = (tier: AuthorityTier, weight: number) => {
    switch (tier) {
      case "primary_official":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Award className="w-3 h-3 text-emerald-400" />
            <span>Primary Authority ({weight}%)</span>
          </span>
        );
      case "secondary_aggregator":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <span>Aggregator ({weight}%)</span>
          </span>
        );
      case "third_party_unverified":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
            <span>Third-Party ({weight}%)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
          <Globe className="w-4 h-4 text-rose-400" />
          <span>Ingested Sources & Trust Hierarchy ({sources.length})</span>
        </h4>
        <span className="text-xs text-zinc-500">
          Traceable provenance for every claim
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {sources.map((src) => {
          const isExpanded = expandedId === src.id;

          return (
            <div
              key={src.id}
              className={`bg-zinc-900/80 border rounded-xl p-4 transition-all flex flex-col justify-between ${
                src.isStale
                  ? "border-rose-500/40 bg-rose-950/10"
                  : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase truncate max-w-[140px]">
                    {src.hostname}
                  </span>
                  {renderTierBadge(src.authorityTier, src.authorityWeight)}
                </div>

                <h5 className="font-bold text-xs text-zinc-200 mt-1 line-clamp-2">
                  {src.title}
                </h5>

                <p className="text-[11px] text-zinc-400 mt-1 italic">
                  {src.authorityRationale}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-2.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-zinc-500" />
                    <span>{src.publishDate || src.cycleOrYear || "Undated"}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-zinc-500" />
                    <span>{src.wordCount} words</span>
                  </span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                {src.url.startsWith("http") ? (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-rose-400 hover:underline flex items-center gap-1 text-[11px] font-medium"
                  >
                    <span>Visit Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Direct Notice
                  </span>
                )}

                <button
                  onClick={() => toggleExpand(src.id)}
                  className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <span>{isExpanded ? "Hide Text" : "View Raw"}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-3 p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 text-[11px] font-mono text-zinc-300 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {src.cleanTextSnippet}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
