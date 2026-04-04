"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, useUpdateUser, useUserRoles } from "@/hooks/useUsers";
import { PageHeader } from "@/components/ui/page-header";
import { UserForm } from "@/components/users/user-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";


const AVAILABLE_ROLES = [
    { id: 3, name: "ROLE_ADMIN", label: "Admin" },
    { id: 2, name: "ROLE_MANAGER", label: "Manager" },
    { id: 1, name: "ROLE_USER", label: "User" },
];

// Role badge
function RoleBadge({ name }: { name: string }) {
    const label = name.replace("ROLE_", "");

    const roleColors: Record<string, string> = {
        USER: "bg-green-100 text-green-700",
        MANAGER: "bg-blue-100 text-blue-700",
        ADMIN: "bg-amber-100 text-amber-700",
    };

    const colorClass = roleColors[label.toUpperCase()] || "bg-purple-100 text-purple-700";

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${colorClass}`}>
            <ShieldCheck size={10} />
            {label}
        </span>
    );
}

export default function EditUserPage({
                                         params,
                                     }: {
    params: Promise<{ userId: string }>;
}) {
    const { userId } = use(params);
    const id = Number(userId);
    const router = useRouter();

    const { user, loading: fetching, refetch } = useUser(id);
    const { updateUser, loading, error } = useUpdateUser(id);
    const { addRole, removeRole, loading: roleUpdating, error: roleError } = useUserRoles(id);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
        }
    }, [user]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = { firstName, lastName };
        updateUser(payload, () => router.push(`/dashboard/users/${id}`));
    }

    function handleToggleRole(roleId: number, hasRole: boolean) {
        if (hasRole) {
            removeRole(roleId, () => refetch());
        } else {
            addRole(roleId, () => refetch());
        }
    }

    // Check if the user is an admin to enforce the Manager rule
    const isAdmin = user?.roles?.some((r: any) => r.name === "ROLE_ADMIN");

    return (
        <>
            <PageHeader title="Edit user" description="Update account details and access.">
                <Button
                    variant="ghost"
                    asChild
                    className="text-[13px] text-[#6b6485] hover:text-[#534AB7] hover:bg-[#f3f0fd] h-9 rounded-lg"
                >
                    <Link href={`/dashboard/users/${id}`}>
                        <ArrowLeft size={14} className="mr-1.5" />
                        Back
                    </Link>
                </Button>
            </PageHeader>

            <main className="flex-1 p-6 space-y-6">
                {fetching && !user ? (
                    <div className="text-[13px] text-[#b0aac8]">Loading…</div>
                ) : (
                    <>
                        {/* Account Information Section */}
                        <div className="max-w-md bg-white border border-[#ede9fb] rounded-xl p-6">
                            <h2 className="text-sm font-semibold text-gray-900 mb-4">Account Information</h2>
                            <UserForm
                                firstName={firstName}
                                lastName={lastName}
                                onFirstNameChange={setFirstName}
                                onLastNameChange={setLastName}
                                onSubmit={handleSubmit}
                                loading={loading}
                                error={error}
                                submitLabel="Save changes"
                            />
                        </div>

                        {/* Role Management Section */}
                        <div className="max-w-md bg-white border border-[#ede9fb] rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-900">Role Management</h2>
                                    <p className="text-[13px] text-gray-500 mt-1">Assign or revoke access levels.</p>
                                </div>
                                {roleUpdating && <Loader2 size={16} className="animate-spin text-[#534AB7]" />}
                            </div>

                            {roleError && (
                                <div className="p-3 mb-4 text-[13px] text-red-600 bg-red-50 rounded-lg border border-red-100">
                                    {roleError}
                                </div>
                            )}

                            <div className="space-y-2">
                                {AVAILABLE_ROLES.map((role) => {
                                    let hasRole = user?.roles?.some(
                                        (userRole: any) => userRole.name === role.name
                                    ) ?? false;

                                    // Default button states
                                    let isDisabled = roleUpdating;
                                    let buttonText = hasRole ? "Revoke" : "Assign";
                                    let buttonClass = hasRole
                                        ? "text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                        : "bg-[#534AB7] hover:bg-[#433997] text-white";

                                    // User role cannot be unassigned
                                    if (role.name === "ROLE_USER" && hasRole) {
                                        isDisabled = true;
                                        buttonText = "Required";
                                        buttonClass = "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed";
                                    }

                                    // Admins are inherently Managers
                                    if (role.name === "ROLE_MANAGER" && isAdmin) {
                                        hasRole = true; // Visually force it to true
                                        isDisabled = true;
                                        buttonText = "Included";
                                        buttonClass = "text-[#534AB7] border-[#ede9fb] bg-[#f3f0fd] cursor-not-allowed";
                                    }

                                    return (
                                        <div
                                            key={role.id}
                                            className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <RoleBadge name={role.name} />
                                            </div>
                                            <Button
                                                type="button"
                                                variant={hasRole && !isDisabled ? "outline" : "default"}
                                                size="sm"
                                                className={`h-8 text-[12px] w-[88px] cursor-pointer transition-all ${buttonClass}`}
                                                disabled={isDisabled}
                                                onClick={() => handleToggleRole(role.id, hasRole)}
                                            >
                                                {buttonText}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}