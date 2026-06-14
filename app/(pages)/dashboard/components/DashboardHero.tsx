import Link from "next/link";
import type { DashboardTotals, SalaryAnalytics } from "../utils";
import { formatCurrency, formatSignedCurrency, getCurrentMonthLabel } from "../utils";

type DashboardHeroProps = {
  userName: string;
  totals: DashboardTotals;
  salary: SalaryAnalytics;
  isLoading: boolean;
  error: string | null;
};

export default function DashboardHero({
  userName,
  totals,
  salary,
  isLoading,
  error,
}: DashboardHeroProps) {
  const monthLabel = getCurrentMonthLabel();

  return (
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
            ? `Comparing ${monthLabel} spending against your monthly in-hand salary of ${formatCurrency(salary.monthlySalary!)}.`
            : "Add your monthly salary on the profile page to unlock budget-based analytics."}
        </p>
        {!salary.hasSalary && !isLoading && (
          <Link
            href="/profile"
            className="theme-button-secondary mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold"
          >
            Set monthly salary
          </Link>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {salary.hasSalary && (
          <div className="glass-card rounded-[1.5rem] px-5 py-4">
            <p className="theme-text-soft text-sm font-medium">Monthly salary</p>
            <p className="metric-value theme-text mt-2 text-2xl font-semibold tracking-[-0.05em]">
              {isLoading ? "..." : formatCurrency(salary.monthlySalary!)}
            </p>
          </div>
        )}

        <div className="glass-card rounded-[1.5rem] px-5 py-4">
          <p className="theme-text-soft text-sm font-medium">
            Spent this month
          </p>
          <p className="metric-value mt-2 text-2xl font-semibold tracking-[-0.05em] text-red-500">
            {isLoading ? "..." : formatCurrency(totals.monthlyDebit)}
          </p>
        </div>

        <div className="glass-card rounded-[1.5rem] px-5 py-4">
          <p className="theme-text-soft text-sm font-medium">
            {salary.hasSalary ? "Remaining budget" : "Income this month"}
          </p>
          <p
            className={`metric-value mt-2 text-2xl font-semibold tracking-[-0.05em] ${
              salary.hasSalary
                ? salary.isOverBudget
                  ? "text-red-500"
                  : "text-green-500"
                : "text-green-500"
            }`}
          >
            {isLoading
              ? "..."
              : salary.hasSalary
                ? formatSignedCurrency(salary.remainingBudget ?? 0)
                : formatCurrency(totals.monthlyCredit)}
          </p>
        </div>

        {error && (
          <p className="theme-text-muted col-span-full text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
