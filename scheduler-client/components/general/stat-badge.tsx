import React from "react";

export function StatBadge({ count, label, icon, value }: {
    label: string;
    icon: React.ReactNode;
    count?: number;
    value?: React.ReactNode;
}) {
    const displayValue = count !== undefined ? count : value;

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f5f3ff] border border-[#ede9fb]">
            <span className="text-[#7c6fe0]">{icon}</span>
            <span className="text-[12px] font-semibold text-[#534AB7]">{displayValue}</span>
            <span className="text-[12px] text-[#9b94c9]">{label}</span>
        </div>
    );
}