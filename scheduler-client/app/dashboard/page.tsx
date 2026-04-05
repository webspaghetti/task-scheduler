"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { hasRole } from "@/lib/jwt";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import UserDashboard from "@/components/dashboard/user-dashboard";

export default function DashboardPage() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setIsAdmin(hasRole("ADMIN"));
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <PageHeader
                title="Dashboard"
                description={isAdmin ? "Overview of all users, teams and tasks." : "Welcome back - here's what's happening."}
            />
            {isAdmin ? <AdminDashboard /> : <UserDashboard />}
        </>
    );
}