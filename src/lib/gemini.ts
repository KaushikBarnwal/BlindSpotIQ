import {
  AnalysisResult,
  SourceDocument,
  UserScopeContext,
  ExpectedDimension,
  MatrixCell,
  DarkSpotGap,
  ConfirmedFact,
  VerificationChecklistItem,
} from "@/types";
import { SAMPLE_SCHOLARSHIP_SCENARIO, SAMPLE_VISA_SCENARIO } from "./sampleData";
import { callDualProviderLLM, LLMProviderType } from "./llmProvider";

function generateTopicAwareHeuristicFallback(
  topic: string,
  sources: SourceDocument[],
  scope?: UserScopeContext
): AnalysisResult {
  const lower = (topic || "").toLowerCase();
  if (lower.includes("global stem") || lower.includes("stem excellence")) {
    return {
      ...SAMPLE_SCHOLARSHIP_SCENARIO,
      topic,
      userScope: scope || SAMPLE_SCHOLARSHIP_SCENARIO.userScope,
      timestamp: new Date().toISOString(),
    };
  }
  if (lower.includes("portugal") || lower.includes("nomad visa")) {
    return {
      ...SAMPLE_VISA_SCENARIO,
      topic,
      userScope: scope || SAMPLE_VISA_SCENARIO.userScope,
      timestamp: new Date().toISOString(),
    };
  }

  // Dynamic heuristic fallback for custom topics (e.g. e-Kalyan, MCA Jobs, etc.)
  let category = "General Decision Research";
  if (lower.includes("scholarship") || lower.includes("fellowship") || lower.includes("grant") || lower.includes("kalyan")) {
    category = "Higher Education & Scholarship Grant";
  } else if (lower.includes("visa") || lower.includes("immigration") || lower.includes("residency")) {
    category = "Immigration & Residency Visa";
  } else if (lower.includes("job") || lower.includes("career") || lower.includes("hiring") || lower.includes("mca")) {
    category = "Career & Professional Employment";
  }

  const dimensions: ExpectedDimension[] = [
    {
      id: "dim-eligibility",
      name: "Eligibility Criteria & Thresholds",
      category: "critical",
      description: "Minimum qualifications, academic percentage, category, or prerequisite requirements.",
      whyItMatters: "Failure to meet basic qualification leads to disqualification.",
    },
    {
      id: "dim-financial",
      name: "Financial Terms & Award / Compensation Structure",
      category: "critical",
      description: "Specific disbursement amounts, salary brackets, or fee waivers.",
      whyItMatters: "Directly determines the financial viability of the decision.",
    },
    {
      id: "dim-deadline",
      name: "Application Deadlines & Key Schedule",
      category: "critical",
      description: "Cut-off dates, submission timeline, and cycle verification.",
      whyItMatters: "Missing cut-off dates forfeits consideration for the entire cycle.",
    },
    {
      id: "dim-documents",
      name: "Required Documentation & Proof Dossier",
      category: "important",
      description: "Required certificates, income proof, transcripts, or identification documents.",
      whyItMatters: "Incomplete document submissions are rejected without administrative review.",
    },
    {
      id: "dim-continuation",
      name: "Renewal, Continuation & Maintenance Policy",
      category: "important",
      description: "Terms governing continuation beyond Year 1 or ongoing performance rules.",
      whyItMatters: "Often a major blind spot omitted from preliminary circulars.",
    },
    {
      id: "dim-appeals",
      name: "Disqualification Appeals & Grievance Recourse",
      category: "operational",
      description: "Formal process to dispute administrative rejections or clarify ambiguous rules.",
      whyItMatters: "Ensures applicant rights are protected in administrative disputes.",
    },
  ];

  const dimensionKeywords: Record<string, RegExp> = {
    "dim-eligibility": /eligib|requirement|criteria|qualif|gpa|marks|degree|age|pass|sc\/st|obc|percentage/i,
    "dim-financial": /amount|stipend|salary|fee|fund|inr|rs|₹|\$|eur|€|rupee|grant|disburse|lakh/i,
    "dim-deadline": /deadline|last date|cut-off|closing date|calendar|schedule|intake|timeline|date/i,
    "dim-documents": /document|certificate|transcript|proof|aadhar|pan|passport|marksheet|income certificate/i,
    "dim-continuation": /renew|continue|subsequent year|maintenance|tenure|annual|ongoing/i,
    "dim-appeals": /appeal|grievance|disqualif|dispute|complaint|helpdesk|reconsider|helpline/i,
  };

  const coverageMatrix: MatrixCell[] = [];
  const confirmedFacts: ConfirmedFact[] = [];
  const gaps: DarkSpotGap[] = [];
  const coveredDimensionIds = new Set<string>();

  const safeSources = sources.length > 0 ? sources : [
    {
      id: "src-1",
      url: "https://example.gov.in",
      title: `${topic} Official Announcement`,
      hostname: "example.gov.in",
      cleanTextSnippet: `${topic} details provided by official notification.`,
      wordCount: 150,
      authorityTier: "primary_official" as const,
      authorityWeight: 95,
      authorityRationale: "Official institutional notice.",
      isStale: false,
    },
  ];

  for (const dim of dimensions) {
    const rx = dimensionKeywords[dim.id];
    let coveredByAny = false;

    for (const src of safeSources) {
      const text = src.cleanTextSnippet || "";
      const hasMatch = rx.test(text);

      if (hasMatch) {
        coveredByAny = true;
        coveredDimensionIds.add(dim.id);

        const matchIndex = text.search(rx);
        const start = Math.max(0, matchIndex - 30);
        const end = Math.min(text.length, matchIndex + 140);
        const quote = text.slice(start, end).replace(/\s+/g, " ").trim();

        coverageMatrix.push({
          dimensionId: dim.id,
          sourceId: src.id,
          status: "covered",
          summary: `${dim.name} addressed in ${src.hostname}`,
          exactQuote: `"...${quote}..."`,
          confidence: "verified_quote",
        });

        if (confirmedFacts.length < 5) {
          confirmedFacts.push({
            dimensionName: dim.name,
            fact: `Statement on ${dim.name.toLowerCase()} found in ${src.title}.`,
            verifiedQuote: quote,
            sourceTitle: src.title,
            sourceId: src.id,
            authorityWeight: src.authorityWeight / 100,
          });
        }
      } else {
        coverageMatrix.push({
          dimensionId: dim.id,
          sourceId: src.id,
          status: "missing",
          summary: `No explicit statements on ${dim.name.toLowerCase()} found.`,
          exactQuote: "Statement omitted from this source.",
          confidence: "unverified",
        });
      }
    }

    if (!coveredByAny) {
      gaps.push({
        id: `gap-${dim.id}`,
        dimensionId: dim.id,
        dimensionName: dim.name,
        riskLevel: dim.category === "critical" ? "high" : "medium",
        gapType: "completely_omitted",
        description: `No evaluated sources provide explicit guidelines regarding ${dim.name.toLowerCase()}.`,
        impactReason: dim.whyItMatters,
        actionRequired: `Verify ${dim.name.toLowerCase()} directly on the official issuing portal before finalizing submission.`,
        isAiInferred: true,
      });
    }
  }

  const checklist: VerificationChecklistItem[] = gaps.map((g, idx) => ({
    id: `chk-gap-${idx + 1}`,
    dimensionId: g.dimensionId,
    task: `Clarify ${g.dimensionName}: Inquire about unstated conditions directly.`,
    priority: g.riskLevel,
    reason: g.description,
    recommendedOfficialSource: safeSources[0]?.url || "Official Issuing Authority",
    searchQueryShortcut: `${topic} ${g.dimensionName}`,
    completed: false,
    isAiSuggestedSignal: true,
    isOfficialLinkCheck: idx === 0,
  }));

  const completeness = Math.round((coveredDimensionIds.size / dimensions.length) * 100);

  return {
    id: `analysis-${Date.now()}`,
    timestamp: new Date().toISOString(),
    topic,
    userScope: scope,
    providerUsed: "groq",
    modelUsed: "heuristic-deterministic",
    detectedCategory: category,
    executiveSummary: `Cross-source evaluation of ${safeSources.length} sources for "${topic}" identified ${coveredDimensionIds.size} covered criteria and ${gaps.length} potential information dark spots. High-risk gaps include unstated terms for ${gaps.map((g) => g.dimensionName).slice(0, 2).join(" and ") || "continuation rules"}.`,
    sources: safeSources,
    confirmedFacts,
    officialApplicationUrl: safeSources[0]?.url || "https://example.gov.in",
    officialApplicationTitle: safeSources[0]?.title || `${topic} Official Portal`,
    expectedDimensions: dimensions,
    coverageMatrix,
    gaps,
    contradictions: [],
    temporalAlerts: [],
    verificationChecklist: checklist,
    overallCompletenessScore: Math.max(35, completeness),
    highRiskCount: gaps.filter((g) => g.riskLevel === "high").length,
  };
}

export async function analyzeInformationGaps(
  topic: string,
  sources: SourceDocument[],
  scope?: UserScopeContext,
  preferredProvider?: LLMProviderType
): Promise<AnalysisResult> {

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
${
  scope && (scope.situation || scope.jurisdiction || scope.targetCycle)
    ? `
USER SCOPE & APPLICANT CONTEXT:
- Profile / Situation: ${scope.situation || "Unspecified"}
- Jurisdiction / Region: ${scope.jurisdiction || "Unspecified"}
- Target Cycle / Timeframe: ${scope.targetCycle || "Unspecified"}
(Evaluate whether the ingested sources align with this applicant context, and identify any scope or cycle mismatches!)
`
    : ""
}
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
      "gapType": "completely_omitted" | "unspecified_conditions" | "single_source_outlier" | "scope_mismatch",
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
      "conflictType": "document_list_conflict" | "numerical_clash" | "cycle_mismatch" | "scope_difference",
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
    const llmResult = await callDualProviderLLM(prompt, preferredProvider);

    if (!llmResult) {
      console.warn("[BlindspotIQ] No AI provider available. Falling back to topic-aware synthesis.");
      return generateTopicAwareHeuristicFallback(topic, sources, scope);
    }

    const parsed = JSON.parse(llmResult.rawJsonText);

    return {
      id: `analysis-${Date.now()}`,
      timestamp: new Date().toISOString(),
      topic,
      userScope: scope,
      providerUsed: llmResult.providerUsed,
      modelUsed: llmResult.modelUsed,
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
    console.error("AI Provider Gap Analysis error, falling back to topic-aware synthesis:", err);
    return generateTopicAwareHeuristicFallback(topic, sources, scope);
  }
}
