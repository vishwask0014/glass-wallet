import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { TransactionRecord } from "@/app/types/common";
import { formatCurrency } from "../utils";

type RecentActivityProps = {
  transactions: TransactionRecord[];
  isLoading: boolean;
  error: string | null;
};

function normalizeType(type: unknown) {
  const value = String(type ?? "")
    .trim()
    .toLowerCase();
  return value === "credit" ? "credit" : "debit";
}

export default function RecentActivity({
  transactions,
  isLoading,
  error,
}: RecentActivityProps) {
  return (
    <article className="glass-card rounded-[1.9rem] p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="theme-text-soft text-sm font-medium">Recent activity</p>
          <h2 className="theme-text mt-1 text-2xl font-semibold tracking-[-0.05em]">
            Latest transactions
          </h2>
        </div>
        <Link
          href="/transcations"
          className="icon-chip theme-text transition-opacity hover:opacity-80"
          aria-label="View all transactions"
        >
          <ArrowUpRight size={18} />
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <p className="theme-text-muted text-sm">Loading activity...</p>
        ) : error ? (
          <p className="theme-text-muted text-sm">{error}</p>
        ) : transactions.length === 0 ? (
          <p className="theme-text-muted text-sm">
            No transactions yet. Add one from the transactions page.
          </p>
        ) : (
          transactions.map((entry) => {
            const isCredit = normalizeType(entry.type) === "credit";

            return (
              <div
                key={entry._id}
                className="glass-card rounded-[1.35rem] px-4 py-4"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <div>
                    <p className="theme-text font-semibold">{entry.merchant}</p>
                    <p className="theme-text-soft mt-1 text-sm">
                      {entry.category}
                      {entry.createAt ? ` • ${entry.createAt}` : ""}
                    </p>
                  </div>
                  <p
                    className={`text-lg font-semibold tracking-[-0.04em] ${
                      isCredit ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isCredit ? "+" : "-"}
                    {formatCurrency(Number(entry.amount) || 0)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </article>
  );
}
