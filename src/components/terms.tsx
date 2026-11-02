"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  AlertTriangle,
  Scale,
  ShieldAlert,
  CheckCircle2,
  Mail,
  ArrowLeft,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { BlindspotLogo } from "@/components/BlindspotLogo";
import { LandingFooter } from "@/components/landing/Footer";

export function TermsOfService() {
  const lastUpdated = "November 1, 2026";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-emerald-100 selection:text-emerald-950 flex flex-col justify-between font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
            <div className="h-4 w-px bg-zinc-200 hidden sm:block" />
            <Link href="/" className="flex items-center gap-2">
              <BlindspotLogo size="sm" showWordmark={true} />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold transition shadow-xs"
            >
              <span className="hidden sm:inline">Launch Workspace</span>
              <span className="sm:hidden">Workspace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="space-y-4 pb-8 border-b border-zinc-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-mono font-semibold">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>LEGAL & TERMS OF USE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 font-sans">
            Terms of Service
          </h1>

          <p className="text-base text-zinc-600 leading-relaxed max-w-2xl">
            Please read these Terms of Service carefully before utilizing BlindspotIQ. By accessing our platform or conducting discrepancy audits, you agree to these conditions.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-zinc-500 font-mono">
            <span>Last Updated: {lastUpdated}</span>
            <span>•</span>
            <span>Version 1.0 (Hackathon Edition)</span>
            <span>•</span>
            <span className="text-blue-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Devengers 2026
            </span>
          </div>
        </div>

        {/* Essential Legal Warning Card */}
        <div className="my-8 p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-xs">
          <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wider font-mono flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Crucial Disclaimer for High-Stakes Decisions
          </h2>
          <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
            <strong>BlindspotIQ is an informational, AI-assisted research and decision-support tool.</strong> It does <strong>not</strong> provide legal counsel, immigration advice, financial planning, or official institutional determinations. While BlindspotIQ scores source authority and pinpoints contradictions, you must always verify critical requirements directly with the issuing government agency, embassy, or scholarship foundation before submitting applications or committing funds.
          </p>
        </div>

        {/* Structured Sections */}
        <div className="space-y-10 text-sm sm:text-base text-zinc-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-zinc-500" />
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing, browsing, or utilizing the web interface, APIs, or audit reports provided by <strong>BlindspotIQ</strong> (&quot;the Platform&quot;, &quot;we&quot;, &quot;our&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our accompanying Privacy Policy. If you do not agree to these terms, you must refrain from using the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-zinc-500" />
              2. Nature of the Platform & Purpose
            </h3>
            <p>
              BlindspotIQ was created as an original submission for the <strong>Devengers 2026 Hackathon</strong> under the <em>Digital Dark Spot</em> track. Its primary function is to combat &quot;Presence Bias&quot; in generative search by cross-examining multiple authoritative web references, detecting omitted policy criteria, highlighting contradicting rules, and flagging obsolete deadlines.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600">
              The platform synthesizes data using large language models (Google Gemini 2.5 Flash and Groq Cloud LPU) and real-time search engines (Tavily AI). You acknowledge that automated synthesis may produce non-exhaustive results or misinterpret highly technical institutional language.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <Scale className="w-5 h-5 text-zinc-500" />
              3. Source Authority Scoring & Matrix Interpretation
            </h3>
            <p>
              BlindspotIQ assigns heuristic credibility weights to ingested documents:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-600 pl-4 border-l-2 border-zinc-200">
              <li>
                <strong className="text-zinc-900">Tier 1 — Official Authorities (95% weight):</strong> Direct government ministries, universities, and official foundations (<code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">.gov</code>, <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">.edu</code>, primary portals).
              </li>
              <li>
                <strong className="text-zinc-900">Tier 2 — Verified Portals & Press (70% weight):</strong> Recognized news outlets, accredited publishers, and industry bodies.
              </li>
              <li>
                <strong className="text-zinc-900">Tier 3 — Community & Secondary Media (35% weight):</strong> Forums, blogs, and tertiary advisory articles.
              </li>
            </ul>
            <p className="text-xs text-zinc-500 pt-1">
              Authority weights are automated heuristics designed for comparative triage. They do not constitute certified institutional endorsement.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-zinc-500" />
              4. Acceptable Use Policy & User Conduct
            </h3>
            <p>You agree to use the platform only for lawful research and evaluation purposes. You strictly agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 text-xs sm:text-sm">
              <li>Attempt Server-Side Request Forgery (SSRF), including scanning loopback addresses, private networks (<code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">192.168.x.x</code>, <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">10.x.x.x</code>), or internal cloud metadata (<code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">169.254.169.254</code>).</li>
              <li>Bypass or attempt to circumvent rate limits (15 requests per minute per IP address) using proxies or distributed denial-of-service scripts.</li>
              <li>Upload malicious payloads, zip-bombs, corrupted PDFs, or copyrighted material you do not have permission to analyze.</li>
              <li>Use the automated Institutional Email Drafter feature to send abusive, spam, or harassing communications to university or government officials.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <Scale className="w-5 h-5 text-zinc-500" />
              5. Intellectual Property & Attribution
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600">
              The BlindspotIQ name, logomark, design system, matrix visualization architecture, and custom source-code belong to the platform creator, <strong>Kaushik Raj</strong>. You are granted a personal, non-exclusive license to inspect the platform and run research audits. Ingested external web source excerpts and quotes remain the property of their respective copyright holders and are utilized under fair-use commentary and research doctrines.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-zinc-500" />
              6. Limitation of Liability
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600">
              To the maximum extent permitted by applicable law, BlindspotIQ, its developers, and contributors shall not be liable for any direct, indirect, incidental, punitive, or consequential damages resulting from:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 text-xs sm:text-sm">
              <li>Application rejections, denied visas, or forfeited scholarship funds.</li>
              <li>Reliance on extracted dates, fee schedules, or eligibility thresholds.</li>
              <li>Service interruptions, temporary API quota exhaustion, or LLM latency delays.</li>
              <li>Actions taken or emails dispatched using our automated template drafters.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <Scale className="w-5 h-5 text-zinc-500" />
              7. Termination & Service Modifications
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600">
              We reserve the right to suspend or terminate access for any user violating the Acceptable Use Policy or attempting infrastructure exploits. The platform is continuously updated with improvements, and features may be modified or refined at any time without prior notice.
            </p>
          </section>

          {/* Contact Section */}
          <section className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Questions or Concerns Regarding Terms?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              If you have inquiries about our terms of use or wish to license our discrepancy detection engine, please reach out to the project lead:
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="mailto:barnwalkaushik@gmail.com"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-mono text-xs font-semibold transition"
              >
                <span>barnwalkaushik@gmail.com</span>
              </a>
              <a
                href="https://github.com/KaushikBarnwal/BlindSpotIQ"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-800 font-medium"
              >
                <span>Project GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}

export default TermsOfService;

