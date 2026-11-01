/**
 * In-memory sliding-window rate limiter for BlindspotIQ API endpoints.
 * Protects serverless memory and external LLM quotas (Gemini 15 RPM, Groq 30 RPM).
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipRequestMap = new Map<string, RateLimitRecord>();

// Clean up stale IP records every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    const windowMs = 60 * 1000;
    for (const [ip, record] of ipRequestMap.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
      if (record.timestamps.length === 0) {
        ipRequestMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks whether an IP has exceeded the allowed request quota.
 * Default: 15 requests per 60 seconds (aligned with Gemini free tier RPM).
 */
export function checkRateLimit(
  clientIp: string,
  limit: number = 15,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const safeIp = clientIp || "anonymous-client";

  let record = ipRequestMap.get(safeIp);
  if (!record) {
    record = { timestamps: [] };
    ipRequestMap.set(safeIp, record);
  }

  // Filter out timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  // Record this request
  record.timestamps.push(now);

  return {
    success: true,
    limit,
    remaining: limit - record.timestamps.length,
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}
