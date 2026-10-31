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
    <div className="bg-amber-50/90 border border-amber-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-amber-900 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <CalendarX className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="font-bold text-amber-950">
              Temporal Freshness Alert:
            </span>
            <span className="text-zinc-700 truncate">
              {alerts.length} source{alerts.length > 1 ? "s cite" : " cites"} an earlier decision cycle ({alerts[0].detectedCycleOrYear || "previous cycle"}).
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-amber-800 hover:text-amber-950 font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>{isExpanded ? "Hide Details" : "View Alert"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-amber-200/80 space-y-2.5">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className="bg-white border border-amber-200 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs sm:text-sm shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-zinc-900 text-sm">
                    {alert.sourceTitle}
                  </span>
                  {alert.detectedCycleOrYear && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 text-xs font-mono font-semibold">
                      Cites: {alert.detectedCycleOrYear}
                    </span>
                  )}
                </div>
                <p className="text-zinc-600 mt-1 leading-relaxed">{alert.warningMessage}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold uppercase shrink-0 self-start sm:self-center">
                {alert.severity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
