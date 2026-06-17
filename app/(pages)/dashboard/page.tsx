"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

async function fetchDashboardPayload() {
  const dashboardRes = await fetch("/api/dashboard", {
    credentials: "include",
    cache: "no-store",
  });

  const dashboardType = dashboardRes.headers.get("content-type") ?? "";

  if (dashboardType.includes("application/json")) {
    const dashboardData = await dashboardRes.json();

    if (dashboardRes.ok && dashboardData.success) {
      return {
        user: dashboardData.user as UserProfile,
        transcation: (dashboardData.transcation ?? []) as TransactionRecord[],
      };
    }
  }

  const [profileRes, transactionsRes] = await Promise.all([
    fetch("/api/profile", { credentials: "include", cache: "no-store" }),
    fetch("/api/transaction/trackexpense", {
      credentials: "include",
      cache: "no-store",
    }),
  ]);

  const profileType = profileRes.headers.get("content-type") ?? "";
  const transactionsType = transactionsRes.headers.get("content-type") ?? "";

  if (
    !profileType.includes("application/json") ||
    !transactionsType.includes("application/json")
  ) {
    throw new Error("Invalid response from server");
  }

  const profileData = await profileRes.json();
  const transactionsData = await transactionsRes.json();

  if (!profileRes.ok || !profileData.user) {
    throw new Error(profileData.message || "Failed to load profile");
  }

  if (!transactionsRes.ok) {
    throw new Error(transactionsData.message || "Failed to load transactions");
  }

  return {
    user: profileData.user as UserProfile,
    transcation: (transactionsData.transcation ?? []) as TransactionRecord[],
  };
}

export default function Page() {
  const pathname = usePathname();
  const hasLoadedOnce = useRef(false);
  const [userName, setUserName] = useState("");
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [monthlySalary, setMonthlySalary] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async (silent = false) => {
    try {
      setFetchError(null);

      if (!silent) {
        setIsLoading(true);
      }

      const data = await fetchDashboardPayload();

      setUserName(data.user.userName ?? "");
      setTransactions(data.transcation);
      setMonthlySalary(parseMonthlySalary(data.user.monthlySalary));
      hasLoadedOnce.current = true;
    } catch (error) {
      console.error("Failed to load dashboard data", error);
      setFetchError("Unable to load dashboard data. Check your connection and try again.");

      if (!hasLoadedOnce.current) {
        setTransactions([]);
        setMonthlySalary(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboardData(false);
  }, [loadDashboardData, pathname]);

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
          onRefresh={() => loadDashboardData(true)}
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
