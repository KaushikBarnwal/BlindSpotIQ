export type ConfidenceLevel =
  | "verified_quote"
  | "ai_inferred"
  | "conflicting_data"
  | "unverified";

export type CellStatus = "covered" | "partial" | "missing" | "conflicting";

export type RiskLevel = "high" | "medium" | "low";

export type AuthorityTier =
  | "primary_official"
  | "secondary_aggregator"
  | "third_party_unverified";

export type GapType =
  | "completely_omitted"
  | "unspecified_conditions"
  | "single_source_outlier"
  | "scope_mismatch";

export type ConflictType =
  | "document_list_conflict"
  | "numerical_clash"
  | "cycle_mismatch"
  | "scope_difference";

export interface UserScopeContext {
  situation?: string;      // e.g., "2nd-year undergraduate, CS major"
  jurisdiction?: string;   // e.g., "California, USA" or "National / State"
  targetCycle?: string;    // e.g., "2026–2027 Cycle"
}

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
  authorityWeight: number;
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
  gapType?: GapType;
  impactReason: string;
  actionRequired: string;
  isAiInferred: true;
}

export interface Contradiction {
  id: string;
  dimensionId: string;
  dimensionName: string;
  conflictType?: ConflictType;
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
  isAiSuggestedSignal?: boolean;
  isUserAdded?: boolean;
  isOfficialLinkCheck?: boolean;
}

export interface ConfirmedFact {
  dimensionName: string;
  fact: string;
  verifiedQuote?: string;
  sourceTitle: string;
  sourceId: string;
  authorityWeight: number;
}

export interface DirectTextInput {
  title: string;
  content: string;
  sourceLabel?: string;
  authorityTier?: AuthorityTier;
}

export interface RecentSession {
  id: string;
  topic: string;
  timestamp: string;
  completenessScore: number;
  darkSpotsCount: number;
  conflictsCount: number;
  detectedCategory: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  topic: string;
  detectedCategory: string;
  executiveSummary: string;
  userScope?: UserScopeContext;
  sources: SourceDocument[];
  expectedDimensions: ExpectedDimension[];
  coverageMatrix: MatrixCell[];
  gaps: DarkSpotGap[];
  contradictions: Contradiction[];
  temporalAlerts: TemporalAlert[];
  verificationChecklist: VerificationChecklistItem[];
  confirmedFacts: ConfirmedFact[];
  officialApplicationUrl?: string;
  officialApplicationTitle?: string;
  overallCompletenessScore: number;
  highRiskCount: number;
}
