"use client";

import DesktopActions from "./DesktopActions";
import DesktopNav from "./DesktopNav";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-2.5 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5">
      <div className="page-shell">
        <div className="glass-toolbar rounded-[1.9rem] px-3.5 py-3 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <Logo />
            <DesktopNav />
            <DesktopActions />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}