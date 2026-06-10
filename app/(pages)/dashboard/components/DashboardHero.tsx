export default function DashboardHero() {
    return (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <span className="section-kicker">Dashboard</span>
                <h1 className="theme-text mt-4 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
                    Your AI command center for habits, plans, and better money decisions.
                </h1>
                <p className="theme-text-muted mt-4 max-w-2xl text-base leading-8">
                    This dashboard studies your behavior, compares it with your weekly
                    and monthly plans, and turns the gap into practical next actions.
                </p>
            </div>

            <div className="glass-card rounded-[1.5rem] px-5 py-4">
                <p className="theme-text-soft text-sm font-medium">AI tracked total balance</p>
                <p className="theme-text metric-value mt-2">$142,880</p>
            </div>
        </div>
    );
}