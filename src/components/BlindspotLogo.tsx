"use client";

import React from "react";

interface BlindspotLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showWordmark?: boolean;
}

const SIZE_MAP = {
  xs: { box: "w-5 h-5", text: "text-base" },
  sm: { box: "w-7 h-7", text: "text-lg" },
  md: { box: "w-8 h-8", text: "text-xl" },
  lg: { box: "w-10 h-10", text: "text-2xl" },
  xl: { box: "w-14 h-14", text: "text-3xl" },
};

export function BlindspotLogo({
  size = "md",
  className = "",
  showWordmark = false,
}: BlindspotLogoProps) {
  const currentSize = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* SVG Logomark */}
      <svg
        className={`${currentSize.box} shrink-0 transition-transform duration-300 group-hover:scale-105`}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="BlindspotIQ Emblem"
      >
        <defs>
          <linearGradient id="logoBgGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#09090b" />
            <stop offset="100%" stop-color="#06241c" />
          </linearGradient>

          <linearGradient id="logoEmeraldArc" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#34d399" />
            <stop offset="100%" stop-color="#059669" />
          </linearGradient>

          <linearGradient id="logoTealArc" x1="26" y1="26" x2="6" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#2dd4bf" />
            <stop offset="100%" stop-color="#0d9488" />
          </linearGradient>

          <radialGradient id="logoAmberGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fef08a" />
            <stop offset="40%" stop-color="#fbbf24" />
            <stop offset="100%" stop-color="#d97706" />
          </radialGradient>
        </defs>

        {/* Squircle Base */}
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="8"
          fill="url(#logoBgGrad)"
          stroke="#10b981"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />

        {/* Radar Reticle Crosshair Guides */}
        <circle cx="16" cy="16" r="9.5" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="2 2" />
        <line x1="16" y1="4.5" x2="16" y2="27.5" stroke="#10b981" strokeWidth="0.6" strokeOpacity="0.2" />
        <line x1="4.5" y1="16" x2="27.5" y2="16" stroke="#10b981" strokeWidth="0.6" strokeOpacity="0.2" />

        {/* Scanning Aperture / Investigative Lens Arcs */}
        <path
          d="M 8.5 20 C 7.2 12.5, 12.8 7.5, 20.5 7.5"
          stroke="url(#logoEmeraldArc)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M 23.5 12 C 24.8 19.5, 19.2 24.5, 11.5 24.5"
          stroke="url(#logoTealArc)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/* Central IQ Lens Ring */}
        <circle cx="16" cy="16" r="4.2" stroke="#34d399" strokeWidth="1.8" fill="#064e3b" fillOpacity="0.5" />

        {/* The Blindspot Spotlight Beacon */}
        <circle cx="21.5" cy="10.5" r="3.8" stroke="#f59e0b" strokeWidth="0.75" strokeOpacity="0.5" />
        <circle cx="21.5" cy="10.5" r="2.4" fill="url(#logoAmberGlow)" />
      </svg>

      {/* Optional Wordmark */}
      {showWordmark && (
        <span className={`font-black tracking-tight text-zinc-950 font-heading ${currentSize.text}`}>
          Blindspot<span className="text-emerald-600">IQ</span>
        </span>
      )}
    </div>
  );
}
