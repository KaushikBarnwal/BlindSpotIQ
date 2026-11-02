"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  ExternalLink,
  History,
  Trash2,
  ChevronDown,
  Mail,
} from "lucide-react";
import { BlindspotLogo } from "@/components/BlindspotLogo";
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
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Home Navigation & Branding */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-950 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
            title="Return to Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden md:inline">Landing</span>
          </Link>

          <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

          <Link href="/app" className="flex items-center gap-2 group shrink-0">
            <BlindspotLogo size="sm" showWordmark={true} />
          </Link>
        </div>

        {/* Center: Scenario Switcher & History Popover */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center bg-zinc-100/90 border border-zinc-200/90 rounded-xl p-0.5 sm:p-1 text-xs sm:text-sm">
            <span className="text-xs font-medium text-zinc-400 px-2 hidden lg:inline">
              Demos:
            </span>
            <button
              onClick={onLoadScholarshipSample}
              className={`px-2 sm:px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer text-xs sm:text-sm ${
                isScholarshipActive
                  ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/80"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
              title="Global STEM Scholarship Demo"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
              <span className="hidden md:inline">Scholarship</span>
              <span className="md:hidden text-[11px] sm:text-xs">Scholar</span>
            </button>

            <button
              onClick={onLoadVisaSample}
              className={`px-2 sm:px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer text-xs sm:text-sm ${
                isVisaActive
                  ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/80"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
              title="Portugal Nomad Visa Demo"
            >
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 shrink-0" />
              <span className="hidden md:inline">Nomad Visa</span>
              <span className="md:hidden text-[11px] sm:text-xs">Visa</span>
            </button>
          </div>

          {/* Recent Sessions History Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowHistoryDropdown((prev) => !prev)}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-zinc-100/90 hover:bg-zinc-200/70 border border-zinc-200/90 text-xs sm:text-sm font-bold text-zinc-700 transition cursor-pointer"
              title="View recent research sessions"
            >
              <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
              <span className="hidden md:inline">Recent</span>
              {recentSessions.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {recentSessions.length}
                </span>
              )}
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showHistoryDropdown && (
              <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-16 sm:top-auto sm:mt-2 w-auto sm:w-96 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 p-3 space-y-2">
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
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <a
            href="mailto:barnwalkaushik@gmail.com"
            title="Email Kaushik Raj via Gmail"
            className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-red-700 px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:border-red-200 hover:bg-red-50/50 transition"
          >
            <Mail className="w-3.5 h-3.5 text-red-500" />
            <span>Gmail</span>
          </a>

          <a
            href="https://github.com/KaushikBarnwal/BlindSpotIQ"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition"
            title="View GitHub Repository"
          >
            <svg className="w-3.5 h-3.5 fill-current text-zinc-700" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink className="w-3 h-3 text-zinc-400 hidden sm:inline" />
          </a>
        </div>
      </div>
    </header>
  );
}
