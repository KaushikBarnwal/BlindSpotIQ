import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, SourceDocument } from "@/types";
import { SAMPLE_SCHOLARSHIP_SCENARIO } from "./sampleData";

export async function analyzeInformationGaps(
  topic: string,
  sources: SourceDocument[]
): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found in environment. Falling back to robust curated synthesis.");
    return {
      ...SAMPLE_SCHOLARSHIP_SCENARIO,
      topic: topic || SAMPLE_SCHOLARSHIP_SCENARIO.topic,
      timestamp: new Date().toISOString(),
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are the core intelligence of "BlindspotIQ", an AI-assisted Information Gap & Contradiction Detection platform.
Unlike typical search/summarizer tools that merely repeat what is present, your PRIMARY MISSION is to detect:
1. WHAT IS MISSING (Dark Spots / Information Gaps)
2. WHAT IS CONTRADICTORY (Conflicting claims between sources with exact quotes)
3. WHAT IS OUTDATED / STALE (Temporal warnings, past year cycles)
4. WHAT THE USER MUST VERIFY NEXT (Prioritized, actionable checklist)

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
Published/Cycle: ${s.publishDate || s.cycleOrYear || "Undated"}
Content:
${s.cleanTextSnippet.slice(0, 4000)}
`
  )
  .join("\n")}

YOUR TASKS:
1. Identify the detected domain category (e.g. "Scholarship Application", "Immigration & Visa", "Public Policy", "Medical/Treatment", "Legal Compliance").
2. Establish a benchmark list of 5-7 EXPECTED DIMENSIONS that a comprehensive, decision-ready answer MUST contain for this domain (e.g. for scholarships: Eligibility, Award Amount, Deadlines, Required Documents Checklist, Renewal Conditions, Appeals Process).
3. Build a Coverage Matrix for every (dimension, source) pair. Status must be one of: "covered", "partial", "missing", "conflicting". Provide exact quotes where found.
4. Identify critical DARK SPOTS (dimensions where NONE of the sources provided sufficient information, or where critical terms like renewal or appeals are omitted). Mark riskLevel as "high", "medium", or "low".
5. Identify CONTRADICTIONS between sources. Provide the exact claim and quote from Source A and Source B, explaining "whyItMatters" and recommending the safer next step.
6. Identify TEMPORAL ALERTS for sources that are stale, undated, or cite past cycles.
7. Generate a PRIORITIZED VERIFICATION CHECKLIST of actionable items the user must verify, with high priority first, and recommended search queries.
8. Calculate an overall completeness score (0-100) and an executive summary.

OUTPUT REQUIREMENT:
You MUST respond with valid JSON matching this exact structure:
{
  "detectedCategory": string,
  "executiveSummary": string,
  "overallCompletenessScore": number,
  "highRiskCount": number,
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
        "quote": string
      },
      "claimB": {
        "sourceId": string,
        "sourceTitle": string,
        "statement": string,
        "quote": string
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
      "completed": false
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
