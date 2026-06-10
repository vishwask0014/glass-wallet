import { Bell, Lock, ShieldCheck, UserRound } from 'lucide-react';

export default function Page() {
  return (
    <div className="page-shell py-6 sm:py-10">
      <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="glass-card-strong rounded-[2rem] p-6 sm:p-8">
          <span className="section-kicker">Profile</span>
          <div className="mt-5 flex items-center gap-4">
            <div className="theme-button-primary flex h-20 w-20 items-center justify-center rounded-[1.7rem]">
              <UserRound size={30} />
            </div>
            <div>
              <h1 className="theme-text text-3xl font-semibold tracking-[-0.05em]">
                Abhsi Sharma
              </h1>
              <p className="theme-text-soft mt-1 text-sm">
                AI planning member
              </p>
            </div>
          </div>

          <p className="theme-text-muted mt-6 text-base leading-8">
            Your profile keeps the preferences that shape how AI learns from
            your behavior, how often you want plan updates, and what kinds of
            savings or stock suggestions you are open to.
          </p>

          <div className="mt-8 grid gap-3">
            {[
              ['Email', 'abhsi@example.com'],
              ['Region', 'New Delhi, India'],
              ['Planning style', 'Weekly and monthly guided'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="glass-card rounded-[1.35rem] px-4 py-4"
              >
                <p className="theme-text-soft text-xs font-semibold uppercase tracking-[0.2em]">
                  {label}
                </p>
                <p className="theme-text mt-2 text-base font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </aside>

        <div className="glass-grid">
          <article className="glass-card rounded-[1.8rem] p-6">
            <div className="flex items-center gap-4">
              <div className="icon-chip theme-text">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="theme-text-soft text-sm">Security posture</p>
                <h2 className="theme-text text-2xl font-semibold tracking-[-0.05em]">
                  Protected learning space
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ['Two-factor authentication', 'Enabled'],
                ['Trusted devices', '3 active'],
                ['Behavior sync', 'Habit model active'],
                ['Privacy controls', 'Customizable'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="theme-surface rounded-[1.25rem] px-4 py-4"
                >
                  <p className="theme-text-soft text-sm">{label}</p>
                  <p className="theme-text mt-2 font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="glass-card rounded-[1.8rem] p-6">
            <div className="flex items-center gap-4">
              <div className="icon-chip theme-text">
                <Bell size={18} />
              </div>
              <div>
                <p className="theme-text-soft text-sm">Notifications</p>
                <h2 className="theme-text text-2xl font-semibold tracking-[-0.05em]">
                  AI updates that matter
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                ['Large transactions', 'Push and email'],
                ['Weekly habit digest', 'Every Sunday'],
                ['Stock watch suggestions', 'When surplus is stable'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="theme-surface flex items-center justify-between rounded-[1.25rem] px-4 py-4"
                >
                  <span className="theme-text-muted font-medium">{label}</span>
                  <span className="theme-text-soft text-sm">{value}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="theme-inverse-card rounded-[1.8rem] p-6">
            <div className="flex items-center gap-4">
              <div className="theme-surface rounded-2xl p-3">
                <Lock size={18} />
              </div>
              <div>
                <p className="theme-inverse-muted text-sm">Last secure session</p>
                <h2 className="text-2xl font-semibold tracking-[-0.05em]">
                  MacBook Pro, Safari
                </h2>
              </div>
            </div>
            <p className="theme-inverse-muted mt-4 text-sm leading-7">
              Verified at 11:42 AM. Your AI planner can keep learning from your
              latest activity without any unusual device risk.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
