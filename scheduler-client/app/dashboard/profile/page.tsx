"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUsers";
import { ShieldCheck, ArrowLeft, User } from "lucide-react";

const rolePriority: Record<string, number> = { ADMIN: 1, MANAGER: 2, USER: 3 };

const roleColors: Record<string, string> = {
    USER:    "bg-[#E1F5EE] text-[#0F6E56]",
    MANAGER: "bg-[#EEEDFE] text-[#534AB7]",
    ADMIN:   "bg-[#FFF4E5] text-[#B76E00]",
};

function RoleBadge({ name }: { name: string }) {
    const label = name.replace("ROLE_", "");
    const colorClass = roleColors[label.toUpperCase()] || "bg-[#f5f3ff] text-[#7c6fe0]";
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
            <ShieldCheck size={11} />
            {label}
        </span>
    );
}

function Avatar({ firstName, lastName, username, size = "md" }: { firstName?: string, lastName?: string, username: string, size?: "md" | "lg" }) {
    const colors = [
        ["#EEF2FF", "#4F46E5"],
        ["#FDF4FF", "#9333EA"],
        ["#FFF7ED", "#EA580C"],
        ["#F0FDF4", "#16A34A"],
        ["#FEF2F2", "#DC2626"],
    ];

    // Hash based on username to keep colors consistent for the same user
    const index = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const [bg, fg] = colors[index];

    const initials = (firstName?.[0] || "") + (lastName?.[0] || "");
    const displayInitials = initials ? initials.toUpperCase() : username.slice(0, 2).toUpperCase();

    const sizeClasses = size === "lg" ? "w-14 h-14 text-[18px]" : "w-9 h-9 text-[11px]";

    return (
        <div
            className={`${sizeClasses} rounded-full flex items-center justify-center font-bold shadow-sm flex-shrink-0`}
            style={{ backgroundColor: bg, color: fg }}
        >
            {displayInitials}
        </div>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div className="py-4 border-b border-[#f0edf9] last:border-0 flex items-center">
            <span className="w-36 text-[11px] font-bold text-[#b0aac8] uppercase tracking-widest flex-shrink-0">
                {label}
            </span>
            <span className="text-[14px] font-medium text-[#2d2860]">{value || "—"}</span>
        </div>
    );
}

export default function ProfilePage() {
    const { userId } = useAuth();
    const { user, loading, error } = useUser(userId ?? 0);

    return (
        <div className="min-h-screen">
            {/* Top bar */}
            <div className="bg-white border-b border-[#ede9fb] px-6 py-3 flex items-center justify-between">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-[13px] text-[#8e88a8] hover:text-[#534AB7] transition-colors"
                >
                    <ArrowLeft size={14} />
                    Dashboard
                </Link>
            </div>

            <main className="max-w-3xl mx-auto px-6 py-8">
                {loading && (
                    <div className="flex items-center justify-center py-20 text-[13px] text-[#b0aac8]">
                        Loading your profile…
                    </div>
                )}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-500">
                        {error}
                    </div>
                )}

                {user && (
                    <div className="space-y-6">
                        {/* Hero Header */}
                        <div className="bg-white border border-[#ede9fb] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
                            <Avatar
                                firstName={user.firstName}
                                lastName={user.lastName}
                                username={user.username}
                                size="lg"
                            />
                            <div className="flex-1">
                                <h1 className="text-[20px] font-bold text-[#1a1540] tracking-tight">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <p className="text-[14px] text-[#8e88a8] mt-0.5 font-medium flex items-center gap-1.5">
                                    <User size={14} className="text-[#c4bedd]" />
                                    @{user.username}
                                </p>
                            </div>

                            {/* Role Badges moved to the hero area */}
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                                {[...user.roles]
                                    .sort((a, b) => {
                                        const roleA = a.name.replace("ROLE_", "").toUpperCase();
                                        const roleB = b.name.replace("ROLE_", "").toUpperCase();
                                        return rolePriority[roleA] - rolePriority[roleB];
                                    })
                                    .map((r) => (
                                        <RoleBadge key={r.id} name={r.name} />
                                    ))
                                }
                            </div>
                        </div>

                        {/* Detailed Fields */}
                        <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-6 py-3 border-b border-[#f0edf9] bg-[#fcfbfe]">
                                <span className="text-[11px] font-bold text-[#b0aac8] uppercase tracking-widest">
                                    Account Information
                                </span>
                            </div>
                            <div className="px-6">
                                <Field label="User ID" value={`#${user.id}`} />
                                <Field label="First Name" value={user.firstName} />
                                <Field label="Last Name" value={user.lastName} />
                                <Field label="Username" value={user.username} />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}