import Link from "next/link";
import type { DashboardTotals, SalaryAnalytics } from "../utils";
import {
  formatCurrency,
  formatSignedCurrency,
  getCurrentMonthLabel,
} from "../utils";

type DashboardHeroProps = {
  userName: string;
  totals: DashboardTotals;
  salary: SalaryAnalytics;
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
};

export default function DashboardHero({
  userName,
  totals,
  salary,
  isLoading,
  error,
  onRefresh,
}: DashboardHeroProps) {
  const monthLabel = getCurrentMonthLabel();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="section-kicker">Dashboard</span>
          <h1 className="theme-text mt-4 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
            {userName
              ? `Welcome back, ${userName}.`
              : "Your money overview at a glance."}
          </h1>
          <p className="theme-text-muted mt-4 max-w-2xl text-base leading-8">
            {salary.hasSalary
              ? `Budget view for ${monthLabel}. Your in-hand salary is ${formatCurrency(salary.monthlySalary!)}.`
              : "Set your monthly salary on the profile page to unlock full budget analytics."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {!salary.hasSalary && !isLoading && (
              <Link
                href="/profile"
                className="theme-button-primary inline-flex rounded-full px-4 py-2 text-sm font-semibold"
              >
                Set monthly salary
              </Link>
            )}
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="theme-button-secondary inline-flex rounded-full px-4 py-2 text-sm font-semibold"
              >
                Refresh data
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="glass-card rounded-[1.5rem] px-5 py-4">
          <p className="theme-text-soft text-sm font-medium">Monthly salary</p>
          <p className="metric-value theme-text mt-2 text-2xl font-semibold tracking-[-0.05em]">
            {isLoading
              ? "..."
              : salary.hasSalary
                ? formatCurrency(salary.monthlySalary!)
                : "Not set"}
          </p>
        </div>

        <div className="glass-card rounded-[1.5rem] px-5 py-4">
          <p className="theme-text-soft text-sm font-medium">Spent this month</p>
          <p className="metric-value mt-2 text-2xl font-semibold tracking-[-0.05em] text-red-500">
            {isLoading ? "..." : formatCurrency(totals.monthlyDebit)}
          </p>
        </div>

        <div className="glass-card rounded-[1.5rem] px-5 py-4">
          <p className="theme-text-soft text-sm font-medium">Remaining budget</p>
          <p
            className={`metric-value mt-2 text-2xl font-semibold tracking-[-0.05em] ${
              !salary.hasSalary
                ? "theme-text-soft"
                : salary.isOverBudget
                  ? "text-red-500"
                  : "text-green-500"
            }`}
          >
            {isLoading
              ? "..."
              : salary.hasSalary
                ? formatSignedCurrency(salary.remainingBudget ?? 0)
                : "—"}
          </p>
        </div>

        <div className="glass-card rounded-[1.5rem] px-5 py-4">
          <p className="theme-text-soft text-sm font-medium">Salary used</p>
          <p
            className={`metric-value mt-2 text-2xl font-semibold tracking-[-0.05em] ${
              !salary.hasSalary
                ? "theme-text-soft"
                : (salary.spentPercent ?? 0) >= 80
                  ? "text-red-500"
                  : (salary.spentPercent ?? 0) >= 50
                    ? "text-amber-500"
                    : "text-green-500"
            }`}
          >
            {isLoading
              ? "..."
              : salary.hasSalary
                ? `${salary.spentPercent ?? 0}%`
                : "—"}
          </p>
        </div>
      </div>

      {error && (
        <p className="theme-text-muted text-sm">{error}</p>
      )}
    </div>
  );
}
