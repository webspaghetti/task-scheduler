import React from "react";

export function SectionHeader({ label, count, action }: { label: string; count?: number; action?: React.ReactNode }) {
    return (
        <div className="px-4 py-3 border-b border-[#f0edf9] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#b0aac8] uppercase tracking-widest">
                {label}{count !== undefined ? ` · ${count}` : ""}
            </span>
            {action}
        </div>
    );
}