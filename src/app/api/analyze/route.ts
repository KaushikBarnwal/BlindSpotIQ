import { NextResponse } from "next/server";
import { extractSourceFromUrl } from "@/lib/extractor";
import { analyzeInformationGaps } from "@/lib/gemini";
import { searchWithTavily } from "@/lib/tavily";
import { checkRateLimit } from "@/lib/rateLimiter";
import { SourceDocument, DirectTextInput } from "@/types";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    // 1. IP-Based Sliding Window Rate Limiting (15 RPM free tier protection)
    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "127.0.0.1";

    const rateLimit = checkRateLimit(clientIp, 15, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Audit rate limit reached (maximum ${rateLimit.limit} requests/minute). Please wait ${rateLimit.resetSeconds}s before submitting.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetSeconds),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();
    const { topic, urls, directTexts, scope, useTavilySearch, provider } = body;

    // 2. Input Sanitization & Boundaries
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json(
        { error: "Topic / research query is required." },
        { status: 400 }
      );
    }

    // Cap topic to 500 characters to protect against token exhaustion
    const cleanTopic = topic.trim().slice(0, 500);

    let sources: SourceDocument[] = [];

    // 3. Process Direct Text Inputs (Capped at 6 documents, max 10,000 chars per doc)
    if (Array.isArray(directTexts) && directTexts.length > 0) {
      const validTexts: DirectTextInput[] = directTexts.slice(0, 6).filter(
        (dt: any) => dt && typeof dt.content === "string" && dt.content.trim().length > 0
      );

      validTexts.forEach((item, index) => {
        const text = item.content.trim().slice(0, 10000);
        const title = (item.title?.trim() || `Pasted Document #${index + 1}`).slice(0, 120);
        const tier = item.authorityTier || (index === 0 ? "primary_official" : index === 1 ? "secondary_aggregator" : "third_party_unverified");
        const weight = tier === "primary_official" ? 95 : tier === "secondary_aggregator" ? 70 : 35;

        const currentYear = new Date().getFullYear();
        const cycleMatch = text.match(/\b(202[0-9])(?:-202[0-9])?\b/);
        const isStale = Boolean(cycleMatch && parseInt(cycleMatch[1]) < currentYear - 1);

        sources.push({
          id: `paste-src-${index + 1}`,
          url: item.sourceLabel || `internal://document-${index + 1}`,
          title,
          hostname: item.sourceLabel || `Direct Text Notice #${index + 1}`,
          cleanTextSnippet: text,
          wordCount: text.split(/\s+/).filter(Boolean).length,
          authorityTier: tier,
          authorityWeight: weight,
          authorityRationale:
            tier === "primary_official"
              ? "Official authority circular / gazette text pasted directly."
              : tier === "secondary_aggregator"
              ? "Secondary database or registry notice."
              : "Third-party circular or informal summary notes.",
          isStale,
          cycleOrYear: cycleMatch ? cycleMatch[0] : undefined,
          staleReason: isStale ? `Text references earlier year cycle (${cycleMatch?.[0]})` : undefined,
        });
      });
    }

    // 4. Process URLs (Strictly capped at 5 parallel URLs, with SSRF protection)
    const validUrls: string[] = Array.isArray(urls)
      ? urls
          .map((u) => (typeof u === "string" ? u.trim() : ""))
          .filter((u) => u.startsWith("http://") || u.startsWith("https://"))
      : [];

    if (validUrls.length > 0) {
      const fetchPromises = validUrls.slice(0, 5).map((url, i) =>
        extractSourceFromUrl(url, i + sources.length)
      );
      const urlSources = await Promise.all(fetchPromises);
      sources.push(...urlSources);
    }

    // 5. Automated Web Discovery via Tavily (if requested or if no sources supplied)
    if (useTavilySearch || sources.length === 0) {
      const tavilySources = await searchWithTavily(cleanTopic, 4);
      if (tavilySources.length > 0) {
        sources.push(...tavilySources);
      }
    }

    // 6. Call Dual-Provider Gap & Contradiction Detection Engine
    const result = await analyzeInformationGaps(cleanTopic, sources, scope, provider);

    const jsonRes = NextResponse.json(result);
    jsonRes.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
    jsonRes.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
    return jsonRes;
  } catch (error: any) {
    console.error("Analysis API error:", error);
    // Mask sensitive details from external exposure
    const safeMessage =
      error.message && !error.message.includes("API_KEY")
        ? error.message
        : "Failed to analyze information gaps.";
    return NextResponse.json({ error: safeMessage }, { status: 500 });
  }
}
