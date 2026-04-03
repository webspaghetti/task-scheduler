import { cn } from "@/lib/utils";
import React from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode; // action buttons (e.g. "New user")
    className?: string;
}

export function PageHeader({
                               title,
                               description,
                               children,
                               className,
                           }: PageHeaderProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-between px-6 py-4 bg-white border-b border-[#ede9fb]",
                className
            )}
        >
            <div>
                <h1 className="text-[15px] font-semibold text-[#26215C]">{title}</h1>
                {description && (
                    <p className="text-[13px] text-[#8e88a8] mt-0.5">{description}</p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-2">{children}</div>
            )}
        </div>
    );
}