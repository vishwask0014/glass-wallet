import { CircleDollarSign, Shield, Zap } from 'lucide-react';

const stats = [
    {
        label: 'Free-to-plan cash',
        value: '$24,860',
        detail: 'AI marks this as available for weekly and monthly planning.',
        icon: CircleDollarSign,
    },
    {
        label: 'Protected reserves',
        value: '$58,240',
        detail: 'Savings goals are staying healthy while spending remains flexible.',
        icon: Shield,
    },
    {
        label: 'Active AI rules',
        value: '09',
        detail: 'Budget pacing, spend alerts, and surplus triggers are running.',
        icon: Zap,
    },
];

export default function StatsGrid() {
    return (
        <div className="mt-8 glass-grid md:grid-cols-3">
            {stats.map(({ label, value, detail, icon: Icon }) => (
                <article key={label} className="glass-card rounded-[1.7rem] p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="icon-chip theme-text">
                            <Icon size={18} />
                        </div>
                        <span className="theme-chip rounded-full px-3 py-1 text-xs font-semibold">
                            AI live
                        </span>
                    </div>
                    <p className="theme-text-soft mt-5 text-sm font-medium">{label}</p>
                    <p className="theme-text mt-2 text-3xl font-semibold tracking-[-0.05em]">
                        {value}
                    </p>
                    <p className="theme-text-muted mt-2 text-sm">{detail}</p>
                </article>
            ))}
        </div>
    );
}