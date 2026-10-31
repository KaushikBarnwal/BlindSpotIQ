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
} from "lucide-react";
import { DirectTextInput } from "@/types";

interface TopicInputProps {
  onAnalyze: (topic: string, urls: string[], directTexts?: DirectTextInput[]) => void;
  isLoading: boolean;
  onLoadScholarshipSample: () => void;
  onLoadVisaSample: () => void;
}

const PIPELINE_STEPS = [
  "Ingesting sources & parsing HTML/PDF/Text documents...",
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
  const [topic, setTopic] = useState(
    "What should I verify before applying for the Global STEM scholarship?"
  );

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
      }, 1600);
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
    if (inputMode === "url") {
      const cleanUrls = urls.filter((u) => u.trim().length > 0);
      onAnalyze(topic, cleanUrls, []);
    } else {
      const cleanTexts = directTexts.filter((t) => t.content.trim().length > 0);
      onAnalyze(topic, [], cleanTexts);
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Topic Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Search className="w-4 h-4 text-rose-400" />
              <span>Research Objective / High-Stakes Decision Goal</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onLoadScholarshipSample}
                className="text-xs text-rose-400 hover:text-rose-300 underline font-medium cursor-pointer"
              >
                Sample Scholarship
              </button>
              <span className="text-zinc-600">|</span>
              <button
                type="button"
                onClick={onLoadVisaSample}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
              >
                Sample Visa
              </button>
            </div>
          </div>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. What should I verify before applying for this scholarship or visa?"
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition"
          />
        </div>

        {/* Ingestion Mode Switcher */}
        <div className="flex items-center justify-between border-t border-b border-zinc-800 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-300">
              Ingestion Method:
            </span>
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setInputMode("url")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition ${
                  inputMode === "url"
                    ? "bg-rose-500 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Web / PDF URLs</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode("text")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition ${
                  inputMode === "text"
                    ? "bg-rose-500 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Direct Notice / Text Paste</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded uppercase">
                  Fail-Safe
                </span>
              </button>
            </div>
          </div>

          <span className="text-[11px] text-zinc-500 hidden sm:inline">
            {inputMode === "url"
              ? "Live extraction with HTML Readability & PDF parser"
              : "Paste circular text directly (immune to network & paywalls)"}
          </span>
        </div>

        {/* MODE A: URL Scraper Inputs */}
        {inputMode === "url" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>Target Sources to Compare & Gap-Analyze (Up to 5 URLs)</span>
              </label>
              {urls.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-md transition font-medium cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add URL</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {urls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-500 w-6 text-center">
                    #{idx + 1}
                  </span>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(idx, e.target.value)}
                    placeholder="https://example.com/guidelines.html or https://example.com/circular.pdf"
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(idx)}
                      className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition cursor-pointer"
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
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pasted Source Documents / Policy Circulars</span>
              </label>
              {directTexts.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddTextSnippet}
                  className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-md transition font-medium cursor-pointer"
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
                  className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500">
                      SOURCE #{idx + 1}
                    </span>
                    {directTexts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTextSnippet(idx)}
                        className="text-zinc-600 hover:text-rose-400"
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
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 font-semibold focus:outline-none"
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
                      className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-[11px] text-zinc-300 w-full"
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
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-[11px] text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Progressive Pipeline Feedback */}
        {isLoading && (
          <div className="bg-zinc-950 border border-rose-500/30 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{PIPELINE_STEPS[currentStepIndex]}</span>
              </div>
              <span className="text-zinc-500 font-mono text-[11px]">
                Step {currentStepIndex + 1}/{PIPELINE_STEPS.length}
              </span>
            </div>
            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-500"
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
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {inputMode === "url"
                ? "Live multi-source ingestion active"
                : "Direct text mode guarantees 100% demo uptime"}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-zinc-950 font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-rose-950/40 disabled:opacity-50 transition transform active:scale-95 cursor-pointer"
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
