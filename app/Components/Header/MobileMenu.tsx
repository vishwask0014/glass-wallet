import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { navItems } from "@/app/lib/navigation";
import ThemeToggle from "./ThemeToggle";

function isActive(pathname: string, href: string) {
    if (href === "/") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileMenu() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Hamburger button */}
            <div className="flex items-center gap-2 md:hidden">
                <ThemeToggle />
                <button
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation"
                    onClick={() => setIsOpen((open) => !open)}
                    className="icon-chip theme-icon-button h-11 w-11 rounded-full"
                >
                    {isOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="mt-4 grid gap-2 border-t border-[color:var(--border-soft)] pt-4 md:hidden">
                    {navItems.map((item) => {
                        const active = isActive(pathname, item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={classNames(
                                    "rounded-[1.35rem] px-4 py-3.5 text-[0.98rem] font-medium tracking-[-0.01em]",
                                    active
                                        ? "theme-button-primary"
                                        : "theme-surface theme-text-muted",
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}

                    <Link
                        href="/auth"
                        onClick={() => setIsOpen(false)}
                        className="theme-button-primary mt-1 rounded-[1.35rem] px-4 py-3.5 text-center text-[0.98rem] font-semibold tracking-[-0.01em]"
                    >
                        Open AI planner
                    </Link>
                </div>
            )}
        </>
    );
}