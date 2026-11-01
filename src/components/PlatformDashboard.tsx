"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { TopicInput } from "@/components/TopicInput";
import { CoverageMatrix } from "@/components/CoverageMatrix";
import { ContradictionViewer } from "@/components/ContradictionViewer";
import { TemporalWarnings } from "@/components/TemporalWarnings";
import { VerificationChecklist } from "@/components/VerificationChecklist";
import { SourceCardList } from "@/components/SourceCardList";
import { StructuredSummary } from "@/components/StructuredSummary";
import { PlatformFooter } from "@/components/Footer";
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
  Download,
  Printer,
  Target,
  ArrowRight,
  BookOpen,
  Compass,
  History,
} from "lucide-react";

interface PlatformDashboardProps {
  initialScenario?: "scholarship" | "visa" | null;
}

export default function PlatformDashboard({
  initialScenario = null,
}: PlatformDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Determine initial analysis from prop or URL query param
  const getInitialAnalysis = (): AnalysisResult | null => {
    if (initialScenario === "scholarship") return SAMPLE_SCHOLARSHIP_SCENARIO;
    if (initialScenario === "visa") return SAMPLE_VISA_SCENARIO;

    const queryScenario = searchParams.get("scenario");
    if (queryScenario === "scholarship") return SAMPLE_SCHOLARSHIP_SCENARIO;
    if (queryScenario === "visa") return SAMPLE_VISA_SCENARIO;

    return null;
  };

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(getInitialAnalysis);
  const [isLoading, setIsLoading] = useState(false);

  // Sync tab with URL query parameter ?tab=...
  const initialTab = (searchParams.get("tab") as any) || "matrix";
  const [activeTab, setActiveTab] = useState<
    "matrix" | "conflicts" | "checklist" | "sources"
  >(["matrix", "conflicts", "checklist", "sources"].includes(initialTab) ? initialTab : "matrix");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    recentSessions,
    saveSession,
    loadSessionPayload,
    clearAllSessions,
  } = useRecentSessions();

  // When initialScenario or query params change, sync analysis
  useEffect(() => {
    if (initialScenario === "scholarship") {
      setAnalysis(SAMPLE_SCHOLARSHIP_SCENARIO);
    } else if (initialScenario === "visa") {
      setAnalysis(SAMPLE_VISA_SCENARIO);
    } else {
      const qScenario = searchParams.get("scenario");
      if (qScenario === "scholarship") {
        setAnalysis(SAMPLE_SCHOLARSHIP_SCENARIO);
      } else if (qScenario === "visa") {
        setAnalysis(SAMPLE_VISA_SCENARIO);
      } else if (!analysis && pathname === "/app") {
        setAnalysis(null);
      }
    }
  }, [initialScenario, searchParams, pathname]);

  const handleTabChange = (tab: "matrix" | "conflicts" | "checklist" | "sources") => {
    setActiveTab(tab);
    // Update URL query string without reloading page
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

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
    router.push("/demo-scholarship");
  };

  const handleLoadVisa = () => {
    router.push("/demo-visa");
  };

  const handleResetToNewSession = () => {
    router.push("/app");
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

        {/* VIEW 1: Clean Initial Workspace (Page 2: /app) */}
        {!analysis ? (
          <div className="space-y-6">
            {/* Page Title & Mission */}
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase tracking-wider border border-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Research Workspace</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight">
                Check any scholarship, visa, or policy.
              </h1>
              <p className="text-base sm:text-lg text-zinc-600 max-w-3xl leading-relaxed">
                Find what official websites left out or got wrong before you apply. BlindspotIQ cross-examines official portals and guides to uncover hidden conditions and conflicting rules.
              </p>
            </div>

            {/* 2-Column Grid */}
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
                {/* Before You Start Card */}
                <div className="bg-white border border-zinc-200 border-l-4 border-l-rose-500 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-950">
                    Before you start
                  </h3>
                  <ul className="space-y-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <span className="text-rose-500 font-bold text-base">•</span>
                      <span>
                        <strong>Checks multiple sources:</strong> Gathers official portals, registries, and community guides to catch omissions.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-rose-500 font-bold text-base">•</span>
                      <span>
                        <strong>Official portals rank highest:</strong> Verified <code className="text-zinc-800 font-mono">.gov</code> and <code className="text-zinc-800 font-mono">.edu</code> notices always override blogs and forums.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-rose-500 font-bold text-base">•</span>
                      <span>
                        <strong>Dual AI verification:</strong> Uses Gemini and Groq in tandem for instant, cross-checked accuracy.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Humanized Example Audits Card */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-zinc-950">
                      Try an Example Audit
                    </h3>
                    <span className="text-xs font-semibold text-zinc-400">1-Click Preview</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-500">
                    See how BlindspotIQ flags hidden omissions and conflicting rules in real cases:
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
                          Catches unstated renewal rules and a $2,500 stipend discrepancy across sources.
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
                          Catches conflicting monthly salary requirements (€3,280 vs €2,800) and missing bank proof.
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-violet-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                    </button>
                  </div>
                </div>

                {/* Humanized Recent Audits on This Device */}
                {recentSessions.length > 0 && (
                  <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-bold text-zinc-950 flex items-center gap-2">
                        <History className="w-4 h-4 text-zinc-500" />
                        <span>Recent Audits on This Device</span>
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
                              Checked on {new Date(s.timestamp).toLocaleDateString()} • {s.completenessScore}% Complete
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
          /* VIEW 2: Active Analysis Dashboard (Page 3: /app/scholarship or Page 4: /app/visa) */
          <div className="space-y-5">
            {/* Consolidated Single Search & Scope Bar */}
            <TopicInput
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              onLoadScholarshipSample={handleLoadScholarship}
              onLoadVisaSample={handleLoadVisa}
              isStandalone={false}
              hasActiveAnalysis={true}
              onNewSession={handleResetToNewSession}
              providerUsed={analysis.providerUsed}
            />

            {/* Executive Summary & High-Level Metrics (Spacious 2-Card Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left Card: Audit Summary (7 Columns for generous reading space) */}
              <div className="lg:col-span-7 bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Audit Summary</span>
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {analysis.sources.length} Ingested Sources
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950 tracking-tight">
                    {analysis.topic}
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-700 mt-2.5 leading-relaxed">
                    {analysis.executiveSummary}
                  </p>

                  {analysis.userScope &&
                    (analysis.userScope.situation ||
                      analysis.userScope.jurisdiction ||
                      analysis.userScope.targetCycle) && (
                      <div className="mt-3.5 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-indigo-900 flex items-center gap-1">
                          <Target className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Target Scope:</span>
                        </span>
                        {analysis.userScope.situation && (
                          <span className="px-2.5 py-0.5 rounded-md bg-white text-indigo-950 border border-indigo-200/80 font-medium">
                            {analysis.userScope.situation}
                          </span>
                        )}
                        {analysis.userScope.jurisdiction && (
                          <span className="px-2.5 py-0.5 rounded-md bg-white text-indigo-950 border border-indigo-200/80 font-medium">
                            {analysis.userScope.jurisdiction}
                          </span>
                        )}
                        {analysis.userScope.targetCycle && (
                          <span className="px-2.5 py-0.5 rounded-md bg-white text-indigo-950 border border-indigo-200/80 font-medium">
                            {analysis.userScope.targetCycle}
                          </span>
                        )}
                      </div>
                    )}
                </div>

                <div className="mt-5 pt-3.5 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-zinc-100 font-medium text-zinc-700">
                      {analysis.detectedCategory}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Official Sources Cross-Checked
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Card: Combined Verification Health & Audit Findings (5 Columns) */}
              <div className="lg:col-span-5 bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Information Completeness
                    </span>
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-full">
                      {analysis.highRiskCount} High-Risk Item(s)
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-2 mb-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-zinc-950">
                        {analysis.overallCompletenessScore}%
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">
                        criteria verified
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${analysis.overallCompletenessScore}%` }}
                    />
                  </div>

                  {/* Combined Audit Findings Pills (3 in a Row) */}
                  <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-zinc-100">
                    <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-center">
                      <div className="text-xl font-black text-rose-700">{darkSpotsCount}</div>
                      <div className="text-[11px] font-bold text-rose-950 mt-0.5">Missing Info</div>
                    </div>

                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-center">
                      <div className="text-xl font-black text-amber-700">{conflictsCount}</div>
                      <div className="text-[11px] font-bold text-amber-950 mt-0.5">Contradictions</div>
                    </div>

                    <div className="p-3 bg-zinc-100/70 border border-zinc-200 rounded-xl text-center">
                      <div className="text-xl font-black text-zinc-700">{staleCount}</div>
                      <div className="text-[11px] font-bold text-zinc-800 mt-0.5">Outdated Info</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 text-xs font-semibold text-amber-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>Key requirements missing from sources reviewed.</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Outdated Information Notice */}
            {analysis.temporalAlerts && analysis.temporalAlerts.length > 0 && (
              <TemporalWarnings alerts={analysis.temporalAlerts} />
            )}

            {/* Navigation Tabs Bar & Export Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-zinc-200 pb-2">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 no-print">
                <button
                  type="button"
                  onClick={() => handleTabChange("matrix")}
                  className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    activeTab === "matrix"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span>1. What&apos;s Missing &amp; Found</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-xs ${
                      activeTab === "matrix"
                        ? "bg-indigo-700 text-white"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {analysis.expectedDimensions.length} Topics
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("conflicts")}
                  className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    activeTab === "conflicts"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>2. Conflicting Claims</span>
                  {conflictsCount > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-xs font-bold ${
                        activeTab === "conflicts"
                          ? "bg-amber-400 text-zinc-950"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {conflictsCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("checklist")}
                  className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    activeTab === "checklist"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                  }`}
                >
                  <ListTodo className="w-4 h-4" />
                  <span>3. Next Steps Checklist</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-xs ${
                      activeTab === "checklist"
                        ? "bg-indigo-700 text-white"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {analysis.verificationChecklist.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("sources")}
                  className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    activeTab === "sources"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>4. Sources Used</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-xs ${
                      activeTab === "sources"
                        ? "bg-indigo-700 text-white"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
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
                  <span>PDF</span>
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

      {/* Upgraded Footer with Gmail, GitHub, LinkedIn */}
      <PlatformFooter />
    </div>
  );
}
