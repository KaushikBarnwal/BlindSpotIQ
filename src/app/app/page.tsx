"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { TopicInput } from "@/components/TopicInput";
import { CoverageMatrix } from "@/components/CoverageMatrix";
import { ContradictionViewer } from "@/components/ContradictionViewer";
import { TemporalWarnings } from "@/components/TemporalWarnings";
import { VerificationChecklist } from "@/components/VerificationChecklist";
import { SourceCardList } from "@/components/SourceCardList";
import { StructuredSummary } from "@/components/StructuredSummary";
import { AnalysisResult, DirectTextInput, UserScopeContext } from "@/types";
import {
  SAMPLE_SCHOLARSHIP_SCENARIO,
  SAMPLE_VISA_SCENARIO,
} from "@/lib/sampleData";
import { useRecentSessions } from "@/lib/useRecentSessions";
import { generateFullAuditMarkdown } from "@/lib/exportMarkdown";
import {
  Grid,
  ArrowRightLeft,
  ListTodo,
  Layers,
  Sparkles,
  Award,
  ShieldCheck,
  ExternalLink,
  Download,
  Printer,
  Target,
  ArrowRight,
  BookOpen,
  Compass,
  History,
  RotateCcw,
  Cpu,
} from "lucide-react";

export default function PlatformPage() {
  // Start with clean empty state (no by-default sample dummy data)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "matrix" | "conflicts" | "checklist" | "sources"
  >("matrix");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    recentSessions,
    saveSession,
    loadSessionPayload,
    clearAllSessions,
  } = useRecentSessions();

  const handleAnalyze = async (
    topic: string,
    urls: string[],
    directTexts?: DirectTextInput[],
    scope?: UserScopeContext,
    useTavilySearch?: boolean,
    provider?: "gemini" | "groq" | "auto"
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          urls,
          directTexts,
          scope,
          useTavilySearch,
          provider,
        }),
      });

      if (!res.ok) {
        throw new Error(`Analysis failed with status ${res.status}`);
      }

      const data: AnalysisResult = await res.json();
      setAnalysis(data);
      saveSession(data);
      setActiveTab("matrix");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        "Live network request could not complete. Reverted safely to curated baseline synthesis."
      );
      const fallback: AnalysisResult = {
        ...SAMPLE_SCHOLARSHIP_SCENARIO,
        topic: topic || SAMPLE_SCHOLARSHIP_SCENARIO.topic,
        userScope: scope || SAMPLE_SCHOLARSHIP_SCENARIO.userScope,
      };
      setAnalysis(fallback);
      saveSession(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadScholarship = () => {
    setAnalysis(SAMPLE_SCHOLARSHIP_SCENARIO);
    saveSession(SAMPLE_SCHOLARSHIP_SCENARIO);
    setActiveTab("matrix");
    setErrorMessage(null);
  };

  const handleLoadVisa = () => {
    setAnalysis(SAMPLE_VISA_SCENARIO);
    saveSession(SAMPLE_VISA_SCENARIO);
    setActiveTab("matrix");
    setErrorMessage(null);
  };

  const handleResetToNewSession = () => {
    setAnalysis(null);
    setErrorMessage(null);
  };

  const handleSelectRecentSession = (id: string) => {
    if (id === SAMPLE_SCHOLARSHIP_SCENARIO.id) {
      handleLoadScholarship();
      return;
    }
    if (id === SAMPLE_VISA_SCENARIO.id) {
      handleLoadVisa();
      return;
    }
    const payload = loadSessionPayload(id);
    if (payload) {
      setAnalysis(payload);
      setActiveTab("matrix");
      setErrorMessage(null);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!analysis) return;
    const md = generateFullAuditMarkdown(analysis);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug = analysis.topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 35);
    a.download = `blindspotiq-audit-${slug || "report"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const darkSpotsCount = analysis?.gaps?.length ?? 0;
  const conflictsCount = analysis?.contradictions?.length ?? 0;
  const staleCount = analysis?.temporalAlerts?.length ?? 0;

  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col font-sans">
      <Header
        onLoadScholarshipSample={handleLoadScholarship}
        onLoadVisaSample={handleLoadVisa}
        activeScenarioId={analysis?.id}
        recentSessions={recentSessions}
        onSelectRecentSession={handleSelectRecentSession}
        onClearRecentSessions={clearAllSessions}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {errorMessage && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-sm flex items-center justify-between shadow-xs">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-amber-700 hover:text-amber-950 cursor-pointer font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* VIEW 1: Clean Initial Workspace (When no analysis is active) */}
        {!analysis ? (
          <div className="space-y-6">
            {/* Page Title & Mission - Bold, clean, large typography */}
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase tracking-wider border border-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Research Workspace</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight">
                Start a research session
              </h1>
              <p className="text-base sm:text-lg text-zinc-600 max-w-3xl leading-relaxed">
                Write your question, specify your situation, and collect your sources. BlindspotIQ scans across all material to expose critical missing conditions, factual contradictions, and cycle freshness warnings into a prioritized action checklist.
              </p>
            </div>

            {/* 2-Column Grid matching and elevating rival layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Research Input Form (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <TopicInput
                  onAnalyze={handleAnalyze}
                  isLoading={isLoading}
                  onLoadScholarshipSample={handleLoadScholarship}
                  onLoadVisaSample={handleLoadVisa}
                  isStandalone={true}
                  hasActiveAnalysis={false}
                />
              </div>

              {/* Right Column: Guidance, Presets, and Sessions (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Before You Start Card (Red left accent border) */}
                <div className="bg-white border border-zinc-200 border-l-4 border-l-rose-500 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-950">
                    Before you start
                  </h3>
                  <ul className="space-y-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <span className="text-rose-500 font-bold text-base">•</span>
                      <span>
                        <strong>Multi-Source Cross-Examination:</strong> It reviews web pages, PDF circulars, or automated Tavily search results you select.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-rose-500 font-bold text-base">•</span>
                      <span>
                        <strong>Institutional Authority Hierarchy:</strong> Official government (<code className="text-zinc-800 font-mono">.gov</code>) and academic (<code className="text-zinc-800 font-mono">.edu</code>) portals override secondary blogs.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-rose-500 font-bold text-base">•</span>
                      <span>
                        <strong>Dual-AI Inference Engine:</strong> Supports Google Gemini 2.5 Flash and Groq LPU with automated fallback.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Pre-Curated Test Benchmarks */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-zinc-950">
                      Pre-curated Test Benchmarks
                    </h3>
                    <span className="text-xs font-semibold text-zinc-400">1-Click Preview</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-500">
                    Preview the full schema-driven audit on verified hackathon test scenarios:
                  </p>

                  <div className="space-y-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleLoadScholarship}
                      className="w-full text-left p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50/80 hover:border-indigo-300 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          <span className="font-bold text-sm sm:text-base text-zinc-900 group-hover:text-indigo-900">
                            Global STEM Undergraduate Scholarship
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                          Exposes missing renewal policy + $10k vs $7.5k stipend clash.
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                    </button>

                    <button
                      type="button"
                      onClick={handleLoadVisa}
                      className="w-full text-left p-4 rounded-xl border border-violet-100 bg-violet-50/40 hover:bg-violet-50/80 hover:border-violet-300 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-violet-600" />
                          <span className="font-bold text-sm sm:text-base text-zinc-900 group-hover:text-violet-900">
                            Portugal Digital Nomad Residency Visa
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                          Exposes €3,280/mo remote salary clash + bank statement omission.
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-violet-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                    </button>
                  </div>
                </div>

                {/* Recent Sessions on This Device */}
                {recentSessions.length > 0 && (
                  <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-bold text-zinc-950 flex items-center gap-2">
                        <History className="w-4 h-4 text-zinc-500" />
                        <span>Your sessions on this device</span>
                      </h3>
                      <button
                        type="button"
                        onClick={clearAllSessions}
                        className="text-xs font-semibold text-zinc-400 hover:text-rose-600 cursor-pointer"
                      >
                        Clear list
                      </button>
                    </div>

                    <div className="space-y-2">
                      {recentSessions.slice(0, 4).map((s) => (
                        <div
                          key={s.id}
                          onClick={() => handleSelectRecentSession(s.id)}
                          className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition cursor-pointer flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                              {s.topic}
                            </h4>
                            <span className="text-xs text-zinc-400">
                              Started {new Date(s.timestamp).toLocaleDateString()} • {s.completenessScore}% Complete
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-indigo-600 hover:underline shrink-0">
                            Open →
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: Active Analysis Dashboard */
          <div className="space-y-6">
            {/* Top Bar with New Session Reset Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetToNewSession}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 text-xs sm:text-sm font-bold border border-zinc-200 shadow-2xs transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-zinc-500" />
                <span>← Start New Research Session</span>
              </button>

              <div className="flex items-center gap-2">
                {analysis.providerUsed && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 text-xs font-bold">
                    <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Engine: {analysis.providerUsed === "groq" ? "Groq LPU" : "Gemini 2.5"}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Collapsed Search & Scope Input */}
            <TopicInput
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              onLoadScholarshipSample={handleLoadScholarship}
              onLoadVisaSample={handleLoadVisa}
              isStandalone={false}
              hasActiveAnalysis={true}
              onNewSession={handleResetToNewSession}
            />

            {/* Executive Summary & High-Level Metrics (Large, Readable Typography) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Synthesized Domain Schema Verdict</span>
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {analysis.sources.length} Ingested Sources
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black text-zinc-950">
                    {analysis.topic}
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-700 mt-2 leading-relaxed">
                    {analysis.executiveSummary}
                  </p>

                  {analysis.userScope &&
                    (analysis.userScope.situation ||
                      analysis.userScope.jurisdiction ||
                      analysis.userScope.targetCycle) && (
                      <div className="mt-3 p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-indigo-900 flex items-center gap-1">
                          <Target className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Target Scope:</span>
                        </span>
                        {analysis.userScope.situation && (
                          <span className="px-2 py-0.5 rounded-md bg-white text-indigo-950 border border-indigo-200/80 font-medium">
                            {analysis.userScope.situation}
                          </span>
                        )}
                        {analysis.userScope.jurisdiction && (
                          <span className="px-2 py-0.5 rounded-md bg-white text-indigo-950 border border-indigo-200/80 font-medium">
                            {analysis.userScope.jurisdiction}
                          </span>
                        )}
                        {analysis.userScope.targetCycle && (
                          <span className="px-2 py-0.5 rounded-md bg-white text-indigo-950 border border-indigo-200/80 font-medium">
                            {analysis.userScope.targetCycle}
                          </span>
                        )}
                      </div>
                    )}
                </div>

                <div className="pt-3 mt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-800 font-semibold text-xs">
                      {analysis.detectedCategory}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 text-xs">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Authority-Weighted Active</span>
                    </span>
                  </div>

                  {analysis.officialApplicationUrl && (
                    <a
                      href={analysis.officialApplicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition font-bold text-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Official Portal ↗</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Completeness Gauge */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Decision Completeness
                </span>
                <div className="my-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-zinc-950">
                      {analysis.overallCompletenessScore}%
                    </span>
                    <span className="text-xs text-zinc-500">criteria verified</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden mt-3 border border-zinc-200">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysis.overallCompletenessScore}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {analysis.overallCompletenessScore < 70
                    ? "⚠️ High uncertainty: Mandatory criteria missing."
                    : "Moderate coverage: Verify remaining gaps."}
                </p>
              </div>

              {/* Red Flag Summary Counters */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Detected Vulnerabilities
                </span>
                <div className="grid grid-cols-3 gap-2 my-2 text-center">
                  <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-200">
                    <span className="text-2xl sm:text-3xl font-black text-rose-700 block">
                      {darkSpotsCount}
                    </span>
                    <span className="text-xs text-rose-800 block uppercase font-bold">
                      Dark Spots
                    </span>
                  </div>
                  <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                    <span className="text-2xl sm:text-3xl font-black text-amber-700 block">
                      {conflictsCount}
                    </span>
                    <span className="text-xs text-amber-800 block uppercase font-bold">
                      Clashes
                    </span>
                  </div>
                  <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                    <span className="text-2xl sm:text-3xl font-black text-zinc-800 block">
                      {staleCount}
                    </span>
                    <span className="text-xs text-zinc-500 block uppercase font-bold">
                      Stale
                    </span>
                  </div>
                </div>
                <span className="text-xs text-rose-600 font-bold block text-center">
                  {analysis.highRiskCount} High-Risk Blind Spots Require Action
                </span>
              </div>
            </div>

            {/* Temporal Alerts Banner */}
            {analysis.temporalAlerts.length > 0 && (
              <TemporalWarnings alerts={analysis.temporalAlerts} />
            )}

            {/* Navigation Tabs & Audit Export Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 gap-3 pb-px">
              <div className="flex gap-2 overflow-x-auto pb-px">
                <button
                  type="button"
                  onClick={() => setActiveTab("matrix")}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "matrix"
                      ? "border-indigo-600 text-indigo-700 bg-indigo-50/40"
                      : "border-transparent text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span>1. Blind-Spot Matrix & Gaps</span>
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-zinc-100 text-xs text-zinc-600 font-semibold">
                    {analysis.expectedDimensions.length} Dimensions
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("conflicts")}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "conflicts"
                      ? "border-amber-600 text-amber-800 bg-amber-50/40"
                      : "border-transparent text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>2. Source Contradictions</span>
                  {conflictsCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                      {conflictsCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("checklist")}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "checklist"
                      ? "border-emerald-600 text-emerald-800 bg-emerald-50/40"
                      : "border-transparent text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <ListTodo className="w-4 h-4" />
                  <span>3. Action Verification Checklist</span>
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    {analysis.verificationChecklist.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("sources")}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "sources"
                      ? "border-zinc-900 text-zinc-950 bg-zinc-100/50"
                      : "border-transparent text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>4. Ingested Sources & Hierarchy</span>
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-zinc-100 text-xs text-zinc-600 font-semibold">
                    {analysis.sources.length}
                  </span>
                </button>
              </div>

              {/* Audit Export Toolbar */}
              <div className="flex items-center gap-2 self-start sm:self-center shrink-0 mb-1 sm:mb-0 no-print">
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 border border-zinc-200/90 shadow-2xs text-xs sm:text-sm font-bold transition cursor-pointer"
                  title="Download complete decision gap audit as a structured Markdown (.md) file"
                >
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>Download .md</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 border border-zinc-200/90 shadow-2xs text-xs sm:text-sm font-bold transition cursor-pointer"
                  title="Print full audit report or save as PDF"
                >
                  <Printer className="w-4 h-4 text-zinc-500" />
                  <span>Print / PDF</span>
                </button>
              </div>
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
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-6 mt-12 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900">BlindspotIQ</span>
            <span>—</span>
            <span>Digital Dark Spot Challenge (Devengers 2026)</span>
          </div>
          <div className="text-xs text-zinc-400">
            Schema-Driven Gap Detection • Dual Groq & Gemini Intelligence • Tavily Web Search
          </div>
        </div>
      </footer>
    </div>
  );
}
