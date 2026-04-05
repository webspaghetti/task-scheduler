import React from "react";
import Link from "next/link";

export function StatCard({label, value, sub, isError, icon, href }: {
    label: string;
    value: string | number;
    sub?: string;
    isError?: boolean;
    icon: React.ReactNode;
    href?: string;
}) {
    const inner = (
        <div className={`bg-white border border-[#ede9fb] rounded-xl p-4 group transition-shadow h-full ${href ? "hover:shadow-md cursor-pointer" : ""}`}>
            <div className="flex items-start justify-between mb-3">
                <p className="text-[11px] font-semibold text-[#b0aac8] uppercase tracking-widest">
                    {label}
                </p>
                <div className="w-7 h-7 rounded-lg bg-[#f5f3ff] flex items-center justify-center text-[#7c6fe0]">
                    {icon}
                </div>
            </div>
            <p className={`text-[28px] font-semibold leading-none ${isError ? "text-red-500" : "text-[#26215C]"}`}>
                {value}
            </p>
            {sub && (
                <p className={`text-[12px] mt-1.5 ${isError ? "text-red-400" : "text-[#8e88a8]"}`}>
                    {sub}
                </p>
            )}
        </div>
    );

    return href ? <Link href={href} className="block">{inner}</Link> : inner;
}