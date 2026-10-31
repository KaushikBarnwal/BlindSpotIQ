export type ConfidenceLevel = "verified_quote" | "ai_inferred" | "conflicting_data" | "unverified";

export type CellStatus = "covered" | "partial" | "missing" | "conflicting";

export type RiskLevel = "high" | "medium" | "low";

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
  isAiInferred: boolean;
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
  };
  claimB: {
    sourceId: string;
    sourceTitle: string;
    statement: string;
    quote: string;
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
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  topic: string;
  detectedCategory: string; // e.g. "Scholarship Application", "Immigration & Visa", "Public Policy"
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
