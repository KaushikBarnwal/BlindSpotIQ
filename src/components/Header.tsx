"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  ArrowLeft,
  BookOpen,
  Compass,
  ExternalLink,
  History,
  Trash2,
  ChevronDown,
  Mail,
} from "lucide-react";
import { RecentSession } from "@/types";

interface HeaderProps {
  onLoadScholarshipSample: () => void;
  onLoadVisaSample: () => void;
  activeScenarioId?: string;
  recentSessions?: RecentSession[];
  onSelectRecentSession?: (id: string) => void;
  onClearRecentSessions?: () => void;
}

export function Header({
  onLoadScholarshipSample,
  onLoadVisaSample,
  activeScenarioId,
  recentSessions = [],
  onSelectRecentSession,
  onClearRecentSessions,
}: HeaderProps) {
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowHistoryDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isScholarshipActive =
    activeScenarioId === "scenario-scholarship-2026" ||
    pathname === "/demo-scholarship" ||
    pathname === "/app/scholarship";
  const isVisaActive =
    activeScenarioId === "scenario-visa-2026" ||
    pathname === "/demo-visa" ||
    pathname === "/app/visa";

  return (
    <header className="border-b border-zinc-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Home Navigation & Branding */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
            title="Return to Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Landing</span>
          </Link>

          <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

          <Link href="/app" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-xs group-hover:scale-105 transition">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-zinc-950 font-heading">
                  Blindspot<span className="text-emerald-600">IQ</span>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Scenario Switcher & History Popover */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-100/80 border border-zinc-200/90 rounded-xl p-1 text-xs sm:text-sm">
            <span className="text-xs font-medium text-zinc-400 px-2.5 hidden lg:inline">
              Demos:
            </span>
            <button
              onClick={onLoadScholarshipSample}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm ${
                isScholarshipActive
                  ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/80"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Scholarship</span>
            </button>

            <button
              onClick={onLoadVisaSample}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm ${
                isVisaActive
                  ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/80"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <Compass className="w-4 h-4 text-teal-600" />
              <span>Nomad Visa</span>
            </button>
          </div>

          {/* Recent Sessions History Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowHistoryDropdown((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/70 border border-zinc-200/90 text-xs sm:text-sm font-bold text-zinc-700 transition cursor-pointer"
              title="View recent research sessions"
            >
              <History className="w-4 h-4 text-zinc-500" />
              <span className="hidden sm:inline">Recent</span>
              {recentSessions.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  {recentSessions.length}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {showHistoryDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 font-heading">
                    <History className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recent Research Sessions</span>
                  </div>
                  {recentSessions.length > 0 && onClearRecentSessions && (
                    <button
                      onClick={() => {
                        onClearRecentSessions();
                        setShowHistoryDropdown(false);
                      }}
                      className="text-[11px] text-zinc-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                  {recentSessions.length === 0 ? (
                    <div className="py-6 text-center text-zinc-400 text-xs">
                      No recent audits stored yet. Run an analysis to track history here.
                    </div>
                  ) : (
                    recentSessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => {
                          onSelectRecentSession?.(session.id);
                          setShowHistoryDropdown(false);
                        }}
                        className="p-2.5 rounded-xl border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50 transition cursor-pointer space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-zinc-900 line-clamp-1 flex-1 font-heading">
                            {session.topic}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                            {new Date(session.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            {session.completenessScore}% Complete
                          </span>
                          <span className="text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 font-medium">
                            {session.darkSpotsCount} Dark Spots
                          </span>
                          <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-medium">
                            {session.conflictsCount} Clashes
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Contact & GitHub Actions */}
        <div className="flex items-center gap-2">
          <a
            href="mailto:barnwalkaushik@gmail.com"
            title="Email Kaushik Raj via Gmail"
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-red-700 px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:border-red-200 hover:bg-red-50/50 transition"
          >
            <Mail className="w-3.5 h-3.5 text-red-500" />
            <span>Gmail</span>
          </a>

          <a
            href="https://github.com/KaushikBarnwal"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>
    </header>
  );
}
