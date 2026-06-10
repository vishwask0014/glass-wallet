import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-3">
            <div className="icon-chip theme-text">
                <Sparkles size={18} />
            </div>
            <div>
                <p className="theme-text-soft text-[0.68rem] font-semibold uppercase tracking-[0.24em] sm:text-[0.72rem] sm:tracking-[0.28em]">
                    ai habit planning
                </p>
                <p className="theme-text text-[1.05rem] font-semibold tracking-[-0.04em] sm:text-lg">
                    Glass Wallet AI
                </p>
            </div>
        </Link>
    );
}