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
    <div className="bg-amber-50/90 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-900 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarX className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="font-bold text-amber-950">
              Temporal Warning:
            </span>
            <span className="text-zinc-700 truncate">
              {alerts.length} source{alerts.length > 1 ? "s cite" : " cites"} an outdated decision cycle ({alerts[0].detectedCycleOrYear || "previous cycle"}).
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-amber-800 hover:text-amber-950 font-bold text-[11px] flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>{isExpanded ? "Hide Details" : "View Alert"}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-amber-200/80 space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className="bg-white border border-amber-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-900">
                    {alert.sourceTitle}
                  </span>
                  {alert.detectedCycleOrYear && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-mono font-semibold">
                      Cites: {alert.detectedCycleOrYear}
                    </span>
                  )}
                </div>
                <p className="text-zinc-600 mt-1">{alert.warningMessage}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase shrink-0 self-start sm:self-center">
                Outdated Cycle
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
