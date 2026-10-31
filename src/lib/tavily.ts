import { SourceDocument, AuthorityTier } from "@/types";

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
  raw_content?: string;
}

export async function searchWithTavily(
  query: string,
  maxResults = 4
): Promise<SourceDocument[]> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    console.warn("TAVILY_API_KEY not configured. Skipping Tavily live search.");
    return [];
  }

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "advanced",
        include_answer: false,
        include_raw_content: false,
        max_results: maxResults,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Tavily API responded with error:", res.status, errText);
      return [];
    }

    const data = await res.json();
    const results: TavilySearchResult[] = data.results || [];

    const currentYear = new Date().getFullYear();

    return results.map((item, index) => {
      let hostname = "web-source";
      try {
        hostname = new URL(item.url).hostname.replace(/^www\./, "");
      } catch {}

      // Calculate authority tier based on domain cues
      let authorityTier: AuthorityTier = "third_party_unverified";
      let authorityWeight = 40;
      let authorityRationale = "Third-party web search result.";

      const isGov = hostname.endsWith(".gov") || hostname.includes(".gov.");
      const isEdu = hostname.endsWith(".edu") || hostname.includes(".ac.") || hostname.includes(".edu.");
      const isOrg = hostname.endsWith(".org") && (hostname.includes("foundation") || hostname.includes("trust") || hostname.includes("council"));

      if (isGov || isEdu || isOrg) {
        authorityTier = "primary_official";
        authorityWeight = isGov ? 95 : 90;
        authorityRationale = isGov
          ? "Official government domain (.gov) identified by Tavily search."
          : "Official university / educational institution domain (.edu).";
      } else if (
        hostname.includes("portal") ||
        hostname.includes("registry") ||
        hostname.includes("database") ||
        hostname.includes("directory")
      ) {
        authorityTier = "secondary_aggregator";
        authorityWeight = 70;
        authorityRationale = "Aggregator or directory database indexing official announcements.";
      }

      // Detect cycle / stale
      const cycleMatch = item.content.match(/\b(202[0-9])(?:-202[0-9])?\b/);
      const isStale = Boolean(cycleMatch && parseInt(cycleMatch[1]) < currentYear - 1);

      return {
        id: `tavily-src-${index + 1}`,
        url: item.url,
        title: item.title || `Web Source #${index + 1}`,
        hostname,
        publishDate: undefined,
        cycleOrYear: cycleMatch ? cycleMatch[0] : undefined,
        isStale,
        staleReason: isStale ? `Content mentions earlier cycle (${cycleMatch?.[0]})` : undefined,
        cleanTextSnippet: item.content.slice(0, 8000),
        wordCount: item.content.split(/\s+/).filter(Boolean).length,
        authorityTier,
        authorityWeight,
        authorityRationale,
      };
    });
  } catch (err: any) {
    console.error("Tavily search exception:", err);
    return [];
  }
}
