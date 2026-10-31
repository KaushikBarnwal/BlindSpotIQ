"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  Globe,
  Loader2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Target,
  MapPin,
  Calendar,
  UserCheck,
  Cpu,
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
  providerUsed?: "gemini" | "groq";
}

const PIPELINE_STEPS = [
  "Searching web and parsing documents...",
  "Applying your background and target cycle...",
  "Synthesizing complete application requirements...",
  "Detecting missing dark spots and omitted terms...",
  "Cross-checking conflicting numbers and rules...",
  "Generating actionable next-steps checklist...",
];

export function TopicInput({
  onAnalyze,
  isLoading,
  onLoadScholarshipSample,
  onLoadVisaSample,
  isStandalone = false,
  hasActiveAnalysis = false,
  onNewSession,
  providerUsed,
}: TopicInputProps) {
  const [inputMode, setInputMode] = useState<"tavily" | "url" | "text">("tavily");
  const [isExpanded, setIsExpanded] = useState(isStandalone || !hasActiveAnalysis);
  const [selectedProvider, setSelectedProvider] = useState<"auto" | "gemini" | "groq">("auto");

  const [topic, setTopic] = useState("");

  // User scope context
  const [scope, setScope] = useState<UserScopeContext>({
    situation: "",
    jurisdiction: "",
    targetCycle: "",
  });

  // URL mode state: clean and blank by default with helpful placeholders
  const [urls, setUrls] = useState<string[]>(["", ""]);

  // Direct Text mode state: 2 clean document slots by default (expandable with + Add Document)
  const [directTexts, setDirectTexts] = useState<DirectTextInput[]>([
    {
      title: "",
      sourceLabel: "Document #1",
      authorityTier: "primary_official",
      content: "",
    },
    {
      title: "",
      sourceLabel: "Document #2",
      authorityTier: "secondary_aggregator",
      content: "",
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
    if (directTexts.length < 6) {
      setDirectTexts([
        ...directTexts,
        {
          title: "",
          sourceLabel: `Document #${directTexts.length + 1}`,
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
                Active Audit
              </span>
              {providerUsed && (
                <span className="text-xs text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 border border-zinc-200">
                  <Cpu className="w-3 h-3 text-indigo-500" />
                  <span>{providerUsed === "groq" ? "Groq LPU" : "Gemini 2.5"}</span>
                </span>
              )}
              {scope.situation && (
                <span className="text-xs text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md font-medium truncate max-w-[220px]">
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
              <ArrowLeft className="w-4 h-4 text-zinc-600" />
              <span>New Search</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Modify Scope & Sources</span>
            <ChevronDown className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-7 shadow-xs relative overflow-hidden space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Topic Input: Clean, humanized, friendly */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-base sm:text-lg font-bold text-zinc-950 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              <span>What are you applying for or checking?</span>
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

          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Enter a scholarship, visa, grant, or policy to check for missing requirements and contradictions.
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-500 font-medium">Quick examples:</span>
            <button
              type="button"
              onClick={() =>
                handleSetSampleQuestion(
                  "What should I verify before applying for the Global STEM scholarship?"
                )
              }
              className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/70 transition cursor-pointer font-medium"
            >
              Global STEM Scholarship
            </button>
            <button
              type="button"
              onClick={() =>
                handleSetSampleQuestion(
                  "What are the missing terms and income limits for the Portugal Digital Nomad Visa?"
                )
              }
              className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200/70 transition cursor-pointer font-medium"
            >
              Portugal Nomad Visa
            </button>
          </div>

          <textarea
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. What are the missing requirements, renewal rules, and income limits for the Portugal Nomad Visa?"
            required
            className="w-full bg-zinc-50/80 border border-zinc-200 rounded-xl p-3.5 sm:p-4 text-zinc-900 placeholder-zinc-400 text-sm sm:text-base font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition leading-relaxed resize-none shadow-2xs mt-1"
          />
        </div>

        {/* User Scope & Personal Context: Always Open by Default without Hide Details toggle */}
        <div className="border border-zinc-200 rounded-xl bg-zinc-50/60 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-zinc-900">
              Target profile &amp; cycle (optional)
            </span>
            <span className="text-xs text-zinc-500 font-normal hidden sm:inline">
              — Personalizes checks to your major, state, or year
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-zinc-200/80">
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
        </div>

        {/* Clean Source Selection Pills */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-zinc-800">
              How would you like to provide sources?
            </span>
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
              <span>Auto Web Search</span>
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
              <span>Paste Links</span>
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
              <span>Paste Text</span>
            </button>
          </div>
        </div>

        {/* MODE A: Auto Search Note */}
        {inputMode === "tavily" && (
          <p className="text-xs text-zinc-500 leading-relaxed px-1">
            BlindspotIQ will automatically search official portals, registries, and announcements for your query.
          </p>
        )}

        {/* MODE B: URL Scraper Inputs (Blank by default with clean placeholders) */}
        {inputMode === "url" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-zinc-800 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-zinc-500" />
                <span>Web or PDF Links (Up to 5)</span>
              </label>
              {urls.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
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
                    placeholder={
                      idx === 0
                        ? "https://official-portal.gov/requirements.html"
                        : "https://secondary-source.org/policy-notice.html"
                    }
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

        {/* MODE C: Direct Text Paste Inputs in Clean 2x2 Grid */}
        {inputMode === "text" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-zinc-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Pasted Notice / Document Text</span>
              </label>
              {directTexts.length < 6 && (
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

            {/* 2x2 Grid for balanced layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {directTexts.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-50/80 border border-zinc-200 rounded-xl p-4 space-y-2.5 relative shadow-2xs hover:border-zinc-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-wider">
                      DOCUMENT #{idx + 1}
                    </span>
                    {directTexts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTextSnippet(idx)}
                        className="text-zinc-400 hover:text-rose-600 transition cursor-pointer p-1 rounded"
                        title="Remove document"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleTextChange(idx, "title", e.target.value)}
                    placeholder={`Document Title (e.g. Official Gazette #${idx + 1})`}
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-bold text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-indigo-500"
                  />

                  <textarea
                    rows={4}
                    value={item.content}
                    onChange={(e) => handleTextChange(idx, "content", e.target.value)}
                    placeholder="Paste notice, guidelines, or circular excerpt here..."
                    className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:border-indigo-500 resize-none font-mono leading-relaxed"
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
          {/* Subtle AI Engine selection */}
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="font-semibold text-zinc-600 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-zinc-500" />
              <span>AI Engine:</span>
            </span>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as any)}
              className="bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs font-bold text-zinc-800 cursor-pointer focus:outline-hidden"
            >
              <option value="auto">Auto (Gemini + Groq)</option>
              <option value="gemini">Gemini 2.5 Flash</option>
              <option value="groq">Groq LPU</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold px-7 py-3 rounded-xl text-sm flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-50 transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing Information...</span>
              </>
            ) : (
              <>
                <span>Audit Information →</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}