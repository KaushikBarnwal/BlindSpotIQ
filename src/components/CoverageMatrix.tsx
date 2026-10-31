"use client";

import React, { useState } from "react";
import { ExpectedDimension, MatrixCell, SourceDocument } from "@/types";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Info,
  ExternalLink,
  Quote,
  Sparkles,
} from "lucide-react";

interface CoverageMatrixProps {
  dimensions: ExpectedDimension[];
  sources: SourceDocument[];
  cells: MatrixCell[];
  detectedCategory: string;
}

export function CoverageMatrix({
  dimensions,
  sources,
  cells,
  detectedCategory,
}: CoverageMatrixProps) {
  const [selectedCell, setSelectedCell] = useState<{
    dimension: ExpectedDimension;
    source: SourceDocument;
    cellData: MatrixCell;
  } | null>(null);

  const getCellData = (dimId: string, srcId: string): MatrixCell => {
    const found = cells.find(
      (c) => c.dimensionId === dimId && c.sourceId === srcId
    );
    if (found) return found;
    return {
      dimensionId: dimId,
      sourceId: srcId,
      status: "missing",
      summary: "Dark Spot: No relevant statements detected.",
      confidence: "unverified",
    };
  };

  const renderStatusBadge = (status: MatrixCell["status"]) => {
    switch (status) {
      case "covered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Covered</span>
          </span>
        );
      case "conflicting":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Conflict</span>
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Info className="w-3.5 h-3.5" />
            <span>Partial</span>
          </span>
        );
      case "missing":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            <span>Dark Spot</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Meta explanation banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <span>Schema-Driven Dark Spot Matrix</span>
              <span className="text-[11px] font-normal text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/40">
                Category: {detectedCategory}
              </span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              An AI cannot detect what is missing unless it understands what a complete answer looks like. Below is the full decision checklist compared against each source. Click any cell to inspect exact source quotes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Found</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Clash</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Dark Spot</span>
          </div>
        </div>
      </div>

      {/* The Matrix Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60 shadow-lg">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80">
              <th className="py-3.5 px-4 font-semibold text-zinc-300 w-1/4 min-w-[240px]">
                Expected Dimension (Decision Criteria)
              </th>
              {sources.map((src) => (
                <th
                  key={src.id}
                  className="py-3.5 px-4 font-semibold text-zinc-300 min-w-[220px]"
                >
                  <div className="flex flex-col">
                    <span className="truncate font-bold text-zinc-200">
                      {src.title}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {src.hostname}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {dimensions.map((dim) => {
              // Check if entire dimension is completely missing across all sources
              const allMissing = sources.every(
                (s) => getCellData(dim.id, s.id).status === "missing"
              );

              return (
                <tr
                  key={dim.id}
                  className={`transition-colors hover:bg-zinc-900/40 ${
                    allMissing ? "bg-rose-950/10" : ""
                  }`}
                >
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-100 text-sm">
                          {dim.name}
                        </span>
                        {dim.category === "critical" && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-rose-900/30 text-rose-300 border border-rose-800/50 font-bold">
                            Critical
                          </span>
                        )}
                        {allMissing && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-rose-500 text-zinc-950 font-extrabold animate-pulse">
                            Complete Blind Spot
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-400 text-xs">{dim.description}</p>
                      <p className="text-[11px] text-zinc-500 italic">
                        Why it matters: {dim.whyItMatters}
                      </p>
                    </div>
                  </td>

                  {sources.map((src) => {
                    const cell = getCellData(dim.id, src.id);
                    return (
                      <td
                        key={`${dim.id}-${src.id}`}
                        onClick={() =>
                          setSelectedCell({
                            dimension: dim,
                            source: src,
                            cellData: cell,
                          })
                        }
                        className={`py-4 px-4 align-top cursor-pointer border-l border-zinc-800/40 transition hover:bg-zinc-800/30 ${
                          cell.status === "missing"
                            ? "bg-rose-950/5"
                            : cell.status === "conflicting"
                            ? "bg-amber-950/10"
                            : ""
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            {renderStatusBadge(cell.status)}
                            <span className="text-[10px] text-zinc-500 hover:text-zinc-300">
                              Inspect ↗
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 line-clamp-3">
                            {cell.summary}
                          </p>
                          {cell.exactQuote && (
                            <div className="text-[11px] text-zinc-400 font-mono bg-zinc-900/60 p-1.5 rounded border border-zinc-800 line-clamp-2">
                              &ldquo;{cell.exactQuote}&rdquo;
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cell Inspection Detail Modal / Popover */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs text-rose-400 font-semibold tracking-wide uppercase">
                  Evidence Provenance Inspector
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedCell.dimension.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <div>
                  <span className="text-zinc-500 block">Evaluated Source:</span>
                  <span className="font-semibold text-zinc-200">
                    {selectedCell.source.title}
                  </span>
                  <a
                    href={selectedCell.source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-rose-400 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>{selectedCell.source.hostname}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>{renderStatusBadge(selectedCell.cellData.status)}</div>
              </div>

              <div>
                <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                  Extracted Findings:
                </span>
                <p className="text-zinc-200 bg-zinc-950 p-3 rounded-lg border border-zinc-800 mt-1">
                  {selectedCell.cellData.summary}
                </p>
              </div>

              {selectedCell.cellData.exactQuote ? (
                <div>
                  <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Quote className="w-3.5 h-3.5" />
                    <span>Exact Sourced Quote (Traceable Evidence):</span>
                  </span>
                  <div className="bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 p-3 rounded-lg font-mono text-[11px] mt-1 leading-relaxed">
                    &ldquo;{selectedCell.cellData.exactQuote}&rdquo;
                  </div>
                </div>
              ) : (
                <div className="bg-rose-950/20 border border-rose-500/30 text-rose-300 p-3 rounded-lg">
                  <span className="font-bold block">No evidence found in this source text.</span>
                  This criteria was completely omitted by this publisher.
                </div>
              )}

              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block">Confidence & Verification Tag:</span>
                <span className="font-mono text-zinc-300 text-xs">
                  [{selectedCell.cellData.confidence.toUpperCase().replace("_", " ")}]
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                onClick={() => setSelectedCell(null)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
