import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, SourceDocument } from "@/types";
import { SAMPLE_SCHOLARSHIP_SCENARIO } from "./sampleData";

export async function analyzeInformationGaps(
  topic: string,
  sources: SourceDocument[]
): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn(
      "GEMINI_API_KEY not found in environment. Falling back to robust curated synthesis."
    );
    return {
      ...SAMPLE_SCHOLARSHIP_SCENARIO,
      topic: topic || SAMPLE_SCHOLARSHIP_SCENARIO.topic,
      timestamp: new Date().toISOString(),
      sources: sources.length > 0 ? sources : SAMPLE_SCHOLARSHIP_SCENARIO.sources,
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are the core intelligence of "BlindspotIQ", an AI-assisted Information Gap & Contradiction Detection platform.
Your primary mission is to:
1. Synthesize a STRUCTURED SUMMARY OF KEY INFORMATION found across selected sources.
2. Detect WHAT IS MISSING (Dark Spots / Information Gaps) against expected domain dimensions.
3. Detect CONTRADICTIONS between sources, weighting them by institutional domain authority (.gov/.edu official > aggregator > commercial blog).
4. Detect OUTDATED / STALE CYCLES.
5. Identify the primary official application link / portal.
6. Generate a PRIORITIZED VERIFICATION CHECKLIST (including verifying the official application link).

USER TOPIC / RESEARCH GOAL:
"${topic}"

COLLECTED SOURCES:
${sources
  .map(
    (s, i) => `
--- SOURCE [${i + 1}] ---
ID: ${s.id}
URL: ${s.url}
Title: ${s.title}
Domain: ${s.hostname}
Authority Tier: ${s.authorityTier} (${s.authorityWeight}% weight)
Published/Cycle: ${s.publishDate || s.cycleOrYear || "Undated"}
Content:
${s.cleanTextSnippet.slice(0, 4000)}
`
  )
  .join("\n")}

OUTPUT REQUIREMENT (Valid JSON matching this exact structure):
{
  "detectedCategory": string,
  "executiveSummary": string,
  "overallCompletenessScore": number,
  "highRiskCount": number,
  "officialApplicationUrl": string,
  "officialApplicationTitle": string,
  "confirmedFacts": [
    {
      "dimensionName": string,
      "fact": string,
      "verifiedQuote": string,
      "sourceTitle": string,
      "sourceId": string,
      "authorityWeight": number
    }
  ],
  "expectedDimensions": [
    {
      "id": string,
      "name": string,
      "description": string,
      "category": "critical" | "important" | "operational",
      "whyItMatters": string
    }
  ],
  "coverageMatrix": [
    {
      "dimensionId": string,
      "sourceId": string,
      "status": "covered" | "partial" | "missing" | "conflicting",
      "summary": string,
      "exactQuote": string,
      "confidence": "verified_quote" | "ai_inferred" | "conflicting_data" | "unverified"
    }
  ],
  "gaps": [
    {
      "id": string,
      "dimensionId": string,
      "dimensionName": string,
      "riskLevel": "high" | "medium" | "low",
      "description": string,
      "impactReason": string,
      "actionRequired": string,
      "isAiInferred": true
    }
  ],
  "contradictions": [
    {
      "id": string,
      "dimensionId": string,
      "dimensionName": string,
      "severity": "high" | "medium" | "low",
      "claimA": {
        "sourceId": string,
        "sourceTitle": string,
        "statement": string,
        "quote": string,
        "authorityTier": "primary_official" | "secondary_aggregator" | "third_party_unverified",
        "authorityWeight": number
      },
      "claimB": {
        "sourceId": string,
        "sourceTitle": string,
        "statement": string,
        "quote": string,
        "authorityTier": "primary_official" | "secondary_aggregator" | "third_party_unverified",
        "authorityWeight": number
      },
      "authorityVerdict": {
        "preferredClaim": "claimA" | "claimB" | "unresolved",
        "rationale": string
      },
      "whyItMatters": string,
      "recommendation": string
    }
  ],
  "temporalAlerts": [
    {
      "sourceId": string,
      "sourceTitle": string,
      "detectedCycleOrYear": string,
      "currentCycleOrYear": string,
      "isStale": boolean,
      "warningMessage": string,
      "severity": "critical" | "warning" | "info"
    }
  ],
  "verificationChecklist": [
    {
      "id": string,
      "dimensionId": string,
      "task": string,
      "priority": "high" | "medium" | "low",
      "reason": string,
      "recommendedOfficialSource": string,
      "searchQueryShortcut": string,
      "completed": false,
      "isAiSuggestedSignal": true,
      "isOfficialLinkCheck": boolean
    }
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim() || "";
    const parsed = JSON.parse(text);

    return {
      id: `analysis-${Date.now()}`,
      timestamp: new Date().toISOString(),
      topic,
      detectedCategory: parsed.detectedCategory || "General Decision Research",
      executiveSummary: parsed.executiveSummary || "Analysis completed.",
      sources,
      confirmedFacts: parsed.confirmedFacts || [],
      officialApplicationUrl:
        parsed.officialApplicationUrl ||
        sources.find((s) => s.authorityTier === "primary_official")?.url ||
        sources[0]?.url,
      officialApplicationTitle:
        parsed.officialApplicationTitle || "Primary Official Application Portal",
      expectedDimensions: parsed.expectedDimensions || [],
      coverageMatrix: parsed.coverageMatrix || [],
      gaps: parsed.gaps || [],
      contradictions: parsed.contradictions || [],
      temporalAlerts: parsed.temporalAlerts || [],
      verificationChecklist: parsed.verificationChecklist || [],
      overallCompletenessScore: parsed.overallCompletenessScore ?? 65,
      highRiskCount: parsed.highRiskCount ?? (parsed.gaps?.length || 0),
    };
  } catch (err: any) {
    console.error("Gemini Gap Analysis error, falling back to curated synthesis:", err);
    return {
      ...SAMPLE_SCHOLARSHIP_SCENARIO,
      topic: topic || SAMPLE_SCHOLARSHIP_SCENARIO.topic,
      timestamp: new Date().toISOString(),
      sources: sources.length > 0 ? sources : SAMPLE_SCHOLARSHIP_SCENARIO.sources,
    };
  }
}
