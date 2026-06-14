"use client";

import { useEffect, useState } from "react";

type SpendingTotals = {
  totalDebit: number;
  totalCredit: number;
};

const defaultTotals: SpendingTotals = {
  totalDebit: 0,
  totalCredit: 0,
};

export default function DashboardHero() {
  const [totals, setTotals] = useState<SpendingTotals>(defaultTotals);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTotals() {
      try {
        setFetchError(null);

        const res = await fetch("/api/transaction/totals", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          throw new Error("Invalid response from server");
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch totals");
        }

        setTotals({
          totalDebit: Number(data.totalDebit) || 0,
          totalCredit: Number(data.totalCredit) || 0,
        });
      } catch (error) {
        console.error("NOT ABLE TO FETCH TOTAL SPENDING AMOUNT", error);
        setFetchError("Unable to load totals");
        setTotals(defaultTotals);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTotals();
  }, []);

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <span className="section-kicker">Dashboard</span>
        <h1 className="theme-text mt-4 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
          Your AI command center for habits, plans, and better money decisions.
        </h1>
        <p className="theme-text-muted mt-4 max-w-2xl text-base leading-8">
          This dashboard studies your behavior, compares it with your weekly and
          monthly plans, and turns the gap into practical next actions.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="glass-card rounded-[1.5rem] px-5 py-4">
          <p className="theme-text-soft text-sm font-medium">Total Debit</p>
          <p className="metric-value mt-2 text-2xl font-semibold tracking-[-0.05em] text-red-500">
            {isLoading ? "..." : `₹${totals.totalDebit}`}
          </p>
        </div>

        <div className="glass-card rounded-[1.5rem] px-5 py-4">
          <p className="theme-text-soft text-sm font-medium">Total Credit</p>
          <p className="metric-value mt-2 text-2xl font-semibold tracking-[-0.05em] text-green-500">
            {isLoading ? "..." : `₹${totals.totalCredit}`}
          </p>
        </div>

        {fetchError && (
          <p className="theme-text-muted col-span-2 text-sm">{fetchError}</p>
        )}
      </div>
    </div>
  );
}
