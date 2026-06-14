import { PieChart } from "lucide-react";
import type { CategoryBreakdownItem } from "../utils";
import { formatCurrency, getCurrentMonthLabel } from "../utils";

type SpendBreakdownProps = {
  breakdown: CategoryBreakdownItem[];
  isLoading: boolean;
};

export default function SpendBreakdown({
  breakdown,
  isLoading,
}: SpendBreakdownProps) {
  return (
    <article className="glass-card rounded-[1.9rem] p-6">
      <div className="flex items-center gap-3">
        <div className="icon-chip theme-text">
          <PieChart size={18} />
        </div>
        <div>
          <p className="theme-text-soft text-sm font-medium">Spend mix</p>
          <h2 className="theme-text text-2xl font-semibold tracking-[-0.05em]">
            {getCurrentMonthLabel()} spend mix
          </h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <p className="theme-text-muted text-sm">Loading breakdown...</p>
        ) : breakdown.length === 0 ? (
          <p className="theme-text-muted text-sm">
            No debit spending logged for {getCurrentMonthLabel()}.
          </p>
        ) : (
          breakdown.map((item) => (
            <div key={item.name}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="theme-text-muted font-medium">{item.name}</span>
                <span className="theme-text-soft">
                  {item.percent}% • {formatCurrency(item.amount)}
                </span>
              </div>
              <div className="theme-progress-track h-3 rounded-full">
                <div
                  className="theme-progress-fill h-3 rounded-full"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
