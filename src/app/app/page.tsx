"use client";

import React, { Suspense } from "react";
import PlatformDashboard from "@/components/PlatformDashboard";

export default function PlatformPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center text-zinc-400 font-sans text-sm">
          Loading Research Workspace...
        </div>
      }
    >
      <PlatformDashboard />
    </Suspense>
  );
}
