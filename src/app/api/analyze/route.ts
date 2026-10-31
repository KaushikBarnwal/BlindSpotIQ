import { NextResponse } from "next/server";
import { extractSourceFromUrl } from "@/lib/extractor";
import { analyzeInformationGaps } from "@/lib/gemini";
import { SourceDocument, DirectTextInput } from "@/types";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, urls, directTexts, scope } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic / research query is required." },
        { status: 400 }
      );
    }

    let sources: SourceDocument[] = [];

    // 1. Process Direct Text / Circular Paste Inputs (Guaranteed Fail-Safe Mode)
    if (Array.isArray(directTexts) && directTexts.length > 0) {
      const validTexts: DirectTextInput[] = directTexts.filter(
        (dt: any) => dt && typeof dt.content === "string" && dt.content.trim().length > 0
      );

      validTexts.forEach((item, index) => {
        const text = item.content.trim();
        const title = item.title?.trim() || `Pasted Document #${index + 1}`;
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
          cleanTextSnippet: text.slice(0, 10000),
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

    // 2. Process URLs if provided
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

    // Call Gap & Contradiction Detection Engine with user scope
    const result = await analyzeInformationGaps(topic, sources, scope);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze information gaps." },
      { status: 500 }
    );
  }
}
