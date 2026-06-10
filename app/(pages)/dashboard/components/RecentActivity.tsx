import { ArrowUpRight } from 'lucide-react';

const activity = [
    { merchant: 'Apple One', category: 'Recurring habit', amount: '-$24.99', tone: '#dc2626' },
    { merchant: 'Payroll Deposit', category: 'Income signal', amount: '+$6,800', tone: '#059669' },
    { merchant: 'MUJI Workspace', category: 'Lifestyle pattern', amount: '-$148.20', tone: '#334155' },
    { merchant: 'Tokyo Savings Jar', category: 'Planned transfer', amount: '+$400', tone: '#0369a1' },
];

export default function RecentActivity() {
    return (
        <article className="glass-card rounded-[1.9rem] p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="theme-text-soft text-sm font-medium">Recent activity</p>
                    <h2 className="theme-text mt-1 text-2xl font-semibold tracking-[-0.05em]">
                        Habit signals from recent spending
                    </h2>
                </div>
                <div className="icon-chip theme-text">
                    <ArrowUpRight size={18} />
                </div>
            </div>

            <div className="mt-6 space-y-3">
                {activity.map((entry) => (
                    <div
                        key={`${entry.merchant}-${entry.amount}`}
                        className="glass-card rounded-[1.35rem] px-4 py-4"
                    >
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                            <div>
                                <p className="theme-text font-semibold">{entry.merchant}</p>
                                <p className="theme-text-soft mt-1 text-sm">{entry.category}</p>
                            </div>
                            <p
                                className="text-lg font-semibold tracking-[-0.04em]"
                                style={{ color: entry.tone }}
                            >
                                {entry.amount}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </article>
    );
}