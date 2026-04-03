import { PageHeader } from "@/components/ui/page-header";

// Stat card
function StatCard({
                      label,
                      value,
                      sub,
                  }: {
    label: string;
    value: string | number;
    sub?: string;
}) {
    return (
        <div className="bg-white border border-[#ede9fb] rounded-xl p-4">
            <p className="text-[11px] font-semibold text-[#b0aac8] uppercase tracking-widest mb-1.5">
                {label}
            </p>
            <p className="text-[26px] font-semibold text-[#26215C] leading-none">
                {value}
            </p>
            {sub && (
                <p className="text-[12px] text-[#8e88a8] mt-1.5">{sub}</p>
            )}
        </div>
    );
}

// Page
export default function DashboardPage() {
    return (
        <>
            <PageHeader
                title="Dashboard"
                description="Welcome back — here's what's happening."
            />

            <main className="flex-1 p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Users" value="—" sub="Manage in Users tab" />
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