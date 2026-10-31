"use client";

import React, { useState } from "react";
import { VerificationChecklistItem } from "@/types";
import {
  CheckSquare,
  Square,
  Search,
  Copy,
  Check,
  Mail,
  ListTodo,
  Info,
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
  const [emailModalItem, setEmailModalItem] = useState<VerificationChecklistItem | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);

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
    const md = `# BlindspotIQ Actionable Verification Checklist: ${topic}\n\nGenerated: ${new Date().toLocaleDateString()}\n\n` +
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

  const generateEmailDraft = (item: VerificationChecklistItem) => {
    return {
      subject: `Urgent Inquiry Regarding ${topic}: Clarification on ${item.task.slice(0, 45)}...`,
      body: `Dear Admissions & Program Review Committee,

I am currently preparing my application for "${topic}". While reviewing available materials and notices, I noted an important information gap regarding:

• Question: ${item.task}
• Reason for inquiry: ${item.reason}

Could you please confirm the official current policy or point me to the relevant updated circular for this application cycle?

Thank you for your guidance and time.

Sincerely,
Prospective Applicant`,
    };
  };

  const handleCopyEmailText = (draft: { subject: string; body: string }) => {
    const fullText = `Subject: ${draft.subject}\n\n${draft.body}`;
    navigator.clipboard.writeText(fullText);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
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
              <span>Actionable Verification & Resolution Loop</span>
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
          className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition cursor-pointer"
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
            className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row items-start gap-3.5 ${
              item.completed
                ? "bg-zinc-950/40 border-zinc-800/60 opacity-60"
                : "bg-zinc-950/90 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-start gap-3 w-full sm:w-auto sm:flex-1">
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
                  <span className="text-[10px] text-indigo-400 font-mono bg-indigo-950/30 px-1.5 rounded border border-indigo-900/40">
                    AI Suggested Signal
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
            </div>

            {/* Action buttons: Google Search + Draft Email */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEmailModalItem(item);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                title="Draft an official inquiry email to the issuing authority"
              >
                <Mail className="w-3.5 h-3.5 text-rose-400" />
                <span>Draft Inquiry</span>
              </button>

              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  item.searchQueryShortcut || item.task
                )}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                title="Search authoritative sources on Google"
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>Search Official</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Responsible AI Disclaimer Banner (Criterion 5 Alignment) */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-zinc-500">
        <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-zinc-400">Responsible AI Disclosure:</strong> All AI-generated checklist tasks and gap signals represent potential verification pointers derived from reviewed material, not guaranteed facts or legal rulings. Always confirm critical conditions directly with the issuing authority.
        </span>
      </div>

      {/* Draft Inquiry Email Modal */}
      {emailModalItem && (() => {
        const draft = generateEmailDraft(emailModalItem);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">
                      Pre-filled Authority Inquiry Draft
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Copy and send directly to the scholarship or visa department
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailModalItem(null)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-zinc-500 font-semibold block text-[11px] uppercase">
                    Subject Line:
                  </span>
                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-zinc-200 font-mono mt-1">
                    {draft.subject}
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 font-semibold block text-[11px] uppercase">
                    Message Body:
                  </span>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-zinc-200 whitespace-pre-wrap font-sans text-xs mt-1 leading-relaxed max-h-56 overflow-y-auto">
                    {draft.body}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                <span className="text-[11px] text-zinc-500">
                  Target: {emailModalItem.recommendedOfficialSource || "Program Officer"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyEmailText(draft)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-md transition cursor-pointer"
                  >
                    {emailCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Email Template</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setEmailModalItem(null)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
