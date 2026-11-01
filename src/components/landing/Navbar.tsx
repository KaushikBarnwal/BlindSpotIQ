"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BlindspotLogo } from "@/components/BlindspotLogo";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <BlindspotLogo size="md" showWordmark={true} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-base font-semibold text-zinc-600">
          <a href="#how-it-works" className="hover:text-zinc-950 transition-colors">
            How it Works
          </a>
          <a href="#features" className="hover:text-zinc-950 transition-colors">
            Features
          </a>
          <a href="#use-cases" className="hover:text-zinc-950 transition-colors">
            Use Cases
          </a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-bold transition-all shadow-sm hover:shadow-md"
          >
            Launch Platform →
          </Link>
          <button
            className="md:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 px-4 py-4 space-y-3 text-sm font-medium text-zinc-600">
          <a href="#how-it-works" className="block py-1 hover:text-zinc-950" onClick={() => setMobileOpen(false)}>
            How it Works
          </a>
          <a href="#features" className="block py-1 hover:text-zinc-950" onClick={() => setMobileOpen(false)}>
            Features
          </a>
          <a href="#use-cases" className="block py-1 hover:text-zinc-950" onClick={() => setMobileOpen(false)}>
            Use Cases
          </a>
          <Link
            href="/app"
            className="block mt-2 px-4 py-2 rounded-lg bg-zinc-950 text-white text-center font-semibold"
          >
            Launch Platform →
          </Link>
        </div>
      )}
    </header>
  );
}

