"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { TopicInput } from "@/components/TopicInput";
import { CoverageMatrix } from "@/components/CoverageMatrix";
import { ContradictionViewer } from "@/components/ContradictionViewer";
import { TemporalWarnings } from "@/components/TemporalWarnings";
import { VerificationChecklist } from "@/components/VerificationChecklist";
import { SourceCardList } from "@/components/SourceCardList";
import { AnalysisResult } from "@/types";
import {
  SAMPLE_SCHOLARSHIP_SCENARIO,
  SAMPLE_VISA_SCENARIO,
} from "@/lib/sampleData";
import {
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle,
  FileSearch,
  Grid,
  ListTodo,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisResult>(
    SAMPLE_SCHOLARSHIP_SCENARIO
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "matrix" | "conflicts" | "checklist" | "sources"
  >("matrix");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async (topic: string, urls: string[]) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, urls }),
      });

      if (!res.ok) {
        throw new Error(`Analysis failed with status ${res.status}`);
      }

      const data: AnalysisResult = await res.json();
      setAnalysis(data);
      setActiveTab("matrix");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        "Live extraction encountered a network limit or missing API key. Displaying high-fidelity scenario synthesis instead."
      );
      // Fallback seamlessly to sample scenario
      setAnalysis(SAMPLE_SCHOLARSHIP_SCENARIO);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadScholarship = () => {
    setAnalysis(SAMPLE_SCHOLARSHIP_SCENARIO);
    setActiveTab("matrix");
    setErrorMessage(null);
  };

  const handleLoadVisa = () => {
    setAnalysis(SAMPLE_VISA_SCENARIO);
    setActiveTab("matrix");
    setErrorMessage(null);
  };

  const darkSpotsCount = analysis.gaps.length;
  const conflictsCount = analysis.contradictions.length;
  const staleCount = analysis.temporalAlerts.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header
        onLoadScholarshipSample={handleLoadScholarship}
        onLoadVisaSample={handleLoadVisa}
        activeScenarioId={analysis.id}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Topic Input section */}
        <TopicInput
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          onLoadScholarshipSample={handleLoadScholarship}
          onLoadVisaSample={handleLoadVisa}
        />

        {errorMessage && (
          <div className="bg-amber-950/40 border border-amber-500/30 text-amber-300 p-4 rounded-xl text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-amber-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Executive Summary & High-Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                  Target Domain & Verdict
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  {analysis.sources.length} Sources Ingested
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white">
                {analysis.topic}
              </h2>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                {analysis.executiveSummary}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
                {analysis.detectedCategory}
              </span>
              <span>•</span>
              <span>Updated just now</span>
            </div>
          </div>

          {/* Completeness Gauge */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Decision Completeness
            </span>
            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  {analysis.overallCompletenessScore}%
                </span>
                <span className="text-xs text-zinc-400">of critical criteria covered</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden mt-3 border border-zinc-800">
                <div
                  className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full"
                  style={{ width: `${analysis.overallCompletenessScore}%` }}
                />
              </div>
            </div>
            <p className="text-[11px] text-zinc-500">
              {analysis.overallCompletenessScore < 70
                ? "⚠️ High uncertainty: Essential conditions missing."
                : "Moderate coverage: Verify remaining gaps."}
            </p>
          </div>

          {/* Red Flag Summary Counters */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Detected Vulnerabilities
            </span>
            <div className="grid grid-cols-3 gap-2 my-2 text-center">
              <div className="bg-zinc-950 p-2 rounded-xl border border-rose-500/30">
                <span className="text-xl font-black text-rose-400 block">
                  {darkSpotsCount}
                </span>
                <span className="text-[10px] text-zinc-400 block uppercase font-medium">
                  Dark Spots
                </span>
              </div>
              <div className="bg-zinc-950 p-2 rounded-xl border border-amber-500/30">
                <span className="text-xl font-black text-amber-400 block">
                  {conflictsCount}
                </span>
                <span className="text-[10px] text-zinc-400 block uppercase font-medium">
                  Clashes
                </span>
              </div>
              <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                <span className="text-xl font-black text-zinc-300 block">
                  {staleCount}
                </span>
                <span className="text-[10px] text-zinc-400 block uppercase font-medium">
                  Stale
                </span>
              </div>
            </div>
            <span className="text-[10px] text-rose-400 font-semibold block text-center">
              {analysis.highRiskCount} High-Risk Blind Spots Require Action
            </span>
          </div>
        </div>

        {/* Temporal Alerts Banner (if any) */}
        {analysis.temporalAlerts.length > 0 && (
          <TemporalWarnings alerts={analysis.temporalAlerts} />
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 gap-2 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "matrix"
                ? "border-rose-500 text-rose-400 bg-rose-500/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Blind-Spot Heatmap Matrix</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-300">
              {analysis.expectedDimensions.length} Dimensions
            </span>
          </button>

          <button
            onClick={() => setActiveTab("conflicts")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "conflicts"
                ? "border-amber-500 text-amber-400 bg-amber-500/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Source Contradictions</span>
            {conflictsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                {conflictsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("checklist")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "checklist"
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>Actionable Verification Checklist</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
              {analysis.verificationChecklist.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("sources")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "sources"
                ? "border-zinc-400 text-white bg-zinc-800/40"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Ingested Sources & Text</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px]">
              {analysis.sources.length}
            </span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="space-y-6">
          {activeTab === "matrix" && (
            <div className="space-y-6">
              <CoverageMatrix
                dimensions={analysis.expectedDimensions}
                sources={analysis.sources}
                cells={analysis.coverageMatrix}
                detectedCategory={analysis.detectedCategory}
              />

              {/* Gaps / Dark Spots Cards */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>Detected Information Dark Spots (Missing Critical Data)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.gaps.map((gap) => (
                    <div
                      key={gap.id}
                      className="bg-zinc-900/90 border border-rose-500/30 rounded-xl p-4 space-y-2 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-rose-300">
                          {gap.dimensionName}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {gap.riskLevel} Risk Gap
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {gap.description}
                      </p>
                      <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-[11px] space-y-1">
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
          )}

          {activeTab === "conflicts" && (
            <ContradictionViewer contradictions={analysis.contradictions} />
          )}

          {activeTab === "checklist" && (
            <VerificationChecklist
              items={analysis.verificationChecklist}
              topic={analysis.topic}
            />
          )}

          {activeTab === "sources" && (
            <SourceCardList sources={analysis.sources} />
          )}
        </div>
      </main>

      {/* Footer with hackathon metadata & attribution */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-6 mt-12 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">BlindspotIQ</span>
            <span>—</span>
            <span>Digital Dark Spot Challenge (Devengers 2026)</span>
          </div>
          <div className="text-[11px] text-zinc-600">
            Schema-driven Information Gap Detection • Built with Next.js, Gemini & Tailwind
          </div>
        </div>
      </footer>
    </div>
  );
}
