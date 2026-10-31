export type ConfidenceLevel =
  | "verified_quote"
  | "ai_inferred"
  | "conflicting_data"
  | "unverified";

export type CellStatus = "covered" | "partial" | "missing" | "conflicting";

export type RiskLevel = "high" | "medium" | "low";

export type AuthorityTier =
  | "primary_official" // Official government, university, issuing foundation (.gov, .edu, official body) ~ 95%
  | "secondary_aggregator" // Institutional registries, aggregators, accredited databases ~ 70%
  | "third_party_unverified"; // Blogs, student forums, commercial portals, unofficial guides ~ 35%

export interface SourceDocument {
  id: string;
  url: string;
  title: string;
  hostname: string;
  publishDate?: string;
  cycleOrYear?: string;
  isStale: boolean;
  staleReason?: string;
  cleanTextSnippet: string;
  wordCount: number;
  authorityTier: AuthorityTier;
  authorityWeight: number; // 0 to 100%
  authorityRationale: string;
}

export interface ExpectedDimension {
  id: string;
  name: string;
  description: string;
  category: "critical" | "important" | "operational";
  whyItMatters: string;
}

export interface MatrixCell {
  dimensionId: string;
  sourceId: string;
  status: CellStatus;
  summary: string;
  exactQuote?: string;
  confidence: ConfidenceLevel;
}

export interface DarkSpotGap {
  id: string;
  dimensionId: string;
  dimensionName: string;
  description: string;
  riskLevel: RiskLevel;
  impactReason: string;
  actionRequired: string;
  isAiInferred: true; // Strictly labeled per Hackathon Rubric Item #6
}

export interface Contradiction {
  id: string;
  dimensionId: string;
  dimensionName: string;
  claimA: {
    sourceId: string;
    sourceTitle: string;
    statement: string;
    quote: string;
    authorityTier: AuthorityTier;
    authorityWeight: number;
  };
  claimB: {
    sourceId: string;
    sourceTitle: string;
    statement: string;
    quote: string;
    authorityTier: AuthorityTier;
    authorityWeight: number;
  };
  authorityVerdict: {
    preferredClaim: "claimA" | "claimB" | "unresolved";
    rationale: string;
  };
  whyItMatters: string;
  recommendation: string;
  severity: "high" | "medium" | "low";
}

export interface TemporalAlert {
  sourceId: string;
  sourceTitle: string;
  detectedCycleOrYear?: string;
  currentCycleOrYear: string;
  isStale: boolean;
  warningMessage: string;
  severity: "critical" | "warning" | "info";
}

export interface VerificationChecklistItem {
  id: string;
  dimensionId?: string;
  task: string;
  priority: "high" | "medium" | "low";
  reason: string;
  recommendedOfficialSource?: string;
  searchQueryShortcut: string;
  completed: boolean;
  isAiSuggestedSignal: true; // Responsible AI disclosure
}

export interface DirectTextInput {
  title: string;
  content: string;
  sourceLabel?: string;
  authorityTier?: AuthorityTier;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  topic: string;
  detectedCategory: string; // e.g. "Scholarship Grant", "Immigration & Visa", "Public Policy"
  executiveSummary: string;
  sources: SourceDocument[];
  expectedDimensions: ExpectedDimension[];
  coverageMatrix: MatrixCell[];
  gaps: DarkSpotGap[];
  contradictions: Contradiction[];
  temporalAlerts: TemporalAlert[];
  verificationChecklist: VerificationChecklistItem[];
  overallCompletenessScore: number; // 0 - 100%
  highRiskCount: number;
}
