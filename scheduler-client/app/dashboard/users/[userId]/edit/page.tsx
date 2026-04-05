"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, useUpdateUser, useUserRoles } from "@/hooks/useUsers";
import { UserForm } from "@/components/users/user-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, UserCog } from "lucide-react";
import { AVAILABLE_ROLES } from "@/util/role-utility";
import { RoleBadge } from "@/components/general/role-badge";

export default function EditUserPage({params}: { params: Promise<{ userId: string }>; }) {
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
            // Find what role is being assigned
            const targetRoleName = AVAILABLE_ROLES.find(r => r.id === roleId)?.name;
            const hasManager = user?.roles?.some((r: any) => r.name === "ROLE_MANAGER");
            const managerRole = AVAILABLE_ROLES.find(r => r.name === "ROLE_MANAGER");

            // If assigning Admin, and they aren't already a Manager, chain the assignments
            if (targetRoleName === "ROLE_ADMIN" && !hasManager && managerRole) {
                addRole(roleId, () => {
                    addRole(managerRole.id, () => refetch());
                });
            } else {
                // Default assignment
                addRole(roleId, () => refetch());
            }
        }
    }

    // Check if the user is an admin to enforce the Manager rule
    const isAdmin = user?.roles?.some((r: any) => r.name === "ROLE_ADMIN");

    return (
        <div className="min-h-screen">
            {/* Top nav bar */}
            <div className="bg-white border-b border-[#ede9fb] px-6 py-3 flex items-center justify-between">
                <Link
                    href={`/dashboard/users/${id}`}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-[#8e88a8] hover:text-[#534AB7] transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to user
                </Link>
            </div>

            <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#EEEDFE] flex items-center justify-center text-[#534AB7]">
                        <UserCog size={20} />
                    </div>
                    <div>
                        <h1 className="text-[20px] font-bold text-[#1a1540] tracking-tight">Edit User</h1>
                        <p className="text-[13px] text-[#8e88a8]">Update account details and access levels.</p>
                    </div>
                </div>

                {fetching && !user ? (
                    <div className="flex items-center justify-center py-20 text-[13px] text-[#b0aac8]">
                        Loading user details…
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Account Information Section */}
                        <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm h-fit">
                            <div className="px-6 py-4 border-b border-[#f0edf9] bg-[#fcfbfe]">
                                <h2 className="text-[14px] font-bold text-[#1a1540]">Account Information</h2>
                            </div>
                            <div className="p-6">
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
                        </div>

                        {/* Role Management Section */}
                        <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm h-fit">
                            <div className="px-6 py-4 border-b border-[#f0edf9] bg-[#fcfbfe] flex items-center justify-between">
                                <h2 className="text-[14px] font-bold text-[#1a1540]">Role Management</h2>
                                {roleUpdating && <Loader2 size={16} className="animate-spin text-[#534AB7]" />}
                            </div>

                            {roleError && (
                                <div className="m-4 p-3 text-[13px] text-red-500 bg-red-50 rounded-xl border border-red-100">
                                    {roleError}
                                </div>
                            )}

                            <div className="divide-y divide-[#f0edf9]">
                                {AVAILABLE_ROLES.map((role) => {
                                    let hasRole = user?.roles?.some(
                                        (userRole: any) => userRole.name === role.name
                                    ) ?? false;

                                    // Default button states
                                    let isDisabled = roleUpdating;
                                    let buttonText = hasRole ? "Revoke" : "Assign";
                                    let buttonClass = hasRole
                                        ? "text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200"
                                        : "bg-[#534AB7] hover:bg-[#433997] text-white border-transparent";

                                    // User role cannot be unassigned
                                    if (role.name === "ROLE_USER" && hasRole) {
                                        isDisabled = true;
                                        buttonText = "Required";
                                        buttonClass = "text-[#b0aac8] border-[#f0edf9] bg-[#fcfbfe] cursor-not-allowed";
                                    }

                                    // Admins are inherently Managers
                                    if (role.name === "ROLE_MANAGER" && isAdmin) {
                                        hasRole = true;
                                        isDisabled = true;
                                        buttonText = "Included";
                                        buttonClass = "text-[#7c6fe0] border-[#ede9fb] bg-[#f5f3ff] cursor-not-allowed";
                                    }

                                    return (
                                        <div
                                            key={role.id}
                                            className="flex items-center justify-between p-5 hover:bg-[#faf9fe] transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <RoleBadge name={role.name} />
                                            </div>
                                            <Button
                                                type="button"
                                                variant={hasRole && !isDisabled ? "outline" : "default"}
                                                size="sm"
                                                className={`h-8 text-[12px] font-medium w-[84px] shadow-none rounded-lg cursor-pointer transition-all ${buttonClass}`}
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

                    </div>
                )}
            </main>
        </div>
    );
}