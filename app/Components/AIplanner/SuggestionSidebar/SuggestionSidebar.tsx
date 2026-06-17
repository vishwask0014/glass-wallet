import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  Target,
  Wallet,
} from "lucide-react";

type PlanItem = {
  id: string;
  label: string;
  amount: string;
  note: string;
};

const WEEKLY_ACTIONS = [
  "Set a $60 cap for Friday–Saturday outings.",
  "Move food delivery into a planned weekly bucket.",
  "Review the last 7 days of spending before payday.",
];

const BUDGET_PLAN: PlanItem[] = [
  {
    id: "needs",
    label: "Essentials",
    amount: "50%",
    note: "Rent, bills, groceries, transport",
  },
  {
    id: "goals",
    label: "Savings & goals",
    amount: "20%",
    note: "Emergency fund and monthly targets",
  },
  {
    id: "flex",
    label: "Flexible spend",
    amount: "30%",
    note: "Dining, outings, weekend treats",
  },
];

const PLANNING_FOCUS = {
  title: "Weekend spend window",
  summary:
    "Your highest-risk window is Friday evening through Saturday afternoon. Small repeat purchases there are driving most of the monthly drift.",
  confidence: 84,
};

export default function SuggestionSidebar() {
  return (
    <>
      <aside className="glass-card flex min-h-[20rem] flex-col overflow-hidden rounded-[1.75rem] p-4 lg:min-h-0">
        {/* Header */}
        <div className="shrink-0">
          <div className="flex items-center gap-2">
            <ClipboardList size={16} />
            <div>
              <p className="text-sm font-semibold">Your plan</p>
              <p className="theme-text-soft text-xs">AI-generated summary</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-0.5">
          {/* Focus card */}
          <article className="rounded-[1.2rem] border border-white/10 bg-white/8 p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{PLANNING_FOCUS.title}</p>
                <p className="theme-text-soft mt-1.5 text-xs leading-5">
                  {PLANNING_FOCUS.summary}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-gradient-to-r from-cyan-400/70 to-blue-500/70 px-2 py-0.5 text-[0.68rem] font-semibold text-white">
                {PLANNING_FOCUS.confidence}%
              </span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400/70 to-blue-500/70"
                style={{ width: `${PLANNING_FOCUS.confidence}%` }}
              />
            </div>
          </article>

          {/* Budget split card */}
          <article className="rounded-[1.2rem] border border-white/10 bg-white/8 p-3.5">
            <div className="flex items-center gap-2">
              <Wallet size={14} />
              <p className="text-sm font-semibold">Budget split</p>
            </div>
            <ul className="mt-3 space-y-2">
              {BUDGET_PLAN.map((item) => (
                <li
                  key={item.id}
                  className="rounded-[0.9rem] border border-white/8 bg-white/6 px-2.5 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold">{item.label}</p>
                    <p className="text-xs font-semibold text-cyan-200">
                      {item.amount}
                    </p>
                  </div>
                  <p className="theme-text-soft mt-0.5 text-[0.68rem] leading-4">
                    {item.note}
                  </p>
                </li>
              ))}
            </ul>
          </article>

          {/* Weekly actions card */}
          <article className="rounded-[1.2rem] border border-white/10 bg-white/8 p-3.5">
            <div className="flex items-center gap-2">
              <Target size={14} />
              <p className="text-sm font-semibold">This week</p>
            </div>
            <ul className="theme-text-soft mt-3 space-y-2 text-xs leading-5">
              {WEEKLY_ACTIONS.map((action) => (
                <li key={action} className="flex gap-2">
                  <CheckCircle2
                    size={13}
                    className="mt-0.5 shrink-0 text-emerald-300/80"
                  />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Next check-in card */}
          <article className="rounded-[1.2rem] border border-white/10 bg-white/8 p-3.5">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <p className="text-sm font-semibold">Next check-in</p>
            </div>
            <p className="theme-text-soft mt-2 text-xs leading-5">
              Review progress next Friday before your usual weekend spend window
              opens.
            </p>
          </article>
        </div>
      </aside>
    </>
  );
}
