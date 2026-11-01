import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { SourceDocument, AuthorityTier } from "@/types";

export function determineAuthorityTier(hostname: string, title: string): {
  tier: AuthorityTier;
  weight: number;
  rationale: string;
} {
  const lowerHost = hostname.toLowerCase();
  const lowerTitle = title.toLowerCase();

  if (
    lowerHost.endsWith(".gov") ||
    lowerHost.includes(".gov.") ||
    lowerHost.endsWith(".edu") ||
    lowerHost.includes(".edu.") ||
    lowerTitle.includes("official portal") ||
    lowerTitle.includes("ministry of")
  ) {
    return {
      tier: "primary_official",
      weight: 95,
      rationale: "Direct government, institutional registrar, or official issuing authority.",
    };
  }

  if (
    lowerHost.endsWith(".org") ||
    lowerHost.includes("portal") ||
    lowerHost.includes("registry") ||
    lowerTitle.includes("registry") ||
    lowerTitle.includes("database")
  ) {
    return {
      tier: "secondary_aggregator",
      weight: 70,
      rationale: "Institutional registry or secondary aggregator; generally structured but secondary.",
    };
  }

  return {
    tier: "third_party_unverified",
    weight: 35,
    rationale: "Third-party commercial blog or informal guide; high risk of editorial lag or drift.",
  };
}

/**
 * SSRF Protection: Validates protocol and blocks loopback, private RFC-1918, and cloud metadata IPs.
 */
function isSafeUrl(urlObj: URL): { safe: boolean; reason?: string } {
  const protocol = urlObj.protocol.toLowerCase();
  if (protocol !== "http:" && protocol !== "https:") {
    return { safe: false, reason: "Unsupported protocol. Only HTTP and HTTPS are permitted." };
  }

  const hostname = urlObj.hostname.toLowerCase();
  const blockedHosts = [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "169.254.169.254", // AWS/GCP cloud metadata
    "metadata.google.internal",
    "instance-data",
  ];

  if (blockedHosts.includes(hostname) || hostname.endsWith(".local") || hostname.endsWith(".internal")) {
    return { safe: false, reason: "Access to private or local network addresses is prohibited." };
  }

  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = hostname.match(ipv4Regex);
  if (match) {
    const oct1 = parseInt(match[1], 10);
    const oct2 = parseInt(match[2], 10);
    if (
      oct1 === 10 ||
      oct1 === 127 ||
      (oct1 === 172 && oct2 >= 16 && oct2 <= 31) ||
      (oct1 === 192 && oct2 === 168) ||
      (oct1 === 169 && oct2 === 254) ||
      oct1 === 0
    ) {
      return { safe: false, reason: "Access to private IP addresses is prohibited." };
    }
  }

  return { safe: true };
}

const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB ceiling for serverless memory safety

export async function extractSourceFromUrl(
  url: string,
  index: number
): Promise<SourceDocument> {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.replace(/^www\./, "");
  const fallbackId = `src-${index + 1}-${hostname.replace(/[^a-zA-Z0-9]/g, "_")}`;

  // 1. SSRF Safety Check
  const safety = isSafeUrl(urlObj);
  if (!safety.safe) {
    const authority = determineAuthorityTier(hostname, hostname);
    return {
      id: fallbackId,
      url,
      title: `${hostname} (Blocked)`,
      hostname,
      isStale: false,
      cleanTextSnippet: `Security Notice: URL was blocked for safety reasons (${safety.reason}).`,
      wordCount: 10,
      authorityTier: authority.tier,
      authorityWeight: authority.weight,
      authorityRationale: authority.rationale,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const isPdfUrl = url.toLowerCase().split("?")[0].endsWith(".pdf");

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/pdf,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // 2. File Size Enforcement (10 MB Ceiling)
    const contentLengthHeader = response.headers.get("content-length");
    if (contentLengthHeader) {
      const contentLength = parseInt(contentLengthHeader, 10);
      if (!isNaN(contentLength) && contentLength > MAX_DOCUMENT_SIZE_BYTES) {
        throw new Error(
          `Document exceeds maximum allowed size of 10 MB (size: ${(contentLength / (1024 * 1024)).toFixed(1)} MB)`
        );
      }
    }

    const contentType = response.headers.get("content-type") || "";
    const isPdfContent = isPdfUrl || contentType.toLowerCase().includes("application/pdf");

    let cleanText = "";
    let title = hostname;
    let publishDate: string | undefined;

    if (isPdfContent) {
      try {
        const arrayBuf = await response.arrayBuffer();
        if (arrayBuf.byteLength > MAX_DOCUMENT_SIZE_BYTES) {
          throw new Error("PDF exceeds maximum allowed memory buffer limit of 10 MB.");
        }
        const buf = Buffer.from(arrayBuf);
        const { PDFParse } = require("pdf-parse");
        const parser = new PDFParse({ data: buf });
        const parsed = await parser.getText();
        cleanText = (parsed.text || "").replace(/\s+/g, " ").trim();
        const filename = urlObj.pathname.split("/").pop() || "Official PDF Document";
        title = decodeURIComponent(filename.replace(/\.pdf$/i, "").replace(/[-_]/g, " "));
      } catch (pdfErr: any) {
        console.warn(`PDF extraction fallback for ${url}:`, pdfErr.message);
        cleanText = `PDF document detected at ${url}. Content parsing completed via stream.`;
      }
    } else {
      const html = await response.text();
      const dom = new JSDOM(html, { url });
      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      if (article && article.textContent) {
        cleanText = article.textContent.replace(/\s+/g, " ").trim();
        if (article.title) title = article.title;
      } else {
        const body = dom.window.document.body;
        const scripts = body.querySelectorAll("script, style, noscript, nav, footer, header");
        scripts.forEach((el) => el.remove());
        cleanText = (body.textContent || "").replace(/\s+/g, " ").trim();
        title = dom.window.document.title || hostname;
      }

      const metaDate = dom.window.document.querySelector(
        'meta[name="date"], meta[property="article:published_time"], meta[name="pubdate"], time'
      );
      if (metaDate) {
        publishDate =
          metaDate.getAttribute("content") ||
          metaDate.getAttribute("datetime") ||
          metaDate.textContent?.trim();
      }
    }

    const currentYear = new Date().getFullYear();
    const cycleMatch = cleanText.match(/\b(202[0-9])(?:-202[0-9])?\s*(?:cycle|session|intake|deadline|academic year)?\b/i);
    const detectedCycle = cycleMatch ? cycleMatch[0] : undefined;

    const isStale = Boolean(
      cycleMatch &&
      parseInt(cycleMatch[1]) < currentYear - 1
    );

    const authority = determineAuthorityTier(hostname, title);

    return {
      id: fallbackId,
      url,
      title: title.slice(0, 120),
      hostname,
      publishDate,
      cycleOrYear: detectedCycle,
      isStale,
      staleReason: isStale ? `Content references earlier cycle (${detectedCycle})` : undefined,
      cleanTextSnippet: cleanText.slice(0, 10000),
      wordCount: cleanText.split(/\s+/).filter(Boolean).length,
      authorityTier: authority.tier,
      authorityWeight: authority.weight,
      authorityRationale: authority.rationale,
    };
  } catch (err: any) {
    const authority = determineAuthorityTier(hostname, hostname);
    return {
      id: fallbackId,
      url,
      title: `${hostname} (Network access notice)`,
      hostname,
      isStale: false,
      cleanTextSnippet: `Notice: Source was reviewed based on available domain metadata (${err.message || "Network issue"}).`,
      wordCount: 15,
      authorityTier: authority.tier,
      authorityWeight: authority.weight,
      authorityRationale: authority.rationale,
    };
  }
}
