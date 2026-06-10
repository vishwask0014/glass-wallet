"use client";

import Link from "next/link";
import { Bell, BrainCog, ChevronDown, ChevronUp, LogOut, User, User2Icon, UserIcon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";
import { useUserStore } from "@/app/store/useUserStore";

export default function DesktopActions() {
    const { userName, email, fetchUser } = useUserStore();
    const [dropdown, setDropdown] = useState(false);

    useEffect(() => {
        void fetchUser();
    }, [])

    return (
        <div className="hidden items-center gap-2 md:flex">
            <button
                aria-label="Notifications"
                className="icon-chip theme-icon-button h-11 w-11 rounded-full"
            >
                <Bell size={18} />
            </button>

            {/* dropdown menu */}
            <div className="relative">
                <button
                    type="button"
                    aria-label="Search"
                    className="icon-chip !text-left theme-icon-button h-11 !w-fit !pe-2 !ps-3 !rounded-[14px] flex gap-2"
                    onClick={() => setDropdown(!dropdown)}
                >
                    <User2Icon />

                    <div>
                        <span className="block">{userName}</span>
                        <span className="block text-[10px] leading-normal">{email}</span>
                    </div>

                    {dropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {dropdown && (
                    <DropdownMenu />
                )}
            </div>
        </div>
    );
}


const DropdownMenu = () => {

    const logutHandle = async () => {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
        })
    }



    return (
        <>
            <div className="absolute right-0 mt-2 w-[180px] backdrop-blur-md glass-card rounded-[0.75rem] shadow-[0_4px_12px_-4px_rgb(0 0 0 / 20%)]">
                <Link
                    href="/profile"
                    className="flex items-center gap-2  px-4 py-2.5 theme-text-muted hover:bg-[color:var(--surface-soft)] hover:theme-text-default"
                >
                    <User size={18} />
                    Profile
                </Link>
                <Link
                    href="/auth"
                    className="flex items-center gap-2 px-4 py-2.5 theme-text-muted hover:bg-[color:var(--surface-soft)] hover:theme-text-default"
                >
                    <BrainCog size={18} />
                    Open AI planner
                </Link>

                <div className="relative">
                    <ThemeToggle />
                </div>

                <Link
                    href="/auth"
                    onClick={logutHandle}
                    className="flex items-center gap-2 px-4 py-2.5 theme-text-muted hover:bg-[color:var(--surface-soft)] hover:theme-text-default"
                >
                    <LogOut size={18} />
                    Log out
                </Link>
            </div>
        </>
    )
}