"use client";

import React from "react";
import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";
import { BlindspotLogo } from "@/components/BlindspotLogo";

export function PlatformFooter() {
  const [emailCopied, setEmailCopied] = React.useState(false);

  const handleEmailClick = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText("barnwalkaushik@gmail.com")
        .then(() => {
          setEmailCopied(true);
          setTimeout(() => setEmailCopied(false), 2200);
        })
        .catch(() => {});
    }
  };
  return (
    <footer className="border-t border-zinc-200/80 bg-white mt-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-zinc-100">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <BlindspotLogo size="md" showWordmark={true} />
            <p className="text-xs sm:text-sm text-zinc-600 max-w-md leading-relaxed">
              AI-assisted cross-examination platform detecting hidden omissions, contradictory rules, and outdated information before high-stakes applications are submitted.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-zinc-400 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Digital Dark Spot Challenge (Devengers 2026)</span>
            </div>
          </div>

          {/* Direct Scenarios / Routing */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
              Direct Pages
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/app"
                  className="text-zinc-600 hover:text-emerald-700 transition font-medium flex items-center gap-1 group"
                >
                  <span>Research Workspace</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-emerald-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/demo-scholarship"
                  className="text-zinc-600 hover:text-emerald-700 transition font-medium flex items-center gap-1 group"
                >
                  <span>Scholarship Audit Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-emerald-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/demo-visa"
                  className="text-zinc-600 hover:text-emerald-700 transition font-medium flex items-center gap-1 group"
                >
                  <span>Nomad Visa Audit Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-emerald-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-zinc-600 hover:text-emerald-700 transition font-medium flex items-center gap-1 group"
                >
                  <span>Landing Overview</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-emerald-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-zinc-600 hover:text-emerald-700 transition font-medium flex items-center gap-1 group"
                >
                  <span>Privacy Policy</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-emerald-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-zinc-600 hover:text-emerald-700 transition font-medium flex items-center gap-1 group"
                >
                  <span>Terms of Service</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-emerald-600" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect / Social Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Connect & Author
            </h4>
            <div className="flex flex-col gap-2.5">
              {/* Gmail / Contact Link */}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=barnwalkaushik@gmail.com&su=Inquiry%20regarding%20BlindspotIQ"
                target="_blank"
                rel="noreferrer"
                onClick={handleEmailClick}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-red-50/70 border border-zinc-200/90 hover:border-red-200 text-xs sm:text-sm font-semibold text-zinc-800 hover:text-red-700 transition group cursor-pointer"
                title="Send email via Gmail (or click to copy address)"
              >
                <div className="w-5 h-5 rounded-md bg-red-100 flex items-center justify-center text-red-600 group-hover:scale-105 transition shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">barnwalkaushik@gmail.com</span>
                {emailCopied ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md ml-auto shrink-0">
                    Copied!
                  </span>
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 ml-auto shrink-0 group-hover:text-red-600 transition" />
                )}
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/KaushikBarnwal/BlindSpotIQ"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 hover:border-zinc-300 text-xs sm:text-sm font-semibold text-zinc-800 hover:text-zinc-950 transition group"
                title="View GitHub Profile"
              >
                <div className="w-5 h-5 rounded-md bg-zinc-900 text-white flex items-center justify-center group-hover:scale-105 transition shrink-0">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </div>
                <span>/KaushikBarnwal</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 ml-auto" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/kaushikraj515/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-blue-50/70 border border-zinc-200/90 hover:border-blue-200 text-xs sm:text-sm font-semibold text-zinc-800 hover:text-blue-700 transition group"
                title="View LinkedIn Profile"
              >
                <div className="w-5 h-5 rounded-md bg-[#0077b5] text-white flex items-center justify-center group-hover:scale-105 transition shrink-0">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.95 0-1.72.78-1.72 1.73s.77 1.73 1.72 1.73 1.73-.78 1.73-1.73-.78-1.73-1.73-1.73z" />
                  </svg>
                </div>
                <span>/kaushikraj515</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 ml-auto" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              © 2026 <strong className="text-zinc-800 font-semibold">BlindspotIQ</strong>. Created by Kaushik Raj.
            </span>
            <span className="text-zinc-300">•</span>
            <Link href="/privacy" className="hover:text-emerald-700 font-medium transition-colors">
              Privacy
            </Link>
            <span className="text-zinc-300">•</span>
            <Link href="/terms" className="hover:text-emerald-700 font-medium transition-colors">
              Terms
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1 text-zinc-400">
            <span>Next.js 16</span>
            <span>•</span>
            <span>Gemini 2.5 Flash</span>
            <span>•</span>
            <span>Groq LPU</span>
            <span>•</span>
            <span>Tavily AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
