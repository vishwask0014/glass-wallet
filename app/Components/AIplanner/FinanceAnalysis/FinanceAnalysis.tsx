"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface FinanceAnalysis {
  summary: string;
  topSpendingCategories: SpendingCategory[];
  insights: string[];
  suggestions: string[];
  weeklyPlan: string;
  savingsOpportunity: number;
}

const CATEGORY_COLORS = ["#378ADD", "#D85A30", "#D4537E", "#1D9E75", "#888780"];

export default function FinanceAnalysis({ data }: { data: FinanceAnalysis }) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const totalSpent = data.topSpendingCategories.reduce((s, c) => s + c.amount, 0);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: data.topSpendingCategories.map((c) => c.category),
        datasets: [
          {
            data: data.topSpendingCategories.map((c) => c.amount),
            backgroundColor: CATEGORY_COLORS,
            borderRadius: 4,
            barThickness: 28,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ₹${ctx?.parsed?.x.toLocaleString("en-IN") || 0}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(0,0,0,0.06)" },
            ticks: {
              font: { size: 11 },
              callback: (v) => `₹${(Number(v) / 1000).toFixed(0)}k`,
            },
            border: { display: false },
          },
          y: {
            grid: { display: false },
            border: { display: false },
          },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [data]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header + Summary */}
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
          GlassWallet AI · Spending Report
        </p>
        <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
          Your financial snapshot
        </h2>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">{data.summary}</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: "Total spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, sub: `${data.topSpendingCategories.length + 1}+ categories` },
          { label: "Avg per txn", value: `₹${Math.round(totalSpent / 12).toLocaleString("en-IN")}`, sub: "medium-sized" },
          { label: "Savings target", value: `₹${data.savingsOpportunity.toLocaleString("en-IN")}`, sub: "achievable / mo" },
        ].map((m) => (
          <div key={m.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3.5">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">{m.label}</p>
            <p className="text-xl font-medium text-gray-900 dark:text-gray-100">{m.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Savings Banner */}
      <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950 rounded-xl px-5 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
            Monthly savings opportunity
          </p>
          <p className="text-2xl font-medium text-emerald-700 dark:text-emerald-300">
            ₹{data.savingsOpportunity.toLocaleString("en-IN")} / mo
          </p>
        </div>
        <span className="text-3xl">🪙</span>
      </div>

      {/* Chart */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Spending by category</p>
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4">
            {data.topSpendingCategories.map((c, i) => (
              <span key={c.category} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ background: CATEGORY_COLORS[i] }}
                />
                {c.category} {c.percentage}%
              </span>
            ))}
          </div>
          <div className="relative w-full" style={{ height: `${data.topSpendingCategories.length * 56 + 40}px` }}>
            <canvas ref={chartRef} />
          </div>
        </div>
      </div>

      {/* Insights */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">What the data shows</p>
        <div className="space-y-2.5">
          {data.insights.map((insight, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3"
            >
              <span className="text-blue-500 text-sm mt-0.5 flex-shrink-0">◈</span>
              <p className="text-sm text-gray-500 leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
          Suggestions — highest impact first
        </p>
        <div className="space-y-2.5">
          {data.suggestions.map((sug, i) => (
            <div
              key={i}
              className="flex items-start gap-3 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3.5"
            >
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 rounded px-2 py-0.5 flex-shrink-0 mt-0.5 whitespace-nowrap">
                #{i + 1} save
              </span>
              <p className="text-sm text-gray-500 leading-relaxed">{sug}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Plan */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Weekly spending plan</p>
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl px-5 py-4">
          <p className="text-sm text-gray-500 leading-relaxed">{data.weeklyPlan}</p>
        </div>
      </div>
    </div>
  );
}