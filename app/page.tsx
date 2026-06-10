import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { navItems } from "./lib/navigation";

const highlights = [
  {
    title: "Habit learning score",
    value: "92%",
    note: "AI tracks weekday, weekend, and pay-cycle behavior to understand how your money actually moves.",
    icon: Wallet,
  },
  {
    title: "Monthly plan drift",
    value: "-12%",
    note: "This month is pacing below plan, which means your essentials are covered with room to save.",
    icon: TrendingUp,
  },
  {
    title: "Investment-ready ideas",
    value: "4",
    note: "Your spare cash pattern is stable enough for AI to suggest reserve moves and first stock picks.",
    icon: ShieldCheck,
  },
];

const features = [
  "AI explains why it recommends a weekly or monthly spending adjustment.",
  "Habit learning turns transaction history into a practical money plan.",
  "Surplus analysis helps you split extra cash between savings and stock opportunities.",
];

export default function Home() {
  return (
    <div className="page-shell py-6 sm:py-10">
      <section className="glass-card-strong overflow-hidden rounded-[2rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="section-kicker">
              <Sparkles size={14} />
              AI-driven money habit coach
            </span>

            <div className="space-y-4">
              <h1 className="page-title theme-text max-w-3xl">
                Understand your spending habits and turn them into a smarter money plan.
              </h1>
              <p className="theme-text-muted max-w-2xl text-base leading-8 sm:text-lg">
                Glass Wallet AI learns from how you spend each week and month,
                identifies patterns in your habits, and suggests better ways to
                budget, save, and invest with clear AI reasoning.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth"
                className="theme-button-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold sm:w-auto"
              >
                Start my AI money plan
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard"
                className="theme-button-secondary inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold sm:w-auto"
              >
                Explore habit insights
              </Link>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="theme-surface rounded-2xl px-4 py-4 text-sm leading-6 theme-text-muted"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[1.85rem] p-4 sm:p-5">
            <div className="glass-card-strong rounded-[1.6rem] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="theme-text-soft text-sm font-medium">
                    AI planning snapshot
                  </p>
                  <p className="theme-text mt-1 text-3xl font-semibold tracking-[-0.05em]">
                    $142,880
                  </p>
                </div>
                <div className="theme-success-pill rounded-full px-3 py-1 text-xs font-semibold">
                  Weekly budget on track
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {highlights.map(({ title, value, note, icon: Icon }) => (
                  <div
                    key={title}
                    className="glass-card rounded-[1.35rem] p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="icon-chip theme-text shrink-0">
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                          <p className="theme-text font-semibold">{title}</p>
                          <p className="theme-text text-lg font-semibold tracking-[-0.04em]">
                            {value}
                          </p>
                        </div>
                        <p className="theme-text-muted mt-1 text-sm leading-6">
                          {note}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="theme-inverse-card rounded-[1.35rem] px-4 py-4">
                  <p className="theme-inverse-muted text-sm">This week&apos;s planned spend</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                    $318
                  </p>
                  <p className="theme-inverse-muted mt-2 text-sm">
                    AI expects you to finish the week inside your safe spending range.
                  </p>
                </div>
                <div className="theme-surface-medium rounded-[1.35rem] px-4 py-4">
                  <p className="theme-text-soft text-sm">Planning confidence</p>
                  <p className="theme-text mt-2 text-3xl font-semibold tracking-[-0.05em]">
                    8.7/10
                  </p>
                  <p className="theme-text-muted mt-2 text-sm">
                    There is enough behavior history to suggest budget shifts, reserve targets, and stock ideas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card rounded-[1.8rem] p-6">
          <p className="section-kicker">Navigation</p>
          <h2 className="theme-text mt-4 text-3xl font-semibold tracking-[-0.05em]">
            Every route supports one AI-first flow: learn, plan, and improve.
          </h2>
          <div className="mt-6 grid gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="theme-surface flex items-center justify-between rounded-[1.35rem] px-4 py-4 text-sm font-medium theme-text-muted hover:opacity-95"
              >
                <span>{item.label}</span>
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="glass-card rounded-[1.8rem] p-6">
            <div className="icon-chip theme-text">
              <CreditCard size={18} />
            </div>
            <h3 className="theme-text mt-5 text-2xl font-semibold tracking-[-0.05em]">
              Spending habits made understandable
            </h3>
            <p className="theme-text-muted mt-3 text-sm leading-7">
              Each transaction helps the app learn your routine so weekly and
              monthly recommendations get sharper over time.
            </p>
          </article>

          <article className="glass-card rounded-[1.8rem] p-6">
            <div className="icon-chip theme-text">
              <ShieldCheck size={18} />
            </div>
            <h3 className="theme-text mt-5 text-2xl font-semibold tracking-[-0.05em]">
              Better money decisions with AI context
            </h3>
            <p className="theme-text-muted mt-3 text-sm leading-7">
              Budget coaching, reserve targets, and stock suggestions are shown
              with reasoning based on your habits instead of generic advice.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
