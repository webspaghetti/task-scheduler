"use client";

import { PageHeader } from "@/components/ui/page-header";
import { useUsers } from "@/hooks/useUsers";

// Stat card
function StatCard({
                      label,
                      value,
                      sub,
                      isError,
                  }: {
    label: string;
    value: string | number;
    sub?: string;
    isError?: boolean;
}) {
    return (
        <div className="bg-white border border-[#ede9fb] rounded-xl p-4">
            <p className="text-[11px] font-semibold text-[#b0aac8] uppercase tracking-widest mb-1.5">
                {label}
            </p>
            <p className={`text-[26px] font-semibold leading-none ${isError ? "text-red-500" : "text-[#26215C]"}`}>
                {value}
            </p>
            {sub && (
                <p className={`text-[12px] mt-1.5 ${isError ? "text-red-400" : "text-[#8e88a8]"}`}>
                    {sub}
                </p>
            )}
        </div>
    );
}

// Page
export default function DashboardPage() {
    // Destructure the error here too
    const { users, loading, error } = useUsers();

    return (
        <>
            <PageHeader
                title="Dashboard"
                description="Welcome back - here's what's happening."
            />

            <main className="flex-1 p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        label="Users"
                        // Show "..." while loading, "!" if there's an error, otherwise the count
                        value={loading ? "..." : error ? "!" : users.length}
                        // Swap the subtitle if there's an error to give context
                        sub={error ? "Failed to load users" : "Manage in Users tab"}
                        isError={!!error}
                    />
                    <StatCard label="Teams" value="—" sub="Manage in Teams tab" />
                    <StatCard label="Open tasks" value="—" sub="Manage in Tasks tab" />
                </div>

                {/* Placeholder */}
                <div className="bg-white border border-[#ede9fb] rounded-xl p-6 text-center text-[13px] text-[#b0aac8]">
                    History
                </div>
            </main>
        </>
    );
}