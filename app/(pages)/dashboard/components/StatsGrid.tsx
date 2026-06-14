import { CircleDollarSign, Percent, Tag } from "lucide-react";
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

  const items = stats.hasSalary
    ? [
        {
          label: "Remaining budget",
          value: isLoading
            ? "..."
            : formatSignedCurrency(stats.remainingBudget ?? 0),
          detail: stats.isOverBudget
            ? `Spending exceeded salary for ${monthLabel}.`
            : `Salary left after ${monthLabel} debits.`,
          icon: CircleDollarSign,
          valueClass: remainingTone,
        },
        {
          label: "Salary used",
          value: isLoading ? "..." : `${stats.spentPercent ?? 0}%`,
          detail: `Share of ${formatCurrency(stats.monthlySalary ?? 0)} spent this month.`,
          icon: Percent,
          valueClass: spentTone,
        },
        {
          label: "Top spend category",
          value: isLoading ? "..." : stats.topCategory,
          detail: `Highest debit category in ${monthLabel}.`,
          icon: Tag,
          valueClass: "theme-text",
        },
      ]
    : [
        {
          label: "Monthly salary",
          value: isLoading
            ? "..."
            : stats.monthlySalary
              ? formatCurrency(stats.monthlySalary)
              : "Not set",
          detail: "Add salary on profile to calculate budget analytics.",
          icon: CircleDollarSign,
          valueClass: "theme-text",
        },
        {
          label: "Spent this month",
          value: isLoading ? "..." : formatCurrency(stats.monthlyDebit),
          detail: "Set salary on profile to compare against your budget.",
          icon: Percent,
          valueClass: "text-red-500",
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
    <div className="mt-8 glass-grid md:grid-cols-3">
      {items.map(({ label, value, detail, icon: Icon, valueClass }) => (
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
        </article>
      ))}
    </div>
  );
}
