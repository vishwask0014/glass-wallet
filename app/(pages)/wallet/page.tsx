import { CreditCard, Landmark, Smartphone, Wallet as WalletIcon } from 'lucide-react';

const cards = [
  {
    title: 'Weekly spending card',
    number: '**** 0942',
    limit: '$18,000',
    style: {
      background: 'linear-gradient(135deg, rgba(15,23,42,0.96), rgba(51,65,85,0.88))',
      color: '#ffffff',
    },
  },
  {
    title: 'Planned debit flow',
    number: '**** 4418',
    limit: '$6,400',
    style: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.88), rgba(255,255,255,0.54))',
      color: '#10213b',
    },
  },
];

const pockets = [
  { name: 'This week spend zone', amount: '$3,920', icon: WalletIcon },
  { name: 'Protected savings base', amount: '$24,860', icon: Landmark },
  { name: 'Ready for quick pay', amount: '3 devices', icon: Smartphone },
];

export default function Page() {
  return (
    <div className="page-shell py-6 sm:py-10">
      <section className="glass-card-strong rounded-[2rem] p-6 sm:p-8">
        <span className="section-kicker">Wallet</span>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="theme-text text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
              Keep spending, savings, and planned cash in one AI-guided wallet.
            </h1>
            <p className="theme-text-muted mt-4 max-w-2xl text-base leading-8">
              Your wallet is organized around what AI thinks you can safely
              spend now, what should stay protected, and what could later move
              toward investing.
            </p>
          </div>
          <div className="glass-card rounded-[1.5rem] px-5 py-4">
            <p className="theme-text-soft text-sm font-medium">Available for planned spending</p>
            <p className="theme-text metric-value mt-2">$34,520</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-grid">
          {cards.map((card) => (
            <article
              key={card.number}
              className="rounded-[2rem] border border-white/40 p-6 shadow-[0_24px_48px_rgba(31,41,55,0.16)]"
              style={card.style}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm opacity-70">{card.title}</p>
                  <p className="mt-4 text-2xl font-semibold tracking-[0.18em]">
                    {card.number}
                  </p>
                </div>
                <div className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold">
                  AI tracked
                </div>
              </div>

              <div className="mt-12 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] opacity-65">
                    Planned limit
                  </p>
                  <p className="mt-2 text-xl font-semibold">{card.limit}</p>
                </div>
                <CreditCard size={26} className="opacity-80" />
              </div>
            </article>
          ))}
        </div>

        <div className="glass-grid">
          {pockets.map(({ name, amount, icon: Icon }) => (
            <article key={name} className="glass-card rounded-[1.8rem] p-5">
              <div className="flex items-center gap-4">
                <div className="icon-chip theme-text">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="theme-text-soft text-sm">{name}</p>
                  <p className="theme-text mt-1 text-2xl font-semibold tracking-[-0.05em]">
                    {amount}
                  </p>
                </div>
              </div>
            </article>
          ))}

          <article className="glass-card rounded-[1.8rem] p-5">
            <p className="theme-text-soft text-sm font-medium">Recent wallet decisions</p>
            <div className="mt-5 space-y-4">
              {[
                ['Weekly food buffer added', '+$120'],
                ['Travel budget parked', '+$750'],
                ['Impulse spend limit reduced', '-$45'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="theme-surface flex items-center justify-between rounded-[1.2rem] px-4 py-3"
                >
                  <span className="theme-text-muted text-sm font-medium">{label}</span>
                  <span className="theme-text text-sm font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
