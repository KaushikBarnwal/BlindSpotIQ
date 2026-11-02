"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Server,
  FileCheck2,
  HardDrive,
  RefreshCcw,
  Mail,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { BlindspotLogo } from "@/components/BlindspotLogo";
import { LandingFooter } from "@/components/landing/Footer";

export function PrivacyPolicy() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>LEGAL & DATA PRIVACY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 font-sans">
            Privacy Policy
          </h1>

          <p className="text-base text-zinc-600 leading-relaxed max-w-2xl">
            BlindspotIQ is built with privacy-first and zero-retention principles. This document outlines how your data, search queries, and uploaded documents are handled across our cross-examination pipeline.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-zinc-500 font-mono">
            <span>Last Updated: {lastUpdated}</span>
            <span>•</span>
            <span>Version 1.0 (Hackathon Edition)</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero Data Retention
            </span>
          </div>
        </div>

        {/* TL;DR Highlight Card */}
        <div className="my-8 p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200/80 shadow-xs">
          <h2 className="text-sm font-bold text-emerald-950 uppercase tracking-wider font-mono flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            TL;DR Summary for Judges & Users
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-emerald-950/90 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span><strong>No Account Required:</strong> You can audit queries, inspect schemas, and download reports without signing in or submitting personal credentials.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span><strong>Zero Model Training:</strong> Your input queries, uploaded files, and synthesis results are never used to train public LLM models.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span><strong>Ephemeral Server-Side Processing:</strong> Text and PDF buffers exist in volatile server memory solely during the lifecycle of the analysis request and are immediately released.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span><strong>Client-Side Storage Only:</strong> Audit history is cached exclusively in your local browser (<code className="text-xs bg-emerald-100/70 px-1 py-0.5 rounded font-mono">localStorage</code>) and can be cleared instantly with one click.</span>
            </li>
          </ul>
        </div>

        {/* Structured Sections */}
        <div className="space-y-10 text-sm sm:text-base text-zinc-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-zinc-500" />
              1. Information We Collect (and Do Not Collect)
            </h3>
            <p>
              BlindspotIQ collects minimal operational data necessary to perform real-time cross-source discrepancy analysis:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
                <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono mb-1 text-emerald-700">What We Process</h4>
                <ul className="text-xs space-y-1.5 text-zinc-600">
                  <li>• Research topic query strings entered in the search bar.</li>
                  <li>• Optional target domain constraints (e.g. jurisdiction, year).</li>
                  <li>• Uploaded document text or PDF files (if provided by user).</li>
                  <li>• Temporary client IP address (strictly for rate-limiting).</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
                <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono mb-1 text-rose-700">What We Never Collect</h4>
                <ul className="text-xs space-y-1.5 text-zinc-600">
                  <li>• Passwords, social security numbers, or banking credentials.</li>
                  <li>• Third-party marketing cookies or ad-network fingerprinting.</li>
                  <li>• User tracking pixels across other websites.</li>
                  <li>• Persistent user profiles or persistent browsing dossiers.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <Server className="w-5 h-5 text-zinc-500" />
              2. Third-Party AI & Search Provider Interactions
            </h3>
            <p>
              To extract live web sources and perform structured synthesis, BlindspotIQ interfaces with verified cloud APIs using TLS 1.3 encrypted connections:
            </p>
            <ul className="space-y-2.5 pl-4 border-l-2 border-zinc-200 text-xs sm:text-sm text-zinc-600">
              <li>
                <strong className="text-zinc-900">Google Gemini API (Google Cloud Vertex / AI Studio):</strong> Used for domain schema generation and cross-examination synthesis. Processed under Google Enterprise AI guidelines where prompt inputs are not used for foundation model training.
              </li>
              <li>
                <strong className="text-zinc-900">Groq Cloud LPU:</strong> Used for ultra-low latency heuristic and secondary model fallback inference (<code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">openai/gpt-oss-120b</code>). Operates under zero-data retention agreements.
              </li>
              <li>
                <strong className="text-zinc-900">Tavily AI Search:</strong> Used to discover publicly accessible web references and authoritative documentation. Tavily retrieves public web articles based on your query terms.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <Lock className="w-5 h-5 text-zinc-500" />
              3. Security Guardrails & SSRF Protection
            </h3>
            <p>
              BlindspotIQ implements enterprise-grade input validation and fetch guards:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 text-xs sm:text-sm">
              <li>
                <strong>Server-Side Request Forgery (SSRF) Filter:</strong> All target URLs entered by users or fetched from search are strictly vetted. Loopback addresses (<code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">127.0.0.1</code>, <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">localhost</code>), cloud metadata services (<code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">169.254.169.254</code>), and private RFC-1918 subnets are automatically rejected.
              </li>
              <li>
                <strong>Buffer & Payload Ceilings:</strong> PDF document uploads are constrained to a strict 10 MB maximum buffer size, preventing denial-of-service memory exhaustion.
              </li>
              <li>
                <strong>Sliding-Window Rate Limiting:</strong> In-memory rate limiting enforces a maximum of 15 requests per minute per IP address to ensure fair service availability and prevent API abuse.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-zinc-500" />
              4. Local Storage & Client Data Control
            </h3>
            <p>
              BlindspotIQ maintains session history entirely within your client browser:
            </p>
            <p className="text-xs sm:text-sm text-zinc-600">
              When you run an audit, recent sessions are saved to browser <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">localStorage</code> for your convenience so you can switch between past inquiries. You have total sovereignty over this data: clicking <strong>&quot;Clear History&quot;</strong> in the navigation header permanently deletes all cached reports from your machine.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-zinc-500" />
              5. Rights Under GDPR, CCPA, and Global Privacy Frameworks
            </h3>
            <p>
              Because BlindspotIQ does not maintain a centralized user database or link inquiries to identifiable personal records, we practice privacy by design. However, users retain the following rights:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 text-xs sm:text-sm">
              <li><strong>Right to Erasure:</strong> Clear your local browser cache at any time to delete all audit records.</li>
              <li><strong>Right to Data Portability:</strong> Export your complete audit report instantly in structured Markdown (<code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">.md</code>) or formatted PDF.</li>
              <li><strong>Right to Inquire:</strong> Direct any questions regarding API routing or data handling to our developer.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-zinc-500" />
              6. Policy Updates & Modifications
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600">
              As BlindspotIQ continues to evolve during the Devengers 2026 Hackathon and beyond, this policy may be revised to reflect new security features, model integrations, or legal requirements. Material modifications will be reflected with an updated date at the top of this document.
            </p>
          </section>

          {/* Contact Section */}
          <section className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              Contact & Privacy Inquiries
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              If you have any questions or feedback regarding this Privacy Policy or our security architecture, please contact the developer:
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=barnwalkaushik@gmail.com&su=Privacy%20Inquiry%20regarding%20BlindspotIQ"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-mono text-xs font-semibold transition"
                title="Send email via Gmail"
              >
                <span>barnwalkaushik@gmail.com</span>
              </a>
              <a
                href="https://github.com/KaushikBarnwal/BlindSpotIQ"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-medium"
              >
                <span>GitHub Repository</span>
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

export default PrivacyPolicy;

