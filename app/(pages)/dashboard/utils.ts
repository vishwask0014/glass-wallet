import type { TransactionRecord } from "@/app/types/common";

export type DashboardTotals = {
  totalDebit: number;
  totalCredit: number;
  netBalance: number;
  monthlyDebit: number;
  monthlyCredit: number;
};

export type SalaryAnalytics = {
  monthlySalary: number | null;
  remainingBudget: number | null;
  spentPercent: number | null;
  hasSalary: boolean;
  isOverBudget: boolean;
};

export type DashboardStats = {
  remainingBudget: number | null;
  spentPercent: number | null;
  monthlySalary: number | null;
  monthlyDebit: number;
  monthlyCredit: number;
  hasSalary: boolean;
  isOverBudget: boolean;
  topCategory: string;
};

export type CategoryBreakdownItem = {
  name: string;
  amount: number;
  percent: number;
};

export type DashboardData = {
  totals: DashboardTotals;
  salary: SalaryAnalytics;
  stats: DashboardStats;
  recent: TransactionRecord[];
  categoryBreakdown: CategoryBreakdownItem[];
  monthlyTransactionCount: number;
};

function normalizeType(type: unknown) {
  const value = String(type ?? "")
    .trim()
    .toLowerCase();
  return value === "credit" ? "credit" : "debit";
}

export function parseTransactionDate(createAt: string) {
  if (!createAt || createAt === "Invalid Date") {
    return null;
  }

  const parsed = new Date(createAt);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isCurrentMonth(date: Date) {
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function isCurrentMonthTransaction(txn: TransactionRecord) {
  const date = parseTransactionDate(txn.createAt);
  if (!date) {
    return false;
  }

  return isCurrentMonth(date);
}

function getBudgetPeriodTransactions(transactions: TransactionRecord[]) {
  const currentMonth = transactions.filter(isCurrentMonthTransaction);
  const undated = transactions.filter((txn) => !parseTransactionDate(txn.createAt));

  const seen = new Set<string>();
  const merged: TransactionRecord[] = [];

  for (const txn of [...currentMonth, ...undated]) {
    const id = String(txn._id);
    if (seen.has(id)) {
      continue;
    }

    seen.add(id);
    merged.push(txn);
  }

  return merged;
}

function buildCategoryBreakdown(
  transactions: TransactionRecord[],
  totalDebit: number,
) {
  const categoryTotals: Record<string, number> = {};

  for (const txn of transactions) {
    if (normalizeType(txn.type) !== "debit" || !txn.category) {
      continue;
    }

    const amount = Number(txn.amount) || 0;
    categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + amount;
  }

  return Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      percent: totalDebit > 0 ? Math.round((amount / totalDebit) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function sumTransactions(transactions: TransactionRecord[]) {
  let totalDebit = 0;
  let totalCredit = 0;

  for (const txn of transactions) {
    const amount = Number(txn.amount) || 0;

    if (normalizeType(txn.type) === "credit") {
      totalCredit += amount;
    } else {
      totalDebit += amount;
    }
  }

  return { totalDebit, totalCredit };
}

export function parseMonthlySalary(value: unknown) {
  if (value == null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
}

export function computeDashboard(
  transactions: TransactionRecord[],
  monthlySalaryInput: number | null,
): DashboardData {
  const monthlySalary = parseMonthlySalary(monthlySalaryInput);
  const monthlyTransactions = getBudgetPeriodTransactions(transactions);
  const allTime = sumTransactions(transactions);
  const monthly = sumTransactions(monthlyTransactions);

  const categoryBreakdown = buildCategoryBreakdown(
    monthlyTransactions,
    monthly.totalDebit,
  );

  const recent = [...transactions]
    .sort((a, b) => String(b._id).localeCompare(String(a._id)))
    .slice(0, 5);

  const hasSalary = monthlySalary !== null;
  const remainingBudget = hasSalary
    ? monthlySalary - monthly.totalDebit
    : null;
  const spentPercent = hasSalary
    ? Math.round((monthly.totalDebit / monthlySalary) * 100)
    : null;
  const isOverBudget = hasSalary ? monthly.totalDebit > monthlySalary : false;

  return {
    totals: {
      totalDebit: allTime.totalDebit,
      totalCredit: allTime.totalCredit,
      netBalance: allTime.totalCredit - allTime.totalDebit,
      monthlyDebit: monthly.totalDebit,
      monthlyCredit: monthly.totalCredit,
    },
    salary: {
      monthlySalary,
      remainingBudget,
      spentPercent,
      hasSalary,
      isOverBudget,
    },
    stats: {
      remainingBudget,
      spentPercent,
      monthlySalary,
      monthlyDebit: monthly.totalDebit,
      monthlyCredit: monthly.totalCredit,
      hasSalary,
      isOverBudget,
      topCategory: categoryBreakdown[0]?.name ?? "None",
    },
    recent,
    categoryBreakdown,
    monthlyTransactionCount: monthlyTransactions.length,
  };
}

export function formatCurrency(amount: number) {
  return `₹${Math.abs(amount).toLocaleString("en-IN")}`;
}

export function formatSignedCurrency(amount: number) {
  if (amount < 0) {
    return `-₹${Math.abs(amount).toLocaleString("en-IN")}`;
  }

  return formatCurrency(amount);
}

export function getCurrentMonthLabel() {
  return new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export function buildAiSuggestion(
  totals: DashboardTotals,
  salary: SalaryAnalytics,
  monthlyTransactionCount: number,
) {
  if (!salary.hasSalary) {
    return {
      title: "Add your monthly salary to unlock budget insights.",
      detail:
        "Set your in-hand salary on the profile page. The dashboard compares this month's spending against that budget.",
    };
  }

  if (monthlyTransactionCount === 0) {
    return {
      title: `Your monthly budget is ${formatCurrency(salary.monthlySalary!)}.`,
      detail:
        "No spending logged for this budget period yet. Add debits to track how much salary remains.",
    };
  }

  const remaining = salary.remainingBudget ?? 0;
  const spentPercent = salary.spentPercent ?? 0;

  if (salary.isOverBudget) {
    return {
      title: `You are ${formatCurrency(Math.abs(remaining))} over this month's salary.`,
      detail:
        "Monthly debits have exceeded your in-hand salary. Review your top categories and pause non-essential spending.",
    };
  }

  if (spentPercent >= 80) {
    return {
      title: `Only ${formatCurrency(remaining)} left from this month's salary.`,
      detail: `You have already used ${spentPercent}% of your monthly budget. Slow down discretionary spending for the rest of ${getCurrentMonthLabel()}.`,
    };
  }

  if (spentPercent >= 50) {
    return {
      title: `${formatCurrency(remaining)} is still available this month.`,
      detail: `You have used ${spentPercent}% of your salary so far. Spending is moderate, but keep an eye on your top category.`,
    };
  }

  return {
    title: `${formatCurrency(remaining)} remains from your monthly salary.`,
    detail: `You have used only ${spentPercent}% of this month's budget. You are on track for ${getCurrentMonthLabel()}.`,
  };
}
