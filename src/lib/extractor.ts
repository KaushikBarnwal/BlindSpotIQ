import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { SourceDocument } from "@/types";

export async function extractSourceFromUrl(
  url: string,
  index: number
): Promise<SourceDocument> {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.replace(/^www\./, "");
  const fallbackId = `src-${index + 1}-${hostname.replace(/[^a-zA-Z0-9]/g, "_")}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    let cleanText = "";
    let title = dom.window.document.title || hostname;

    if (article && article.textContent) {
      cleanText = article.textContent.replace(/\s+/g, " ").trim();
      if (article.title) title = article.title;
    } else {
      // Fallback: strip script, style, and tag elements
      const body = dom.window.document.body;
      const scripts = body.querySelectorAll("script, style, noscript, nav, footer, header");
      scripts.forEach((el) => el.remove());
      cleanText = (body.textContent || "").replace(/\s+/g, " ").trim();
    }

    // Try to extract publish date from meta tags
    let publishDate: string | undefined;
    const metaDate = dom.window.document.querySelector(
      'meta[name="date"], meta[property="article:published_time"], meta[name="pubdate"], time'
    );
    if (metaDate) {
      publishDate =
        metaDate.getAttribute("content") ||
        metaDate.getAttribute("datetime") ||
        metaDate.textContent?.trim();
    }

    // Extract year mentions in content to help detect application cycle
    const currentYear = new Date().getFullYear();
    const cycleMatch = cleanText.match(/\b(202[0-9])(?:-202[0-9])?\s*(?:cycle|session|intake|deadline|academic year)?\b/i);
    const detectedCycle = cycleMatch ? cycleMatch[0] : undefined;

    const isStale = Boolean(
      cycleMatch &&
      parseInt(cycleMatch[1]) < currentYear - 1
    );

    return {
      id: fallbackId,
      url,
      title: title.slice(0, 120),
      hostname,
      publishDate,
      cycleOrYear: detectedCycle,
      isStale,
      staleReason: isStale ? `Content mentions older cycle (${detectedCycle})` : undefined,
      cleanTextSnippet: cleanText.slice(0, 10000), // Keep up to 10k chars per source for LLM
      wordCount: cleanText.split(/\s+/).length,
    };
  } catch (err: any) {
    return {
      id: fallbackId,
      url,
      title: `${hostname} (Extraction notice)`,
      hostname,
      isStale: false,
      cleanTextSnippet: `Note: Unable to scrape live content directly (${err.message || "Network issue"}). Using domain metadata for assessment.`,
      wordCount: 15,
    };
  }
}
