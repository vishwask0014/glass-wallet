"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardHero from "./components/DashboardHero";
import StatsGrid from "./components/StatsGrid";
import RecentActivity from "./components/RecentActivity";
import SpendBreakdown from "./components/SpendBreakdown";
import AISuggestion from "./components/AIsuggestion";
import type { TransactionRecord, UserProfile } from "@/app/types/common";
import {
  buildAiSuggestion,
  computeDashboard,
  parseMonthlySalary,
} from "./utils";

export default function Page() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("");
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [monthlySalary, setMonthlySalary] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setFetchError(null);
      setIsLoading(true);

      const res = await fetch("/api/dashboard", {
        credentials: "include",
        cache: "no-store",
      });

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("Invalid response from server");
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load dashboard data");
      }

      const profile = data.user as UserProfile;

      setUserName(profile.userName ?? "");
      setTransactions(data.transcation ?? []);
      setMonthlySalary(parseMonthlySalary(profile.monthlySalary));
    } catch (error) {
      console.error("Failed to load dashboard data", error);
      setFetchError("Unable to load dashboard data");
      setTransactions([]);
      setMonthlySalary(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData, pathname]);

  useEffect(() => {
    const refreshOnFocus = () => {
      if (document.visibilityState === "visible") {
        void loadDashboardData();
      }
    };

    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshOnFocus);

    return () => {
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshOnFocus);
    };
  }, [loadDashboardData]);

  const dashboardData = useMemo(
    () => computeDashboard(transactions, monthlySalary),
    [transactions, monthlySalary],
  );

  const aiSuggestion = useMemo(
    () =>
      buildAiSuggestion(
        dashboardData.totals,
        dashboardData.salary,
        dashboardData.monthlyTransactionCount,
      ),
    [
      dashboardData.totals,
      dashboardData.salary,
      dashboardData.monthlyTransactionCount,
    ],
  );

  return (
    <div className="page-shell py-6 sm:py-10">
      <section className="glass-card-strong rounded-[2rem] p-6 sm:p-8">
        <DashboardHero
          userName={userName}
          totals={dashboardData.totals}
          salary={dashboardData.salary}
          isLoading={isLoading}
          error={fetchError}
        />
        <StatsGrid stats={dashboardData.stats} isLoading={isLoading} />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <RecentActivity
          transactions={dashboardData.recent}
          isLoading={isLoading}
          error={fetchError}
        />
        <div className="glass-grid">
          <SpendBreakdown
            breakdown={dashboardData.categoryBreakdown}
            isLoading={isLoading}
          />
          <AISuggestion title={aiSuggestion.title} detail={aiSuggestion.detail} />
        </div>
      </section>
    </div>
  );
}
