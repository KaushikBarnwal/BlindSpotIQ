# BlindspotIQ — AI-Assisted Information Gap & Contradiction Detection Platform

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

**BlindspotIQ** solves this problem by performing **Schema-Driven Gap Detection**, cross-source contradiction flagging, and temporal freshness auditing.

---

## 2. Core Innovation: Schema-Driven Blind-Spot Matrix

> **The Meta-Problem:** An AI cannot detect a "gap" unless it understands what a complete, decision-ready answer looks like.

When a research topic is entered, BlindspotIQ:
1. **Determines the Domain Schema:** Synthesizes the mandatory 5–7 decision dimensions required for that domain (e.g., for scholarships: *Eligibility, Award Amount, Deadlines, Required Documents, Renewal Rules, Appeals*).
2. **Computes a Coverage Heatmap Matrix:** Maps dimensions as rows and ingested sources as columns.
   - 🟢 **Covered:** Verified statement backed by exact source quote.
   - 🟡 **Conflicting:** Disagreeing facts across publishers.
   - 🔴 **Dark Spot:** Critical dimension omitted across evaluated sources.
3. **Inspectable Evidence Provenance:** Clicking any matrix cell reveals the exact quoted snippet and confidence level (`[Direct Quote]`, `[AI-Inferred]`, `[Conflicting]`).

---

## 3. Key Features

- **Cross-Source Contradiction Engine:** Displays side-by-side claim comparisons with exact quotes (e.g., *Source A requires 2 recommendation letters* vs *Source B requires 3 letters + family tax return*), explaining "Why this matters" and recommending safe resolution.
- **Temporal Freshness & Outdated Cycle Alerts:** Detects in-text application cycle markers (e.g., *2024 postal submission* vs *2026 digital portal*), flagging stale sources with visual warnings.
- **Actionable Verification Checklist:** Automatically converts detected gaps and conflicts into an interactive checklist with 1-click official search shortcuts and markdown export.
- **Fail-Safe Dual Mode:** Works with live web URLs via readability extraction or runs instantly against pre-curated test scenarios (Scholarship Grant & Portugal Nomad Visa) for bulletproof hackathon demos.

---

## 4. Architecture & Technology Stack

```
[User Input: Topic / URLs]
           │
           ▼
[Next.js App Router: /api/analyze]
   ├─ 1. Web Extraction: @mozilla/readability + JSDOM
   ├─ 2. Gap & Clash Engine: Gemini 2.0 Flash (Structured JSON Schema)
   └─ 3. Deterministic Scorer: Completeness & Risk Weighting
           │
           ▼
[Interactive Dashboard UI (Tailwind CSS + Lucide Icons)]
   ├─ Schema-Driven Blindspot Heatmap Matrix (Click-to-Inspect)
   ├─ Side-by-Side Contradiction Highlighter
   ├─ Temporal Cycle Warning Banners
   ├─ Actionable Checklist (Checkboxes + 1-Click Search)
   └─ Ingested Source Transparency Drawer
```

- **Frontend & Full-Stack Engine:** Next.js 14+ (App Router), TypeScript, React 19
- **Styling & UI Components:** Tailwind CSS, Lucide React
- **Text & Metadata Extraction:** `@mozilla/readability`, `jsdom`
- **AI Intelligence:** Gemini 2.0 Flash (`@google/genai`) with structured JSON schema
- **Deployment:** Vercel-ready (single deployment, zero external microservices)

---

## 5. Quick Start Guide

### Prerequisites
- Node.js 18+ (tested with Node 20 / 24)
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

## 6. Pre-Curated Demo Walkthroughs

Click the header buttons to switch between two high-impact scenarios:

1. **Global STEM Scholarship Grant:**
   - **Dark Spot:** Official portal completely omits Year 2–4 renewal conditions and appeals.
   - **Contradiction:** Official portal requires 2 recommendation letters, while national aggregator demands 3 letters + financial tax return.
   - **Temporal Warning:** Third-party blog cites outdated 2024 postal application deadline.
2. **Portugal Digital Nomad Visa:**
   - **Dark Spot:** Worldwide tax residency & 183-day treaty triggers unmentioned in leaflets.
   - **Contradiction:** Official consulate mandates €3,280/mo (4x 2026 minimum wage), whereas older 2023 nomad guide claims €2,800/mo.

---

## 7. Submission Checklist & Judging Alignment

| Evaluation Area | Weight | BlindspotIQ Implementation |
|-----------------|--------|----------------------------|
| **Problem Understanding** | 15% | Solves presence bias; targets high-stakes decisions where omissions cause rejection. |
| **Innovation & Originality** | 20% | Schema-driven coverage heatmap matrix; knows what a complete answer looks like. |
| **Working Prototype** | 25% | Fully operational Next.js web application with live scanning and fixture support. |
| **Technical Implementation** | 15% | Strict TypeScript, modern App Router, Readability DOM extraction, structured Gemini prompting. |
| **Evidence & Transparency** | 15% | Inspectable quote citations, clear `[Verified Quote]` vs `[AI-Inferred]` tags. |
| **Presentation & Usability** | 10% | Intuitive dark dashboard, interactive checklist with markdown export and 1-click search. |
