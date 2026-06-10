import { PieChart } from 'lucide-react';

const breakdown = [
    { name: 'Essentials', value: '42%' },
    { name: 'Lifestyle', value: '28%' },
    { name: 'Travel', value: '18%' },
    { name: 'Savings', value: '12%' },
];

export default function SpendBreakdown() {
    return (
        <article className="glass-card rounded-[1.9rem] p-6">
            <div className="flex items-center gap-3">
                <div className="icon-chip theme-text">
                    <PieChart size={18} />
                </div>
                <div>
                    <p className="theme-text-soft text-sm font-medium">Spend mix</p>
                    <h2 className="theme-text text-2xl font-semibold tracking-[-0.05em]">
                        Monthly behavior map
                    </h2>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                {breakdown.map((item) => (
                    <div key={item.name}>
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                            <span className="theme-text-muted font-medium">{item.name}</span>
                            <span className="theme-text-soft">{item.value}</span>
                        </div>
                        <div className="theme-progress-track h-3 rounded-full">
                            <div
                                className="theme-progress-fill h-3 rounded-full"
                                style={{ width: item.value }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </article>
    );
}