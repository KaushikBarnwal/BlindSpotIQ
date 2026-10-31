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
  Plus,
  Trash2,
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

  // Custom Item Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newReason, setNewReason] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");

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

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const customItem: VerificationChecklistItem = {
      id: `custom-item-${Date.now()}`,
      task: newTask.trim(),
      reason: newReason.trim() || "User-added custom verification action.",
      priority: newPriority,
      completed: false,
      isUserAdded: true,
      searchQueryShortcut: `${topic} ${newTask.trim()}`,
      recommendedOfficialSource: "Target Office / Program Registrar",
    };

    setChecklist((prev) => [customItem, ...prev]);
    setNewTask("");
    setNewReason("");
    setShowAddForm(false);
  };

  const handleDeleteCustomItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCopyMarkdown = () => {
    const md = `# BlindspotIQ Actionable Verification Checklist: ${topic}\n\nGenerated: ${new Date().toLocaleDateString()}\n\n` +
      checklist
        .map(
          (item) =>
            `- [${item.completed ? "x" : " "}] **[${item.priority.toUpperCase()}]** ${item.task}${item.isUserAdded ? " *(User Added)*" : ""}\n  - *Why:* ${item.reason}\n  - *Official Reference:* ${item.recommendedOfficialSource || "Primary institution portal"}`
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
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-600">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <span>Actionable Verification Loop</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 font-semibold">
                {completedCount}/{checklist.length} Verified
              </span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Clear, step-by-step checklist of what to confirm with official authorities before submitting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-semibold border border-indigo-200 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span>{showAddForm ? "Close Form" : "Add Custom Item"}</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 text-xs font-semibold border border-zinc-200 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied Markdown!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                <span>Export Checklist</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Inline Add Custom Item Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddCustomItem}
          className="bg-indigo-50/50 border border-indigo-200/90 rounded-xl p-4 space-y-3 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Add Custom Verification Action</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-zinc-400 hover:text-zinc-700 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                Action Item / Question To Verify *
              </label>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="e.g. Confirm minimum credit hours with registrar office"
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-hidden focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                Priority Level
              </label>
              <select
                value={newPriority}
                onChange={(e) =>
                  setNewPriority(e.target.value as "high" | "medium" | "low")
                }
                className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                Reason / Contact Office (Optional)
              </label>
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="e.g. Unclear if summer semester counts towards 12-credit rule"
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="w-full px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Checklist</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-zinc-500">
          <span>Verification Readiness</span>
          <span className="font-bold text-zinc-900">{progressPercent}%</span>
        </div>
        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200">
          <div
            className="bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5">
        {checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-3.5 sm:p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row items-start gap-3.5 ${
              item.completed
                ? "bg-zinc-50/50 border-zinc-200/60 opacity-60"
                : "bg-zinc-50/60 border-zinc-200 hover:border-zinc-300 hover:bg-white"
            }`}
          >
            <div className="flex items-start gap-3 w-full sm:w-auto sm:flex-1">
              <button
                type="button"
                className="mt-0.5 text-zinc-400 hover:text-indigo-600 transition"
              >
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-zinc-400" />
                )}
              </button>

              <div className="flex-1 space-y-1 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`font-bold uppercase text-[9px] px-2 py-0.5 rounded-full ${
                      item.priority === "high"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : item.priority === "medium"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                  {item.isUserAdded ? (
                    <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
                      Added by You
                    </span>
                  ) : (
                    <span className="text-[10px] text-indigo-700 font-mono bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 font-semibold">
                      AI Suggested Signal
                    </span>
                  )}
                  <span
                    className={`font-bold text-sm ${
                      item.completed ? "line-through text-zinc-400" : "text-zinc-900"
                    }`}
                  >
                    {item.task}
                  </span>
                </div>

                <p className="text-zinc-600 text-xs leading-relaxed">
                  <span className="text-zinc-400 font-medium">Why check this: </span>
                  {item.reason}
                </p>

                {item.recommendedOfficialSource && (
                  <p className="text-[11px] text-zinc-500">
                    Target Authority:{" "}
                    <span className="text-zinc-800 font-mono font-semibold">
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
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 border border-zinc-200 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs"
                title="Draft an official inquiry email to the issuing authority"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>Draft Inquiry</span>
              </button>

              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  item.searchQueryShortcut || item.task
                )}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 border border-zinc-200 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs"
                title="Search authoritative sources on Google"
              >
                <Search className="w-3.5 h-3.5 text-amber-600" />
                <span>Search Official</span>
              </a>

              {item.isUserAdded && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCustomItem(item.id);
                  }}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 border border-zinc-200 transition cursor-pointer"
                  title="Delete this custom item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Responsible AI Disclaimer Banner */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-zinc-500">
        <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-zinc-700">Responsible AI Disclosure:</strong> All AI-generated checklist tasks and gap signals represent potential verification pointers derived from reviewed material, not guaranteed facts or legal rulings. Always confirm critical conditions directly with the issuing authority.
        </span>
      </div>

      {/* Draft Inquiry Email Modal */}
      {emailModalItem && (() => {
        const draft = generateEmailDraft(emailModalItem);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white border border-zinc-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-start justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200/60 text-indigo-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-950 text-base">
                      Pre-filled Authority Inquiry Draft
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Copy and send directly to the scholarship or visa department
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailModalItem(null)}
                  className="text-zinc-400 hover:text-zinc-950 p-1 rounded-lg hover:bg-zinc-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-zinc-500 font-semibold block text-[11px] uppercase">
                    Subject Line:
                  </span>
                  <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 text-zinc-900 font-mono mt-1 text-xs">
                    {draft.subject}
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 font-semibold block text-[11px] uppercase">
                    Message Body:
                  </span>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 text-zinc-800 whitespace-pre-wrap font-sans text-xs mt-1 leading-relaxed max-h-56 overflow-y-auto">
                    {draft.body}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                <span className="text-[11px] text-zinc-500">
                  Target: {emailModalItem.recommendedOfficialSource || "Program Officer"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyEmailText(draft)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
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
                    className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold cursor-pointer"
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
