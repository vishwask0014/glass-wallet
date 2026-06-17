import Link from "next/link";
import { CircleDollarSign, Percent, Tag, Wallet } from "lucide-react";
import type { DashboardStats } from "../utils";
import { formatCurrency, formatSignedCurrency, getCurrentMonthLabel } from "../utils";

type StatsGridProps = {
  stats: DashboardStats;
  isLoading: boolean;
};

export default function StatsGrid({ stats, isLoading }: StatsGridProps) {
  const monthLabel = getCurrentMonthLabel();

  const remainingTone = stats.isOverBudget
    ? "text-red-500"
    : (stats.remainingBudget ?? 0) > 0
      ? "text-green-500"
      : "theme-text";

  const spentTone =
    (stats.spentPercent ?? 0) >= 80
      ? "text-red-500"
      : (stats.spentPercent ?? 0) >= 50
        ? "text-amber-500"
        : "text-green-500";

  const items = [
    {
      label: "Monthly salary",
      value: isLoading
        ? "..."
        : stats.hasSalary
          ? formatCurrency(stats.monthlySalary ?? 0)
          : "Not set",
      detail: stats.hasSalary
        ? "In-hand salary saved on your profile."
        : "Add salary on profile to unlock budget tracking.",
      icon: Wallet,
      valueClass: "theme-text",
      href: stats.hasSalary ? undefined : "/profile",
    },
    {
      label: "Remaining budget",
      value: isLoading
        ? "..."
        : stats.hasSalary
          ? formatSignedCurrency(stats.remainingBudget ?? 0)
          : "—",
      detail: stats.isOverBudget
        ? `Spending exceeded salary for ${monthLabel}.`
        : `Salary left after ${monthLabel} debits.`,
      icon: CircleDollarSign,
      valueClass: stats.hasSalary ? remainingTone : "theme-text-soft",
    },
    {
      label: "Salary used",
      value: isLoading
        ? "..."
        : stats.hasSalary
          ? `${stats.spentPercent ?? 0}%`
          : "—",
      detail: stats.hasSalary
        ? `${formatCurrency(stats.monthlyDebit)} spent of ${formatCurrency(stats.monthlySalary ?? 0)}.`
        : "Set salary to compare spending against your budget.",
      icon: Percent,
      valueClass: stats.hasSalary ? spentTone : "theme-text-soft",
    },
    {
      label: "Top spend category",
      value: isLoading ? "..." : stats.topCategory,
      detail: `Highest debit category in ${monthLabel}.`,
      icon: Tag,
      valueClass: "theme-text",
    },
  ];

  return (
    <div className="mt-8 glass-grid md:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, detail, icon: Icon, valueClass, href }) => (
        <article key={label} className="glass-card rounded-[1.7rem] p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="icon-chip theme-text">
              <Icon size={18} />
            </div>
            <span className="theme-chip rounded-full px-3 py-1 text-xs font-semibold">
              {monthLabel}
            </span>
          </div>
          <p className="theme-text-soft mt-5 text-sm font-medium">{label}</p>
          <p
            className={`mt-2 text-3xl font-semibold tracking-[-0.05em] ${valueClass}`}
          >
            {value}
          </p>
          <p className="theme-text-muted mt-2 text-sm">{detail}</p>
          {href && !isLoading && (
            <Link
              href={href}
              className="theme-text mt-3 inline-block text-sm font-semibold underline-offset-4 hover:underline"
            >
              Go to profile
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}
