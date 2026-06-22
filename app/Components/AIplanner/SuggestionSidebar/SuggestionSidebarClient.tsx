"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import type { AIsuggestionResult } from "@/app/lib/ai-suggestion";
import FinanceAnalysis from "../FinanceAnalysis/FinanceAnalysis";

type Props = {
  initialResult: AIsuggestionResult;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function SuggestionSidebarClient({ initialResult }: Props) {
  const router = useRouter();
  const [result, setResult] = useState(initialResult);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  async function handleRefresh() {
    setIsRefreshing(true);
    setRefreshError(null);

    try {
      const res = await fetch("/api/ai-planner/AIsuggestion", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: true }),
      });

      const data = (await res.json()) as AIsuggestionResult;

      if (!res.ok || !data.success) {
        throw new Error(
          !data.success ? data.message : "Failed to refresh analysis.",
        );
      }

      setResult(data);
      router.refresh();
    } catch (error) {
      setRefreshError(
        error instanceof Error ? error.message : "Failed to refresh analysis.",
      );
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">AI Suggestion</h2>
          {result.success && (
            <p className="theme-text-soft mt-1 text-xs">
              Updated {formatDate(result.updatedAt)}
              {result.fromCache
                ? ` · auto-refreshes ${formatDate(result.nextRefreshAt)}`
                : " · just refreshed"}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={isRefreshing}
          className="theme-button-secondary inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold disabled:opacity-60"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mt-4">
        {refreshError && (
          <p className="mb-3 text-xs font-medium text-rose-300">{refreshError}</p>
        )}
        {result.success ? (
          <FinanceAnalysis data={result.analysis} />
        ) : (
          <p className="theme-text-soft text-sm">{result.message}</p>
        )}
      </div>
    </>
  );
}
