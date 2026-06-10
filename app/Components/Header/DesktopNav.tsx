import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { navItems } from "@/app/lib/navigation";

function isActive(pathname: string, href: string) {
    if (href === "/") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DesktopNav() {
    const pathname = usePathname();

    return (
        // theme-surface 
        <nav className="hidden items-center gap-1 rounded-full p-1.5 md:flex">
            {navItems.map((item) => {
                const active = isActive(pathname, item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={classNames(
                            "rounded-full px-4 py-2.5 text-[0.95rem] font-medium tracking-[-0.01em]",
                            active
                                ? "theme-button-primary"
                                : "theme-surface-medium theme-text-muted hover:opacity-95",
                        )}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}