"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-white border-t border-zinc-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-zinc-800">
            Blindspot<span className="text-indigo-600">IQ</span>
          </span>
          <span className="hidden sm:inline text-zinc-300 mx-1">·</span>
          <span className="hidden sm:inline text-xs text-zinc-400">
            Digital Dark Spot Challenge — Devengers 2026
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-5 text-xs text-zinc-500 font-medium">
          <Link href="/app" className="hover:text-zinc-900 transition-colors">
            Platform App
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-900 transition-colors"
          >
            GitHub
          </a>
        </div>

        {/* Attribution */}
        <p className="text-[11px] text-zinc-400 text-center sm:text-right">
          Built with Next.js · Gemini · Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
