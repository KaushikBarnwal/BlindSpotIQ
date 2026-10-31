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
} from "lucide-react";
import { DirectTextInput, UserScopeContext } from "@/types";

interface TopicInputProps {
  onAnalyze: (
    topic: string,
    urls: string[],
    directTexts?: DirectTextInput[],
    scope?: UserScopeContext
  ) => void;
  isLoading: boolean;
  onLoadScholarshipSample: () => void;
  onLoadVisaSample: () => void;
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
}: TopicInputProps) {
  const [inputMode, setInputMode] = useState<"url" | "text">("url");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScope, setShowScope] = useState(false);
  const [topic, setTopic] = useState(
    "What should I verify before applying for the Global STEM scholarship?"
  );

  // User scope context
  const [scope, setScope] = useState<UserScopeContext>({
    situation: "2nd-Year Undergraduate, CS Major",
    jurisdiction: "United States (National)",
    targetCycle: "2026–2027 Academic Year",
  });

  // URL mode state
  const [urls, setUrls] = useState<string[]>([
    "https://globalstem-foundation.org/scholarships/undergrad-2026",
    "https://scholarshipinsider.net/global-stem-requirements-guide",
    "https://nationalgrantsportal.edu/database/stem-awards-view",
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
      setCurrentStepIndex(0);
      interval = setInterval(() => {
        setCurrentStepIndex((prev) =>
          prev < PIPELINE_STEPS.length - 1 ? prev + 1 : prev
        );
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAddUrl = () => {
    if (urls.length < 5) setUrls([...urls, ""]);
  };

  const handleRemoveUrl = (index: number) => {
    if (urls.length > 1) setUrls(urls.filter((_, i) => i !== index));
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
    setIsExpanded(false);
    if (inputMode === "url") {
      const cleanUrls = urls.filter((u) => u.trim().length > 0);
      onAnalyze(topic, cleanUrls, [], scope);
    } else {
      const cleanTexts = directTexts.filter((t) => t.content.trim().length > 0);
      onAnalyze(topic, [], cleanTexts, scope);
    }
  };

  const handleScholarshipPreset = () => {
    setTopic("What should I verify before applying for the Global STEM scholarship?");
    setScope({
      situation: "2nd-Year Undergraduate, CS Major",
      jurisdiction: "United States (National)",
      targetCycle: "2026–2027 Academic Year",
    });
    onLoadScholarshipSample();
  };

  const handleVisaPreset = () => {
    setTopic("What are the requirements and missing terms for the Portugal Digital Nomad Visa?");
    setScope({
      situation: "Remote Software Contractor with foreign clients",
      jurisdiction: "Portugal / Schengen Area",
      targetCycle: "2026 Residency Window",
    });
    onLoadVisaSample();
  };

  if (!isExpanded && !isLoading) {
    const activeCount =
      inputMode === "url"
        ? urls.filter((u) => u.trim().length > 0).length
        : directTexts.filter((t) => t.content.trim().length > 0).length;

    return (
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all hover:border-zinc-300">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-600 shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                Active Objective
              </span>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                • {activeCount} {inputMode === "url" ? "URLs" : "Documents"} Ingested
              </span>
              {scope.situation && (
                <span className="text-[10px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md font-medium truncate max-w-[200px] hidden lg:inline">
                  🎯 {scope.situation}
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-zinc-950 truncate max-w-xl mt-0.5">
              {topic}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <div className="flex items-center gap-1.5 bg-zinc-100/80 border border-zinc-200 px-2 py-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={handleScholarshipPreset}
              className="text-[11px] text-zinc-600 hover:text-zinc-950 px-1.5 py-0.5 rounded hover:bg-white transition cursor-pointer"
            >
              Scholarship
            </button>
            <span className="text-zinc-300">|</span>
            <button
              type="button"
              onClick={handleVisaPreset}
              className="text-[11px] text-zinc-600 hover:text-zinc-950 px-1.5 py-0.5 rounded hover:bg-white transition cursor-pointer"
            >
              Visa
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 text-xs font-semibold border border-zinc-200 transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            <span>Modify Sources & Scope</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs relative overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Topic Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-zinc-800 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-indigo-600" />
              <span>Research Objective / High-Stakes Decision Goal</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleScholarshipPreset}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                Sample Scholarship
              </button>
              <span className="text-zinc-300">|</span>
              <button
                type="button"
                onClick={handleVisaPreset}
                className="text-xs text-violet-600 hover:text-violet-800 font-semibold cursor-pointer"
              >
                Sample Visa
              </button>
              <span className="text-zinc-300">|</span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer font-medium"
              >
                <span>Collapse</span>
                <ChevronUp className="w-3 h-3" />
              </button>
            </div>
          </div>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. What should I verify before applying for this scholarship or visa?"
            required
            className="w-full bg-zinc-50/80 border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 placeholder-zinc-400 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        {/* Feature 1: User Scope & Decision Context Accordion */}
        <div className="border border-zinc-200 rounded-xl bg-zinc-50/50 p-3 space-y-2">
          <button
            type="button"
            onClick={() => setShowScope(!showScope)}
            className="w-full flex items-center justify-between text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>Target Scope & Context (Optional)</span>
              <span className="text-[10px] text-zinc-400 font-normal">
                — Personalizes gap checks to your situation & year
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-500">
              <span>{showScope ? "Hide Scope" : "Customize Scope"}</span>
              {showScope ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          </button>

          {showScope && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-zinc-200/80">
              <div>
                <label className="text-[11px] font-semibold text-zinc-600 flex items-center gap-1 mb-1">
                  <UserCheck className="w-3 h-3 text-indigo-500" />
                  <span>Your Situation</span>
                </label>
                <input
                  type="text"
                  value={scope.situation || ""}
                  onChange={(e) => handleScopeChange("situation", e.target.value)}
                  placeholder="e.g. 2nd-year CS undergraduate"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-600 flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-violet-500" />
                  <span>Jurisdiction / Region</span>
                </label>
                <input
                  type="text"
                  value={scope.jurisdiction || ""}
                  onChange={(e) => handleScopeChange("jurisdiction", e.target.value)}
                  placeholder="e.g. California, USA or National"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-600 flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-emerald-500" />
                  <span>Target Cycle / Year</span>
                </label>
                <input
                  type="text"
                  value={scope.targetCycle || ""}
                  onChange={(e) => handleScopeChange("targetCycle", e.target.value)}
                  placeholder="e.g. 2026–2027 Cycle"
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Ingestion Mode Switcher */}
        <div className="flex items-center justify-between border-t border-b border-zinc-100 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-700">
              Ingestion Method:
            </span>
            <div className="flex items-center bg-zinc-100 border border-zinc-200/80 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setInputMode("url")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  inputMode === "url"
                    ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/60"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>Web / PDF URLs</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode("text")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  inputMode === "text"
                    ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/60"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Direct Notice / Text Paste</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded uppercase font-bold">
                  Fail-Safe
                </span>
              </button>
            </div>
          </div>

          <span className="text-[11px] text-zinc-400 hidden sm:inline">
            {inputMode === "url"
              ? "Live extraction with HTML Readability & PDF parser"
              : "Paste circular text directly (immune to network & paywalls)"}
          </span>
        </div>

        {/* MODE A: URL Scraper Inputs */}
        {inputMode === "url" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>Target Sources to Compare & Gap-Analyze (Up to 5 URLs)</span>
              </label>
              {urls.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="text-xs text-zinc-700 hover:text-zinc-950 flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200/80 px-2.5 py-1 rounded-md transition font-medium cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add URL</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {urls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400 w-6 text-center font-bold">
                    #{idx + 1}
                  </span>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(idx, e.target.value)}
                    placeholder="https://example.com/guidelines.html or https://example.com/circular.pdf"
                    className="flex-1 bg-zinc-50/80 border border-zinc-200 rounded-lg px-3.5 py-2 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
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

        {/* MODE B: Direct Text Paste Inputs (Fail-Safe Mode) */}
        {inputMode === "text" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pasted Source Documents / Policy Circulars</span>
              </label>
              {directTexts.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddTextSnippet}
                  className="text-xs text-zinc-700 hover:text-zinc-950 flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200/80 px-2.5 py-1 rounded-md transition font-medium cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Another Text Block</span>
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
                    <span className="text-[10px] font-mono text-zinc-500 font-bold">
                      SOURCE #{idx + 1}
                    </span>
                    {directTexts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTextSnippet(idx)}
                        className="text-zinc-400 hover:text-rose-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      handleTextChange(idx, "title", e.target.value)
                    }
                    placeholder="Document Title (e.g. Official Gazette)"
                    className="w-full bg-white border border-zinc-200 rounded px-2.5 py-1 text-xs text-zinc-900 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />

                  <div className="flex items-center gap-2">
                    <select
                      value={item.authorityTier}
                      onChange={(e) =>
                        handleTextChange(
                          idx,
                          "authorityTier",
                          e.target.value as any
                        )
                      }
                      className="bg-white border border-zinc-200 rounded px-2 py-0.5 text-[11px] text-zinc-700 w-full"
                    >
                      <option value="primary_official">
                        Primary Official (95% Trust)
                      </option>
                      <option value="secondary_aggregator">
                        Secondary Registry (70% Trust)
                      </option>
                      <option value="third_party_unverified">
                        Third-Party Guide (35% Trust)
                      </option>
                    </select>
                  </div>

                  <textarea
                    rows={4}
                    value={item.content}
                    onChange={(e) =>
                      handleTextChange(idx, "content", e.target.value)
                    }
                    placeholder="Paste text excerpt or circular content here..."
                    className="w-full bg-white border border-zinc-200 rounded p-2 text-[11px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Progressive Pipeline Feedback */}
        {isLoading && (
          <div className="bg-indigo-50/50 border border-indigo-200/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>{PIPELINE_STEPS[currentStepIndex]}</span>
              </div>
              <span className="text-zinc-500 font-mono text-[11px] font-bold">
                Step {currentStepIndex + 1}/{PIPELINE_STEPS.length}
              </span>
            </div>
            <div className="w-full bg-indigo-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-500"
                style={{
                  width: `${
                    ((currentStepIndex + 1) / PIPELINE_STEPS.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-zinc-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {inputMode === "url"
                ? "Live multi-source ingestion active"
                : "Direct text mode guarantees 100% demo uptime"}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm disabled:opacity-50 transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning Dark Spots...</span>
              </>
            ) : (
              <>
                <span>Detect Gaps & Clashes</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
