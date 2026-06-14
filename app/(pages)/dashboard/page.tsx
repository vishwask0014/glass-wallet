"use client";

import DashboardHero from "./components/DashboardHero";
import StatsGrid from "./components/StatsGrid";
import RecentActivity from "./components/RecentActivity";
import SpendBreakdown from "./components/SpendBreakdown";
import AISuggestion from "./components/AIsuggestion";
import { useUserStore } from "@/app/store/useUserStore";
import { useEffect } from "react";

export default function Page() {
  return (
    <div className="page-shell py-6 sm:py-10">
      {/* Hero + Stats */}
      <section className="glass-card-strong rounded-[2rem] p-6 sm:p-8">
        <DashboardHero />
        <StatsGrid />
      </section>

      {/* Activity + Breakdown + AI */}
      <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <RecentActivity />
        <div className="glass-grid">
          <SpendBreakdown />
          <AISuggestion />
        </div>
      </section>
    </div>
  );
}
