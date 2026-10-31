"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { TopicInput } from "@/components/TopicInput";
import { CoverageMatrix } from "@/components/CoverageMatrix";
import { ContradictionViewer } from "@/components/ContradictionViewer";
import { TemporalWarnings } from "@/components/TemporalWarnings";
import { VerificationChecklist } from "@/components/VerificationChecklist";
import { SourceCardList } from "@/components/SourceCardList";
import { StructuredSummary } from "@/components/StructuredSummary";
import { AnalysisResult, DirectTextInput } from "@/types";
import {
  SAMPLE_SCHOLARSHIP_SCENARIO,
  SAMPLE_VISA_SCENARIO,
} from "@/lib/sampleData";
import {
  Grid,
  ArrowRightLeft,
  ListTodo,
  Layers,
  Sparkles,
  Award,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export default function PlatformPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult>(
    SAMPLE_SCHOLARSHIP_SCENARIO
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "matrix" | "conflicts" | "checklist" | "sources"
  >("matrix");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async (
    topic: string,
    urls: string[],
    directTexts?: DirectTextInput[]
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, urls, directTexts }),
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
        "Live network request could not complete. Reverted safely to curated baseline synthesis."
      );
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
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col font-sans">
      <Header
        onLoadScholarshipSample={handleLoadScholarship}
        onLoadVisaSample={handleLoadVisa}
        activeScenarioId={analysis.id}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-4">
        {/* Section 7 Demo Step 1: Research Question & Multi-Source Input */}
        <TopicInput
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          onLoadScholarshipSample={handleLoadScholarship}
          onLoadVisaSample={handleLoadVisa}
        />

        {errorMessage && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs flex items-center justify-between shadow-xs">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-amber-600 hover:text-amber-950 cursor-pointer font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Executive Summary & High-Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          <div className="md:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Synthesized Domain Schema Verdict</span>
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {analysis.sources.length} Ingested Sources
                </span>
              </div>
              <h2 className="text-base font-extrabold text-zinc-950">
                {analysis.topic}
              </h2>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                {analysis.executiveSummary}
              </p>
            </div>

            <div className="pt-2.5 mt-2.5 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-medium">
                  {analysis.detectedCategory}
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authority-Weighted Resolution Active</span>
                </span>
              </div>

              {analysis.officialApplicationUrl && (
                <a
                  href={analysis.officialApplicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition font-semibold"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Official Portal ↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Completeness Gauge */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Decision Completeness
            </span>
            <div className="my-1.5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-zinc-950">
                  {analysis.overallCompletenessScore}%
                </span>
                <span className="text-[11px] text-zinc-500">criteria verified</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden mt-2.5 border border-zinc-200">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${analysis.overallCompletenessScore}%` }}
                />
              </div>
            </div>
            <p className="text-[10px] text-zinc-500">
              {analysis.overallCompletenessScore < 70
                ? "⚠️ High uncertainty: Mandatory criteria missing."
                : "Moderate coverage: Verify remaining gaps."}
            </p>
          </div>

          {/* Red Flag Summary Counters */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Detected Vulnerabilities
            </span>
            <div className="grid grid-cols-3 gap-1.5 my-1.5 text-center">
              <div className="bg-rose-50/70 p-2 rounded-xl border border-rose-200">
                <span className="text-xl font-black text-rose-700 block">
                  {darkSpotsCount}
                </span>
                <span className="text-[9px] text-rose-800 block uppercase font-bold">
                  Dark Spots
                </span>
              </div>
              <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200">
                <span className="text-xl font-black text-amber-700 block">
                  {conflictsCount}
                </span>
                <span className="text-[9px] text-amber-800 block uppercase font-bold">
                  Clashes
                </span>
              </div>
              <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                <span className="text-xl font-black text-zinc-800 block">
                  {staleCount}
                </span>
                <span className="text-[9px] text-zinc-500 block uppercase font-bold">
                  Stale
                </span>
              </div>
            </div>
            <span className="text-[10px] text-rose-600 font-semibold block text-center">
              {analysis.highRiskCount} High-Risk Blind Spots Require Action
            </span>
          </div>
        </div>

        {/* Temporal Alerts Banner (Compact single-line banner) */}
        {analysis.temporalAlerts.length > 0 && (
          <TemporalWarnings alerts={analysis.temporalAlerts} />
        )}

        {/* Navigation Tabs - Clean Light Mode Style */}
        <div className="flex border-b border-zinc-200 gap-2 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "matrix"
                ? "border-indigo-600 text-indigo-700 bg-indigo-50/40"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>1. Blind-Spot Matrix & Gaps</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-zinc-100 text-[10px] text-zinc-600 font-semibold">
              {analysis.expectedDimensions.length} Dimensions
            </span>
          </button>

          <button
            onClick={() => setActiveTab("conflicts")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "conflicts"
                ? "border-amber-600 text-amber-800 bg-amber-50/40"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>2. Source Contradictions</span>
            {conflictsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {conflictsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("checklist")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "checklist"
                ? "border-emerald-600 text-emerald-800 bg-emerald-50/40"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>3. Action Verification Checklist</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {analysis.verificationChecklist.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("sources")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "sources"
                ? "border-zinc-900 text-zinc-950 bg-zinc-100/50"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4. Ingested Sources & Trust Hierarchy</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-zinc-100 text-[10px] text-zinc-600 font-semibold">
              {analysis.sources.length}
            </span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="space-y-4">
          {activeTab === "matrix" && (
            <div className="space-y-4">
              <StructuredSummary
                confirmedFacts={analysis.confirmedFacts}
                gaps={analysis.gaps}
                officialApplicationUrl={analysis.officialApplicationUrl}
                officialApplicationTitle={analysis.officialApplicationTitle}
                topic={analysis.topic}
              />

              <CoverageMatrix
                dimensions={analysis.expectedDimensions}
                sources={analysis.sources}
                cells={analysis.coverageMatrix}
                detectedCategory={analysis.detectedCategory}
              />
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

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-6 mt-12 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900">BlindspotIQ</span>
            <span>—</span>
            <span>Digital Dark Spot Challenge (Devengers 2026)</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            Schema-Driven Gap Detection • Authority-Weighted Conflict Resolution • Built with Next.js & Gemini
          </div>
        </div>
      </footer>
    </div>
  );
}
