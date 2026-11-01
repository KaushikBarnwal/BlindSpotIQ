"use client";

import React, { Suspense } from "react";
import PlatformDashboard from "@/components/PlatformDashboard";

export default function DemoScholarshipPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center text-zinc-400 font-sans text-sm">
          Loading Scholarship Demo Audit...
        </div>
      }
    >
      <PlatformDashboard initialScenario="scholarship" />
    </Suspense>
  );
}

