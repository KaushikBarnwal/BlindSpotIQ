"use client";

import React, { useState } from "react";
import { ExpectedDimension, MatrixCell, SourceDocument } from "@/types";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  ExternalLink,
  Quote,
  Sparkles,
  Grid,
  Layers,
  ChevronDown,
  ChevronUp,
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
  const [viewMode, setViewMode] = useState<"cards" | "matrix">("cards");
  const [statusFilter, setStatusFilter] = useState<"all" | "missing" | "conflicting" | "covered">("all");
  const [selectedCell, setSelectedCell] = useState<{
    dimension: ExpectedDimension;
    source: SourceDocument;
    cellData: MatrixCell;
  } | null>(null);

  // Set of expanded dimension card IDs in "cards" view (default collapsed for readability)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    const all: Record<string, boolean> = {};
    dimensions.forEach((d) => (all[d.id] = true));
    setExpandedCards(all);
  };

  const handleCollapseAll = () => {
    setExpandedCards({});
  };

  const getCellData = (dimId: string, srcId: string): MatrixCell => {
    const found = cells.find(
      (c) => c.dimensionId === dimId && c.sourceId === srcId
    );
    if (found) return found;
    return {
      dimensionId: dimId,
      sourceId: srcId,
      status: "missing",
      summary: "Dark Spot: No statements detected.",
      confidence: "unverified",
    };
  };

  const dimStatusMap = dimensions.map((dim) => {
    const dimCells = sources.map((s) => getCellData(dim.id, s.id));
    const allMissing = dimCells.every((c) => c.status === "missing");
    const hasConflict = dimCells.some((c) => c.status === "conflicting");
    const isCovered = !allMissing && !hasConflict;
    return {
      id: dim.id,
      status: allMissing ? "missing" : hasConflict ? "conflicting" : "covered",
    };
  });

  const missingCount = dimStatusMap.filter((d) => d.status === "missing").length;
  const conflictCount = dimStatusMap.filter((d) => d.status === "conflicting").length;
  const coveredCount = dimStatusMap.filter((d) => d.status === "covered").length;

  const filteredDimensions = dimensions.filter((dim) => {
    if (statusFilter === "all") return true;
    const status = dimStatusMap.find((d) => d.id === dim.id)?.status;
    return status === statusFilter;
  });

  const renderStatusBadge = (status: MatrixCell["status"], size: "sm" | "md" = "sm") => {
    const pad = size === "sm" ? "px-2.5 py-0.5 text-xs font-bold" : "px-3.5 py-1 text-xs sm:text-sm font-bold";
    switch (status) {
      case "covered":
        return (
          <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${pad}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Covered</span>
          </span>
        );
      case "conflicting":
        return (
          <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse ${pad}`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Conflict</span>
          </span>
        );
      case "partial":
        return (
          <span className={`inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 ${pad}`}>
            <Info className="w-3.5 h-3.5" />
            <span>Partial</span>
          </span>
        );
      case "missing":
      default:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${pad}`}>
            <XCircle className="w-3.5 h-3.5" />
            <span>Dark Spot</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Meta explanation banner + View Mode Switcher */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-600 mt-0.5 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-zinc-950 flex items-center gap-2 flex-wrap">
              <span>Topics Checked & Missing Details</span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
                {detectedCategory}
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
              Every topic required for a complete application, cross-checked against all your sources.
            </p>
          </div>
        </div>

        {/* View Switcher: Heatmap Matrix vs Responsive Dimension Cards */}
        <div className="flex items-center bg-zinc-100 border border-zinc-200/80 rounded-xl p-0.5 self-stretch sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === "cards"
                ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/60"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Dimension Cards</span>
          </button>
          <button
            onClick={() => setViewMode("matrix")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === "matrix"
                ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/60"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-violet-600" />
            <span>Heatmap Grid</span>
          </button>
        </div>
      </div>

      {/* Filtering & Expansion Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white p-2.5 rounded-xl border border-zinc-200/90 shadow-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-zinc-400 mr-1 hidden sm:inline">
            Filter View:
          </span>
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              statusFilter === "all"
                ? "bg-zinc-950 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
            }`}
          >
            All Topics ({dimensions.length})
          </button>
          <button
            onClick={() => setStatusFilter("missing")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "missing"
                ? "bg-rose-100 text-rose-800 border border-rose-300 shadow-xs"
                : "text-rose-700 bg-rose-50 hover:bg-rose-100/70"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Missing ({missingCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter("conflicting")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "conflicting"
                ? "bg-amber-100 text-amber-800 border border-amber-300 shadow-xs"
                : "text-amber-700 bg-amber-50 hover:bg-amber-100/70"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Conflicts ({conflictCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter("covered")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "covered"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs"
                : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Verified ({coveredCount})</span>
          </button>
        </div>

        {viewMode === "cards" && (
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleExpandAll}
              className="text-zinc-500 hover:text-zinc-950 text-[11px] font-semibold px-2 py-1 rounded hover:bg-zinc-100 transition cursor-pointer"
            >
              Expand All
            </button>
            <span className="text-zinc-300">|</span>
            <button
              onClick={handleCollapseAll}
              className="text-zinc-500 hover:text-zinc-950 text-[11px] font-semibold px-2 py-1 rounded hover:bg-zinc-100 transition cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: Heatmap Table */}
      {viewMode === "matrix" && (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80">
                <th className="py-3 px-4 font-semibold text-zinc-700 w-1/4 min-w-[220px]">
                  Expected Dimension
                </th>
                {sources.map((src) => (
                  <th
                    key={src.id}
                    className="py-3 px-4 font-semibold text-zinc-700 min-w-[200px]"
                  >
                    <div className="flex flex-col">
                      <span className="truncate font-bold text-zinc-900">
                        {src.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {src.hostname}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredDimensions.length === 0 ? (
                <tr>
                  <td colSpan={sources.length + 1} className="py-8 text-center text-zinc-400 text-xs">
                    No dimensions match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredDimensions.map((dim) => {
                  const allMissing = sources.every(
                    (s) => getCellData(dim.id, s.id).status === "missing"
                  );

                  return (
                    <tr
                      key={dim.id}
                      className={`transition-colors hover:bg-zinc-50/60 ${
                        allMissing ? "bg-rose-50/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-zinc-900 text-xs sm:text-sm">
                              {dim.name}
                            </span>
                            {dim.category === "critical" && (
                              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-700 font-bold">
                                Critical
                              </span>
                            )}
                            {allMissing && (
                              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-rose-500 text-white font-extrabold animate-pulse">
                                Blind Spot
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-500 text-xs">{dim.description}</p>
                          <p className="text-[10px] text-zinc-400 italic">
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
                            className={`py-3.5 px-4 align-top cursor-pointer border-l border-zinc-100 transition hover:bg-zinc-100/60 ${
                              cell.status === "missing"
                                ? "bg-rose-50/30"
                                : cell.status === "conflicting"
                                ? "bg-amber-50/30"
                                : ""
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                {renderStatusBadge(cell.status)}
                                <span className="text-[10px] text-zinc-400 hover:text-zinc-700">
                                  Inspect ↗
                                </span>
                              </div>
                              <p className="text-xs text-zinc-700 line-clamp-2">
                                {cell.summary}
                              </p>
                              {cell.exactQuote && (
                                <div className="text-[10px] text-zinc-500 font-mono bg-zinc-50 p-1.5 rounded border border-zinc-200 line-clamp-2">
                                  &ldquo;{cell.exactQuote}&rdquo;
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: Dimension Accordion Cards */}
      {viewMode === "cards" && (
        <div className="space-y-2.5">
          {filteredDimensions.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center text-zinc-400 text-xs">
              No dimensions match the selected filter.
            </div>
          ) : (
            filteredDimensions.map((dim) => {
              const isExpanded = Boolean(expandedCards[dim.id]);
              const dimCells = sources.map((s) => ({
                source: s,
                cell: getCellData(dim.id, s.id),
              }));

              const hasConflict = dimCells.some((c) => c.cell.status === "conflicting");
              const allMissing = dimCells.every((c) => c.cell.status === "missing");
              const coveredCount = dimCells.filter(
                (c) => c.cell.status === "covered" || c.cell.status === "partial"
              ).length;

              return (
                <div
                  key={dim.id}
                  className={`bg-white border rounded-xl overflow-hidden transition-all shadow-xs ${
                    allMissing
                      ? "border-rose-200 bg-rose-50/20"
                      : hasConflict
                      ? "border-amber-200 bg-amber-50/20"
                      : "border-zinc-200/90"
                  }`}
                >
                  {/* Accordion Card Header */}
                  <div
                    onClick={() => toggleCard(dim.id)}
                    className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-zinc-50/80 transition select-none"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base text-zinc-950">
                          {dim.name}
                        </span>
                        {dim.category === "critical" && (
                          <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                            Critical
                          </span>
                        )}
                        {allMissing ? (
                          <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                            ⚠️ Missing in All Sources
                          </span>
                        ) : hasConflict ? (
                          <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            ⚡ Conflicting Information
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ Verified ({coveredCount}/{sources.length})
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-600 line-clamp-1">{dim.description}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-xs text-zinc-500 hidden sm:inline">
                        {isExpanded ? "Hide Evidence" : "Inspect Sources"}
                      </span>
                      <div className="p-1.5 rounded-lg bg-zinc-100 text-zinc-500">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Source Details & Inline Evidence */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-3 border-t border-zinc-100 bg-zinc-50/50 space-y-3.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                        Source-by-Source Evidence:
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {dimCells.map(({ source, cell }) => (
                          <div
                            key={source.id}
                            className={`p-3 rounded-xl border text-xs space-y-2 bg-white ${
                              cell.status === "missing"
                                ? "border-rose-200/80 bg-rose-50/30"
                                : cell.status === "conflicting"
                                ? "border-amber-200/80 bg-amber-50/30"
                                : "border-zinc-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs sm:text-sm text-zinc-900 truncate max-w-[160px]">
                                {source.title}
                              </span>
                              {renderStatusBadge(cell.status)}
                            </div>
                            <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed">
                              {cell.summary}
                            </p>
                            {cell.exactQuote && (
                              <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 font-mono text-xs text-zinc-700 leading-relaxed italic">
                                &ldquo;{cell.exactQuote}&rdquo;
                              </div>
                            )}
                            <div className="text-xs text-zinc-500 flex items-center justify-between pt-1">
                              <span>[{cell.confidence.replace("_", " ")}]</span>
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold text-xs"
                              >
                                <span>Source ↗</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal Inspector for Table View */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-zinc-100 pb-3">
              <div>
                <span className="text-[10px] text-indigo-600 font-bold tracking-wide uppercase">
                  Evidence Provenance Inspector
                </span>
                <h3 className="text-base font-bold text-zinc-950 mt-0.5">
                  {selectedCell.dimension.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-zinc-400 hover:text-zinc-950 p-1 rounded-lg hover:bg-zinc-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                <div>
                  <span className="text-zinc-400 text-[11px] block">Evaluated Source:</span>
                  <span className="font-semibold text-zinc-900">
                    {selectedCell.source.title}
                  </span>
                  <a
                    href={selectedCell.source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline flex items-center gap-1 mt-0.5 text-[11px]"
                  >
                    <span>{selectedCell.source.hostname}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>{renderStatusBadge(selectedCell.cellData.status, "md")}</div>
              </div>

              <div>
                <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                  Extracted Findings:
                </span>
                <p className="text-zinc-800 bg-zinc-50 p-3 rounded-lg border border-zinc-200 mt-1">
                  {selectedCell.cellData.summary}
                </p>
              </div>

              {selectedCell.cellData.exactQuote ? (
                <div>
                  <span className="text-emerald-700 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Quote className="w-3 h-3" />
                    <span>Exact Sourced Quote (Traceable Evidence):</span>
                  </span>
                  <div className="bg-emerald-50/60 border border-emerald-200 text-emerald-900 p-3 rounded-lg font-mono text-[11px] mt-1 leading-relaxed italic">
                    &ldquo;{selectedCell.cellData.exactQuote}&rdquo;
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg">
                  <span className="font-bold block">No evidence found in this source text.</span>
                  This criteria was completely omitted by this publisher.
                </div>
              )}

              <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 flex items-center justify-between">
                <span className="text-zinc-500 text-[11px]">Confidence & Verification Tag:</span>
                <span className="font-mono text-zinc-700 text-xs font-semibold">
                  [{selectedCell.cellData.confidence.toUpperCase().replace("_", " ")}]
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-100">
              <button
                onClick={() => setSelectedCell(null)}
                className="bg-zinc-950 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
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
