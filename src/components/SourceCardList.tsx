"use client";

import React, { useState } from "react";
import { SourceDocument } from "@/types";
import { Globe, Calendar, FileText, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

interface SourceCardListProps {
  sources: SourceDocument[];
}

export function SourceCardList({ sources }: SourceCardListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
          <Globe className="w-4 h-4 text-rose-400" />
          <span>Ingested Source Material ({sources.length})</span>
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
              className={`bg-zinc-900/80 border rounded-xl p-4 transition-all ${
                src.isStale
                  ? "border-rose-500/40 bg-rose-950/10"
                  : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">
                  {src.hostname}
                </span>
                {src.isStale && (
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Stale Source
                  </span>
                )}
              </div>

              <h5 className="font-bold text-xs text-zinc-200 mt-1 line-clamp-2">
                {src.title}
              </h5>

              <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  <span>{src.publishDate || src.cycleOrYear || "Undated"}</span>
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-zinc-500" />
                  <span>{src.wordCount} words</span>
                </span>
              </div>

              <div className="pt-3 mt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-rose-400 hover:underline flex items-center gap-1 text-[11px] font-medium"
                >
                  <span>Visit URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => toggleExpand(src.id)}
                  className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]"
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
