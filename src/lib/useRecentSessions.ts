"use client";

import { useState, useEffect, useCallback } from "react";
import { AnalysisResult, RecentSession } from "@/types";

const RECENT_SESSIONS_INDEX_KEY = "blindspotiq_recent_sessions_v1";
const SESSION_PAYLOAD_PREFIX = "blindspotiq_session_payload_";

export function useRecentSessions() {
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);

  // Load index from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(RECENT_SESSIONS_INDEX_KEY);
      if (raw) {
        const parsed: RecentSession[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setRecentSessions(parsed);
        }
      }
    } catch (err) {
      console.warn("Could not load recent sessions from localStorage:", err);
    }
  }, []);

  // Save or update a session
  const saveSession = useCallback((result: AnalysisResult) => {
    try {
      if (typeof window === "undefined" || !result?.id) return;

      const summary: RecentSession = {
        id: result.id,
        topic: result.topic,
        timestamp: result.timestamp || new Date().toISOString(),
        completenessScore: result.overallCompletenessScore ?? 0,
        darkSpotsCount: result.gaps?.length ?? 0,
        conflictsCount: result.contradictions?.length ?? 0,
        detectedCategory: result.detectedCategory || "General",
      };

      // Store payload
      localStorage.setItem(
        `${SESSION_PAYLOAD_PREFIX}${result.id}`,
        JSON.stringify(result)
      );

      // Update index (keep max 10 most recent)
      setRecentSessions((prev) => {
        const filtered = prev.filter((s) => s.id !== result.id);
        const updated = [summary, ...filtered].slice(0, 10);
        try {
          localStorage.setItem(RECENT_SESSIONS_INDEX_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn("Error saving sessions index:", e);
        }
        return updated;
      });
    } catch (err) {
      console.warn("Error persisting session:", err);
    }
  }, []);

  // Retrieve full payload for a session
  const loadSessionPayload = useCallback((id: string): AnalysisResult | null => {
    try {
      if (typeof window === "undefined") return null;
      const raw = localStorage.getItem(`${SESSION_PAYLOAD_PREFIX}${id}`);
      if (raw) {
        return JSON.parse(raw) as AnalysisResult;
      }
    } catch (err) {
      console.warn("Error loading session payload:", err);
    }
    return null;
  }, []);

  // Delete a single session
  const deleteSession = useCallback((id: string) => {
    try {
      if (typeof window === "undefined") return;
      localStorage.removeItem(`${SESSION_PAYLOAD_PREFIX}${id}`);
      setRecentSessions((prev) => {
        const updated = prev.filter((s) => s.id !== id);
        localStorage.setItem(RECENT_SESSIONS_INDEX_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.warn("Error deleting session:", err);
    }
  }, []);

  // Clear all sessions
  const clearAllSessions = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      recentSessions.forEach((s) => {
        localStorage.removeItem(`${SESSION_PAYLOAD_PREFIX}${s.id}`);
      });
      localStorage.removeItem(RECENT_SESSIONS_INDEX_KEY);
      setRecentSessions([]);
    } catch (err) {
      console.warn("Error clearing sessions:", err);
    }
  }, [recentSessions]);

  return {
    recentSessions,
    saveSession,
    loadSessionPayload,
    deleteSession,
    clearAllSessions,
  };
}
