# BlindspotIQ — AI-Assisted Information Gap & Contradiction Platform

> **Hackathon:** Shinchan Online Hackathon 2026 (Devengers)  
> **Challenge:** DIGITAL DARK SPOT — AI-Assisted Information Gap Detection Platform  
> **Core Insight:** *"Most AI tools tell you what they found. BlindspotIQ tells you what's missing."*

---

## 1. Problem Statement & Real-World Impact

People rely on online information to make high-stakes decisions about education, careers, public services, research, and legal compliance. However, critical information is scattered across fragmented websites, outdated blogs, and aggregator summaries. 

### Where Generic LLMs & Search Engines Fail:
- **Presence Bias:** Traditional search engines and summarizers condense only what is *already present* on a web page.
- **Silent Omissions:** If an official portal explains eligibility but omits renewal rules, fee waivers, or appeal processes, typical AI chatbots fail to alert the user that critical decision dimensions were left unanswered.
- **Unverified Contradictions:** Third-party aggregators routinely quote conflicting amounts or outdated deadlines without side-by-side evidence inspection.

**BlindspotIQ** solves this problem by performing **Schema-Driven Gap Detection**, **Authority-Weighted Contradiction Flagging**, and **Temporal Freshness Auditing**.

---

## 2. Core Innovations

### 1. Schema-Driven Blind-Spot Matrix
> *The Meta-Problem: An AI cannot detect a "gap" unless it understands what a complete, decision-ready answer looks like.*
- Dynamically derives 5–7 mandatory decision dimensions (e.g., for scholarships: *Eligibility, Award Amount, Deadlines, Required Documents, Renewal Rules, Appeals*).
- Visual **Coverage Heatmap Matrix**:
  - 🟢 **Covered:** Verified statement backed by exact source quote.
  - 🟡 **Conflicting:** Disagreeing facts across publishers.
  - 🔴 **Dark Spot:** Critical dimension omitted across evaluated sources.
- Dual-View Switcher: **[ ▦ Heatmap Grid ]** for projector/presentation screens ⟷ **[ 📋 Dimension Cards ]** for responsive tablet/mobile inspection.

### 2. Source Authority & Trust Hierarchy
Rather than treating all web sources equally, BlindspotIQ weights claims based on institutional domain provenance:
- 🏛️ **Primary Official Authority (95% Trust):** `.gov`, `.edu`, and official statutory foundation portals.
- 🏢 **Secondary Aggregator (70% Trust):** Institutional databases and accredited registry networks.
- 📝 **Third-Party Unverified (35% Trust):** Commercial blogs and student forums prone to editorial lag.
- **Authority Resolution Verdict:** In conflicts, explains explicitly which claim overrides another based on statutory authority and freshness.

### 3. Fail-Safe Dual Ingestion Engine
- **Web & PDF Scraper:** Parses both live HTML via `@mozilla/readability` and official circular PDFs via `pdf-parse`.
- **Direct Notice / Text Paste Mode:** Allows pasting raw text from circulars, emails, or intranets directly, guaranteeing **100% demo uptime** even with network limits or bot blockers.

### 4. Active Verification & Resolution Loop
- **Prioritized Checklist:** Step-by-step next actions with 1-click targeted Google search shortcuts (`site:domain query`).
- **One-Click Authority Inquiry Draft:** Generates formal, pre-filled inquiry email templates addressed to the admissions/consular office asking directly about the detected blind spots.
- **Responsible AI Disclosure:** Findings are explicitly labeled as `[AI Gap Signal]` or `[Direct Quote]`.

---

## 3. Architecture & Technology Stack

```
[User Input: Web URLs / PDF Links / Direct Text Paste]
                           │
                           ▼
[Next.js App Router: /api/analyze (maxDuration: 60s)]
   ├─ 1. Ingestion: HTML Readability + PDF-Parse Buffer
   ├─ 2. Authority Heuristic: Domain Provenance Classifier (.gov / .edu vs blogs)
   ├─ 3. Gap & Clash Engine: Gemini 2.0 Flash (Structured JSON Schema)
   └─ 4. Deterministic Scorer: Completeness & Risk Weighting
                           │
                           ▼
[Interactive Dashboard UI (Tailwind CSS + Lucide Icons)]
   ├─ Step 1: Ingested Sources & Authority Trust Hierarchy
   ├─ Step 2: Schema-Driven Blindspot Heatmap Matrix (Grid ⟷ Cards)
   ├─ Step 3: Cross-Source Contradiction Diff (Authority Resolution)
   └─ Step 4: Actionable Verification Checklist (Search + Email Draft)
```

- **Frontend & Full-Stack Engine:** Next.js 16 (App Router), TypeScript, React 19
- **Styling & UI Components:** Tailwind CSS, Lucide React
- **Document Extraction:** `pdf-parse`, `@mozilla/readability`, `jsdom`
- **AI Engine:** Gemini 2.0 Flash (`@google/genai`) with structured JSON schemas
- **Deployment:** Vercel-ready (single deployment, zero external microservices)

---

## 4. Quick Start Guide

### Prerequisites
- Node.js 18+ (tested on Node 20 / 24)
- npm or yarn

### Installation

```bash
# 1. Clone repository
git clone https://github.com/your-username/blindspotiq.git
cd blindspotiq

# 2. Install dependencies
npm install

# 3. Configure environment (optional - sample mode works out of the box!)
cp .env.example .env.local
# Add your GEMINI_API_KEY if testing custom live AI queries

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Suggested Demo Flow (Section 7 Alignment)

1. **Enter Question:** E.g. *"What should I verify before applying for the Global STEM scholarship?"*
2. **Review Ingested Sources:** Notice the **Trust Hierarchy** (Official Foundation @ 95% vs Blog @ 35%).
3. **Inspect the Matrix:** Show the **Red Dark Spot** on *"Renewal Conditions"* (omitted across all 3 sources).
4. **Demonstrate Conflict:** Show the **Side-by-Side Clash** on document count (2 vs 3 letters) and the **Authority Resolution Verdict**.
5. **Open References:** Click any cell to inspect exact source quotes in the provenance inspector.
6. **Action Verification:** Click **"Draft Inquiry"** to reveal the pre-filled formal email template to send to the admissions office.

---

## 6. Submission Checklist & Judging Alignment

| Evaluation Area | Weight | BlindspotIQ Implementation |
|---|---|---|
| **Problem Understanding** | 15% | Addresses presence bias; focuses on high-stakes omissions that ruin applications. |
| **Innovation & Originality** | 20% | Schema-driven coverage matrix + Source Authority Trust Hierarchy. |
| **Working Prototype** | 25% | Fully operational Next.js app with live scanning, PDF parsing, and direct text paste. |
| **Technical Implementation** | 15% | Strict TypeScript, Turbopack build, DOM readability, PDF-parse, Gemini structured JSON. |
| **Evidence & Transparency** | 15% | Strict distinction between `[Direct Quote]` and `[AI Gap Signal]`; clear authority rationale. |
| **Presentation & Usability** | 10% | Clean dark dashboard, dual-view toggle (Grid ⟷ Cards), 1-click inquiry email drafting. |
