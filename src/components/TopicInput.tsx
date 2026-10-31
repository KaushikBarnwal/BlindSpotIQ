"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Globe, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

interface TopicInputProps {
  onAnalyze: (topic: string, urls: string[]) => void;
  isLoading: boolean;
  onLoadScholarshipSample: () => void;
  onLoadVisaSample: () => void;
}

const PIPELINE_STEPS = [
  "Ingesting sources & parsing HTML/PDF documents...",
  "Synthesizing expected decision schema for domain...",
  "Scanning coverage matrix & detecting dark spots...",
  "Cross-referencing factual contradictions with exact quotes...",
  "Auditing temporal freshness & building verification loop...",
];

export function TopicInput({
  onAnalyze,
  isLoading,
  onLoadScholarshipSample,
  onLoadVisaSample,
}: TopicInputProps) {
  const [topic, setTopic] = useState("What should I verify before applying for the Global STEM scholarship?");
  const [urls, setUrls] = useState<string[]>([
    "https://globalstem-foundation.org/scholarships/undergrad-2026",
    "https://scholarshipinsider.net/global-stem-requirements-guide",
    "https://nationalgrantsportal.edu/database/stem-awards-view",
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setCurrentStepIndex(0);
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => (prev < PIPELINE_STEPS.length - 1 ? prev + 1 : prev));
      }, 1600);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrls = urls.filter((u) => u.trim().length > 0);
    onAnalyze(topic, cleanUrls);
  };

  const setScholarshipInputs = () => {
    setTopic("What should I verify before applying for the Global STEM Excellence Scholarship?");
    setUrls([
      "https://globalstem-foundation.org/scholarships/undergrad-2026",
      "https://scholarshipinsider.net/global-stem-requirements-guide",
      "https://nationalgrantsportal.edu/database/stem-awards-view",
    ]);
    onLoadScholarshipSample();
  };

  const setVisaInputs = () => {
    setTopic("What are the real financial & housing requirements for the Portugal Digital Nomad Visa?");
    setUrls([
      "https://vistos.mne.gov.pt/en/national-visas/general-information/residence-visa",
      "https://nomadlist.com/guides/portugal-nomad-visa",
    ]);
    onLoadVisaSample();
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Search className="w-4 h-4 text-rose-400" />
              <span>Research Objective / High-Stakes Decision Goal</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={setScholarshipInputs}
                className="text-xs text-rose-400 hover:text-rose-300 underline font-medium cursor-pointer"
              >
                Sample Scholarship
              </button>
              <span className="text-zinc-600">|</span>
              <button
                type="button"
                onClick={setVisaInputs}
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

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>Target Sources to Compare & Gap-Analyze (HTML Webpages or PDF Documents)</span>
            </label>
            {urls.length < 5 && (
              <button
                type="button"
                onClick={handleAddUrl}
                className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-md transition font-medium cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Source</span>
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
                  width: `${((currentStepIndex + 1) / PIPELINE_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Dual mode: Scrapes live HTML/PDF URLs or tests against pre-curated fixtures</span>
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
