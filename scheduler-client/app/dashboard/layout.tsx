"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { clearAuth } from "@/lib/auth";
import { LogoMark } from "@/components/ui/logo-mark";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
    LayoutDashboard,
    Users,
    Network,
    ClipboardList,
    ListChecks,
    LogOut,
    CircleUserRound,
} from "lucide-react";
import React, { useState, useEffect } from "react";

// Nav items
const NAV = [
    {
        section: "Overview",
        items: [
            { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        section: "Manage",
        items: [
            { label: "Users", href: "/dashboard/users", icon: Users, adminOnly: true },
            { label: "Teams", href: "/dashboard/teams", icon: Network },
            { label: "All Tasks", href: "/dashboard/all-tasks", icon: ListChecks, adminOnly: true },
            { label: "My Tasks", href: "/dashboard/my-tasks", icon: ClipboardList },
        ],
    },
];

// Sidebar
function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isAdmin } = useAuth();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    async function handleLogout() {
        try {
            clearAuth();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <aside className="w-[220px] flex-shrink-0 flex flex-col bg-white border-r border-[#ede9fb] h-screen sticky top-0">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-[18px] py-5">
                <LogoMark size={26} />
                <span className="text-[13px] font-semibold text-[#26215C] tracking-wide">
                    teamflow
                </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-2 pb-4">
                {NAV.map(({ section, items }) => {
                    const visibleItems = items.filter(
                        (item) => !item.adminOnly || (isMounted && isAdmin)
                    );

                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={section} className="mt-4">
                            <p className="px-3 mb-1 text-[10px] font-semibold text-[#b0aac8] uppercase tracking-widest">
                                {section}
                            </p>
                            {visibleItems.map(({ label, href, icon: Icon }) => {
                                const active =
                                    href === "/dashboard"
                                        ? pathname === "/dashboard"
                                        : pathname.startsWith(href);
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={cn(
                                            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors my-0.5",
                                            active
                                                ? "bg-[#EEEDFE] text-[#534AB7] font-medium"
                                                : "text-[#6b6485] hover:bg-[#f3f0fd] hover:text-[#534AB7]"
                                        )}
                                    >
                                        <Icon
                                            size={15}
                                            className={active ? "opacity-100" : "opacity-60"}
                                        />
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    );
                })}
            </nav>

            {/* Bottom actions */}
            <div className="border-t border-[#f0edf9] p-2 space-y-0.5">
                <Link
                    href="/dashboard/profile"
                    className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors",
                        pathname === "/dashboard/profile"
                            ? "bg-[#EEEDFE] text-[#534AB7] font-medium"
                            : "text-[#6b6485] hover:bg-[#f3f0fd] hover:text-[#534AB7]"
                    )}
                >
                    <CircleUserRound
                        size={15}
                        className={pathname === "/dashboard/profile" ? "opacity-100" : "opacity-60"}
                    />
                    Profile
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#6b6485] hover:bg-[#f3f0fd] hover:text-[#534AB7] transition-colors cursor-pointer"
                >
                    <LogOut size={15} className="opacity-60" />
                    Sign out
                </button>
            </div>
        </aside>
    );
}

// Layout
export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#EEECF6]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                {children}
            </div>
        </div>
    );
}