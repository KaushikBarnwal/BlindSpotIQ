"use client";

import React from "react";
import { TemporalAlert } from "@/types";
import { Clock, AlertTriangle, CalendarX, CheckCircle } from "lucide-react";

interface TemporalWarningsProps {
  alerts: TemporalAlert[];
}

export function TemporalWarnings({ alerts }: TemporalWarningsProps) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex items-center gap-3 text-xs text-zinc-400">
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>All reviewed sources appear fresh and aligned with the current decision cycle.</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-zinc-100">
            Temporal Freshness & Outdated Cycle Alerts
          </h4>
          <p className="text-xs text-zinc-400">
            Identifies sources citing previous application windows or obsolete statutory terms.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className="bg-rose-950/20 border border-rose-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-3">
              <CalendarX className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-100">
                    {alert.sourceTitle}
                  </span>
                  {alert.detectedCycleOrYear && (
                    <span className="px-2 py-0.5 rounded bg-rose-900/50 text-rose-300 border border-rose-800 text-[10px] font-mono">
                      Cites: {alert.detectedCycleOrYear}
                    </span>
                  )}
                </div>
                <p className="text-zinc-300 mt-1">{alert.warningMessage}</p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
              <span className="px-2.5 py-1 rounded-full bg-rose-500 text-zinc-950 font-extrabold text-[10px] uppercase tracking-wider">
                ⚠️ Outdated Cycle
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
