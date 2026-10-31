"use client";

import React, { useState } from "react";
import { VerificationChecklistItem } from "@/types";
import {
  CheckSquare,
  Square,
  Search,
  Download,
  Copy,
  Check,
  ExternalLink,
  ListTodo,
} from "lucide-react";

interface VerificationChecklistProps {
  items: VerificationChecklistItem[];
  topic: string;
}

export function VerificationChecklist({
  items,
  topic,
}: VerificationChecklistProps) {
  const [checklist, setChecklist] = useState<VerificationChecklistItem[]>(items);
  const [copied, setCopied] = useState(false);

  // Sync state if items change
  React.useEffect(() => {
    setChecklist(items);
  }, [items]);

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = checklist.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / (checklist.length || 1)) * 100);

  const handleCopyMarkdown = () => {
    const md = `# BlindspotIQ Verification Checklist: ${topic}\n\nGenerated: ${new Date().toLocaleDateString()}\n\n` +
      checklist
        .map(
          (item) =>
            `- [${item.completed ? "x" : " "}] **[${item.priority.toUpperCase()}]** ${item.task}\n  - *Why:* ${item.reason}\n  - *Official Reference:* ${item.recommendedOfficialSource || "Primary institution portal"}`
        )
        .join("\n\n");

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Prioritized Verification Checklist</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {completedCount}/{checklist.length} Verified
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Clear, step-by-step checklist of what to confirm with official authorities before submitting.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyMarkdown}
          className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied Markdown!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Export Checklist</span>
            </>
          )}
        </button>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-zinc-400">
          <span>Verification Readiness</span>
          <span className="font-semibold text-zinc-200">{progressPercent}%</span>
        </div>
        <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
              item.completed
                ? "bg-zinc-950/40 border-zinc-800/60 opacity-60"
                : "bg-zinc-950/90 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <button
              type="button"
              className="mt-0.5 text-zinc-400 hover:text-rose-400 transition"
            >
              {item.completed ? (
                <CheckSquare className="w-5 h-5 text-emerald-400" />
              ) : (
                <Square className="w-5 h-5 text-zinc-500" />
              )}
            </button>

            <div className="flex-1 space-y-1 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`font-bold uppercase text-[9px] px-2 py-0.5 rounded-full ${
                    item.priority === "high"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : item.priority === "medium"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {item.priority} Priority
                </span>
                <span
                  className={`font-semibold text-sm ${
                    item.completed ? "line-through text-zinc-500" : "text-zinc-100"
                  }`}
                >
                  {item.task}
                </span>
              </div>

              <p className="text-zinc-400 text-xs">
                <span className="text-zinc-500 font-medium">Why check this: </span>
                {item.reason}
              </p>

              {item.recommendedOfficialSource && (
                <p className="text-[11px] text-zinc-500">
                  Target Authority:{" "}
                  <span className="text-zinc-300 font-mono">
                    {item.recommendedOfficialSource}
                  </span>
                </p>
              )}
            </div>

            {/* Quick 1-click Google search shortcut button */}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(
                item.searchQueryShortcut || item.task
              )}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition flex items-center gap-1.5 text-xs font-medium"
              title="Quick query search on Google"
            >
              <Search className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Search Official</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
