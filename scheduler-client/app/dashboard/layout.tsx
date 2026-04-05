"use client";

import React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#EEECF6]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                {children}
            </div>
        </div>
    );
}