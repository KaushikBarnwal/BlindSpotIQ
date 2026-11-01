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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Primary Authority ({weight}%)</span>
          </span>
        );
      case "secondary_aggregator":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
            <span>Aggregator ({weight}%)</span>
          </span>
        );
      case "third_party_unverified":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600 border border-zinc-200">
            <span>Third-Party ({weight}%)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-base sm:text-lg font-bold text-zinc-950 flex items-center gap-2 font-heading">
          <Globe className="w-5 h-5 text-emerald-600" />
          <span>Sources Used ({sources.length})</span>
        </h4>
        <span className="text-xs sm:text-sm text-zinc-500 font-medium">
          Traceable provenance for every claim
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sources.map((src) => {
          const isExpanded = expandedId === src.id;

          return (
            <div
              key={src.id}
              className={`bg-white border rounded-2xl p-5 transition-all shadow-xs flex flex-col justify-between ${
                src.isStale
                  ? "border-rose-300 bg-rose-50/20"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <span className="font-mono text-xs text-zinc-500 font-bold uppercase truncate max-w-[160px]">
                    {src.hostname}
                  </span>
                  {renderTierBadge(src.authorityTier, src.authorityWeight)}
                </div>

                <h5 className="font-bold text-sm sm:text-base text-zinc-950 mt-1 line-clamp-2">
                  {src.title}
                </h5>

                <p className="text-xs sm:text-sm text-zinc-600 mt-1.5 italic leading-relaxed">
                  {src.authorityRationale}
                </p>

                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{src.publishDate || src.cycleOrYear || "Undated"}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{src.wordCount} words</span>
                  </span>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs sm:text-sm">
                {src.url.startsWith("http") ? (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 font-bold text-xs"
                  >
                    <span>Visit Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-zinc-400 font-mono">
                    Direct Notice
                  </span>
                )}

                <button
                  onClick={() => toggleExpand(src.id)}
                  className="text-zinc-700 hover:text-zinc-950 font-bold flex items-center gap-1 text-xs cursor-pointer"
                >
                  <span>{isExpanded ? "Hide Text" : "View Raw"}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs font-mono text-zinc-800 max-h-52 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-2xs">
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
