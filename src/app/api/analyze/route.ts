import { NextResponse } from "next/server";
import { extractSourceFromUrl } from "@/lib/extractor";
import { analyzeInformationGaps } from "@/lib/gemini";
import { SourceDocument } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, urls } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic / research query is required." },
        { status: 400 }
      );
    }

    const validUrls: string[] = Array.isArray(urls)
      ? urls
          .map((u) => (typeof u === "string" ? u.trim() : ""))
          .filter((u) => u.startsWith("http://") || u.startsWith("https://"))
      : [];

    let sources: SourceDocument[] = [];

    if (validUrls.length > 0) {
      // Extract up to 5 URLs in parallel
      const fetchPromises = validUrls.slice(0, 5).map((url, i) =>
        extractSourceFromUrl(url, i)
      );
      sources = await Promise.all(fetchPromises);
    }

    // Call Gap & Contradiction Detection Engine
    const result = await analyzeInformationGaps(topic, sources);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze information gaps." },
      { status: 500 }
    );
  }
}
