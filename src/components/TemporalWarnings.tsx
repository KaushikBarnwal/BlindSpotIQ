"use client";

import React, { useState } from "react";
import { TemporalAlert } from "@/types";
import { CalendarX, ChevronDown, ChevronUp } from "lucide-react";

interface TemporalWarningsProps {
  alerts: TemporalAlert[];
}

export function TemporalWarnings({ alerts }: TemporalWarningsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-amber-950/25 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-200 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarX className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="font-bold text-amber-300">
              Temporal Warning:
            </span>
            <span className="text-zinc-300 truncate">
              {alerts.length} source{alerts.length > 1 ? "s cite" : " cites"} an outdated decision cycle ({alerts[0].detectedCycleOrYear || "previous cycle"}).
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-amber-400 hover:text-white font-medium text-[11px] flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>{isExpanded ? "Hide Details" : "View Alert"}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-amber-500/20 space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className="bg-zinc-950/80 border border-amber-500/30 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-100">
                    {alert.sourceTitle}
                  </span>
                  {alert.detectedCycleOrYear && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-900/50 text-amber-300 border border-amber-800 text-[10px] font-mono">
                      Cites: {alert.detectedCycleOrYear}
                    </span>
                  )}
                </div>
                <p className="text-zinc-300 mt-1">{alert.warningMessage}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase shrink-0 self-start sm:self-center">
                Outdated Cycle
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

