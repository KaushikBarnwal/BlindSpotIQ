"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  Globe,
  Loader2,
  ArrowRight,
  FileText,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Target,
  MapPin,
  Calendar,
  UserCheck,
  Cpu,
  Compass,
  RotateCcw,
} from "lucide-react";
import { DirectTextInput, UserScopeContext } from "@/types";

interface TopicInputProps {
  onAnalyze: (
    topic: string,
    urls: string[],
    directTexts?: DirectTextInput[],
    scope?: UserScopeContext,
    useTavilySearch?: boolean,
    provider?: "gemini" | "groq" | "auto"
  ) => void;
  isLoading: boolean;
  onLoadScholarshipSample: () => void;
  onLoadVisaSample: () => void;
  isStandalone?: boolean;
  hasActiveAnalysis?: boolean;
  onNewSession?: () => void;
}

const PIPELINE_STEPS = [
  "Ingesting sources & parsing HTML/PDF/Text documents...",
  "Applying user scope context (situation, jurisdiction, cycle)...",
  "Synthesizing expected decision schema for domain...",
  "Scanning coverage matrix & detecting dark spots...",
  "Cross-referencing factual contradictions & authority tiers...",
  "Auditing temporal freshness & building verification loop...",
];

export function TopicInput({
  onAnalyze,
  isLoading,
  onLoadScholarshipSample,
  onLoadVisaSample,
  isStandalone = false,
  hasActiveAnalysis = false,
  onNewSession,
}: TopicInputProps) {
  const [inputMode, setInputMode] = useState<"tavily" | "url" | "text">("tavily");
  const [isExpanded, setIsExpanded] = useState(isStandalone || !hasActiveAnalysis);
  const [showScope, setShowScope] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"auto" | "gemini" | "groq">("auto");

  const [topic, setTopic] = useState("");

  // User scope context
  const [scope, setScope] = useState<UserScopeContext>({
    situation: "",
    jurisdiction: "",
    targetCycle: "",
  });

  // URL mode state
  const [urls, setUrls] = useState<string[]>([
    "https://globalstem-foundation.org/scholarships/undergrad-2026",
    "https://scholarshipinsider.net/global-stem-requirements-guide",
  ]);

  // Direct Text mode state (Fail-Safe)
  const [directTexts, setDirectTexts] = useState<DirectTextInput[]>([
    {
      title: "Official Foundation Gazette",
      sourceLabel: "Official Award Portal",
      authorityTier: "primary_official",
      content:
        "Global STEM Excellence Scholarship 2026-2027: Award provides $10,000 per academic year for undergraduate students in computing and engineering. Applicants must maintain a minimum 3.5 GPA and submit official transcripts, 2 letters of recommendation, and a statement of purpose. Deadline is November 15, 2026.",
    },
    {
      title: "Student Community Blog",
      sourceLabel: "ScholarshipInsider Guide",
      authorityTier: "third_party_unverified",
      content:
        "Guide: You must mail your physical transcripts by October 1, 2024. The foundation gives $7,500 disbursed across two terms. You only need to provide 1 recommendation letter from your counselor.",
    },
    {
      title: "National Grants Registry",
      sourceLabel: "NationalGrants Database",
      authorityTier: "secondary_aggregator",
      content:
        "Global STEM Scholarship: Award is $10,000. Required documentation: 3 recommendation letters, family tax returns proving income under $75k, and birth certificate. Audited independently.",
    },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % PIPELINE_STEPS.length);
      }, 1600);
    } else {
      setCurrentStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAddUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, ""]);
    }
  };

  const handleRemoveUrl = (index: number) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const handleUrlChange = (index: number, val: string) => {
    const updated = [...urls];
    updated[index] = val;
    setUrls(updated);
  };

  const handleTextChange = (
    index: number,
    field: keyof DirectTextInput,
    val: string
  ) => {
    const updated = [...directTexts];
    updated[index] = { ...updated[index], [field]: val };
    setDirectTexts(updated);
  };

  const handleScopeChange = (field: keyof UserScopeContext, val: string) => {
    setScope((prev) => ({ ...prev, [field]: val }));
  };

  const handleAddTextSnippet = () => {
    if (directTexts.length < 4) {
      setDirectTexts([
        ...directTexts,
        {
          title: `Document #${directTexts.length + 1}`,
          sourceLabel: `Notice #${directTexts.length + 1}`,
          authorityTier: "third_party_unverified",
          content: "",
        },
      ]);
    }
  };

  const handleRemoveTextSnippet = (index: number) => {
    if (directTexts.length > 1) {
      setDirectTexts(directTexts.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    if (!isStandalone) {
      setIsExpanded(false);
    }

    if (inputMode === "tavily") {
      onAnalyze(topic, [], [], scope, true, selectedProvider);
    } else if (inputMode === "url") {
      const cleanUrls = urls.filter((u) => u.trim().length > 0);
      onAnalyze(topic, cleanUrls, [], scope, false, selectedProvider);
    } else {
      const cleanTexts = directTexts.filter((t) => t.content.trim().length > 0);
      onAnalyze(topic, [], cleanTexts, scope, false, selectedProvider);
    }
  };

  const handleSetSampleQuestion = (sampleText: string) => {
    setTopic(sampleText);
  };

  // Compact collapsed bar when active analysis is showing
  if (hasActiveAnalysis && !isExpanded && !isLoading) {
    return (
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-zinc-300">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-600 shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
                Active Research Goal
              </span>
              {scope.situation && (
                <span className="text-xs text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md font-medium truncate max-w-[240px]">
                  🎯 {scope.situation}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-950 truncate max-w-2xl mt-1">
              {topic || "Current Audit In Progress"}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          {onNewSession && (
            <button
              type="button"
              onClick={onNewSession}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 text-xs sm:text-sm font-semibold border border-zinc-200 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-zinc-600" />
              <span>New Search</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Modify Sources & Scope</span>
            <ChevronDown className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-7 shadow-xs relative overflow-hidden space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Topic Input: Large, readable, bold */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm sm:text-base font-bold text-zinc-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-600" />
              <span>What are you trying to verify or find out?</span>
            </label>
            {hasActiveAnalysis && (
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer font-medium"
              >
                <span>Collapse</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Be specific about your situation and criteria. For example:{" "}
            <span
              onClick={() =>
                handleSetSampleQuestion(
                  "What should I verify before applying for the Global STEM scholarship?"
                )
              }
              className="text-indigo-600 hover:underline cursor-pointer font-medium"
            >
              “What should I verify before applying for the Global STEM scholarship?”
            </span>{" "}
            or{" "}
            <span
              onClick={() =>
                handleSetSampleQuestion(
                  "What are the requirements and missing terms for the Portugal Digital Nomad Visa?"
                )
              }
              className="text-indigo-600 hover:underline cursor-pointer font-medium"
            >
              “What are the missing terms and income limits for the Digital Nomad Visa?”
            </span>
          </p>

          <textarea
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Am I eligible for the state STEM merit scholarship as a second-year student, and what is this cycle's renewal GPA and deadline?"
            required
            className="w-full bg-zinc-50/80 border border-zinc-200 rounded-xl p-3.5 sm:p-4 text-zinc-900 placeholder-zinc-400 text-sm sm:text-base font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition leading-relaxed resize-none shadow-2xs"
          />
        </div>

        {/* Feature 1: User Scope & Decision Context Accordion */}
        <div className="border border-zinc-200 rounded-xl bg-zinc-50/50 p-4 space-y-3">
          <button
            type="button"
            onClick={() => setShowScope(!showScope)}
            className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-zinc-800 hover:text-zinc-950 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Target Scope & Context (Optional)</span>
              <span className="text-xs text-zinc-500 font-normal hidden sm:inline">
                — Personalizes gap checks to your exact profile & cycle
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <span>{showScope ? "Hide Details" : "Add Profile / Year"}</span>
              {showScope ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {showScope && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-zinc-200">
              <div>
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5 mb-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Your Situation / Major</span>
                </label>
                <input
                  type="text"
                  value={scope.situation || ""}
                  onChange={(e) => handleScopeChange("situation", e.target.value)}
                  placeholder="e.g. 2nd-year CS undergraduate"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-violet-500" />
                  <span>Jurisdiction / Region</span>
                </label>
                <input
                  type="text"
                  value={scope.jurisdiction || ""}
                  onChange={(e) => handleScopeChange("jurisdiction", e.target.value)}
                  placeholder="e.g. California, USA or National"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Target Cycle / Year</span>
                </label>
                <input
                  type="text"
                  value={scope.targetCycle || ""}
                  onChange={(e) => handleScopeChange("targetCycle", e.target.value)}
                  placeholder="e.g. 2026–2027 Cycle"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Ingestion Method Tabs: Tavily Search | Custom URLs | Direct Text */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <span className="text-xs sm:text-sm font-bold text-zinc-800">
              Source Material Collection:
            </span>

            {/* AI Provider selector */}
            <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs">
              <span className="text-zinc-500 px-1.5 font-medium flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-zinc-600" />
                <span>AI Engine:</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedProvider("auto")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  selectedProvider === "auto"
                    ? "bg-white text-zinc-950 shadow-2xs border border-zinc-200/80"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Auto (Dual)
              </button>
              <button
                type="button"
                onClick={() => setSelectedProvider("gemini")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  selectedProvider === "gemini"
                    ? "bg-white text-zinc-950 shadow-2xs border border-zinc-200/80"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Gemini 2.5
              </button>
              <button
                type="button"
                onClick={() => setSelectedProvider("groq")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  selectedProvider === "groq"
                    ? "bg-white text-zinc-950 shadow-2xs border border-zinc-200/80"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Groq LPU
              </button>
            </div>
          </div>

          <div className="flex items-center bg-zinc-100 border border-zinc-200/90 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => setInputMode("tavily")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                inputMode === "tavily"
                  ? "bg-white text-indigo-700 shadow-xs border border-zinc-200/80"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Auto-Discover with Tavily AI</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-bold uppercase hidden md:inline">
                Automated
              </span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode("url")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                inputMode === "url"
                  ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/80"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Globe className="w-4 h-4 text-zinc-600" />
              <span>Custom Web / PDF URLs</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode("text")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                inputMode === "text"
                  ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/80"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Direct Text Paste</span>
            </button>
          </div>
        </div>

        {/* MODE A: Tavily Auto-Search Explainer */}
        {inputMode === "tavily" && (
          <div className="bg-indigo-50/40 border border-indigo-200/70 rounded-xl p-4 text-xs sm:text-sm text-indigo-950 space-y-1.5">
            <div className="font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Automated Web Search Enabled</span>
            </div>
            <p className="text-zinc-600 leading-relaxed">
              BlindspotIQ will automatically search official portals, registries, and university notices for{" "}
              <strong>&ldquo;{topic || "your question"}&rdquo;</strong> using Tavily AI Search. You do not need to provide manual URLs.
            </p>
          </div>
        )}

        {/* MODE B: URL Scraper Inputs */}
        {inputMode === "url" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-zinc-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Globe className="w-4 h-4 text-zinc-500" />
                <span>Target Web / PDF URLs (Up to 5)</span>
              </label>
              {urls.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add URL</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {urls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-500 w-7 text-center font-bold">
                    #{idx + 1}
                  </span>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(idx, e.target.value)}
                    placeholder="https://official-portal.gov/requirements.html or PDF url"
                    className="flex-1 bg-zinc-50/80 border border-zinc-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-hidden focus:border-indigo-500 font-mono"
                  />
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(idx)}
                      className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Remove source"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODE C: Direct Text Paste Inputs */}
        {inputMode === "text" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-zinc-800 flex items-center gap-1.5 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Pasted Notice / Circular Text</span>
              </label>
              {directTexts.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddTextSnippet}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Document</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {directTexts.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-50/80 border border-zinc-200 rounded-xl p-3.5 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-500 font-bold">
                      DOCUMENT #{idx + 1}
                    </span>
                    {directTexts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTextSnippet(idx)}
                        className="text-zinc-400 hover:text-rose-600 transition"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleTextChange(idx, "title", e.target.value)}
                    placeholder="Document Title"
                    className="w-full bg-white border border-zinc-200 rounded px-2.5 py-1.5 text-xs font-bold text-zinc-900"
                  />

                  <textarea
                    rows={4}
                    value={item.content}
                    onChange={(e) => handleTextChange(idx, "content", e.target.value)}
                    placeholder="Paste excerpt or notice text here..."
                    className="w-full bg-white border border-zinc-200 rounded p-2 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:border-indigo-500 resize-none font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Progressive Pipeline Feedback */}
        {isLoading && (
          <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-indigo-900 font-bold">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>{PIPELINE_STEPS[currentStepIndex]}</span>
              </div>
              <span className="text-indigo-600 font-mono text-xs font-bold">
                Step {currentStepIndex + 1}/{PIPELINE_STEPS.length}
              </span>
            </div>
            <div className="w-full bg-indigo-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-500"
                style={{
                  width: `${((currentStepIndex + 1) / PIPELINE_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Submit Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-100">
          <div className="text-xs sm:text-sm text-zinc-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {inputMode === "tavily"
                ? "Tavily AI searches official web sources in real time"
                : inputMode === "url"
                ? "Live URL scraping & PDF parsing active"
                : "Direct text mode guarantees instant analysis without external network"}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold px-7 py-3 rounded-xl text-sm flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-50 transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing Dark Spots & Clashes...</span>
              </>
            ) : (
              <>
                <span>Run Gap & Contradiction Audit</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
