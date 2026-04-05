"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, useDeleteUser } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowLeft, User } from "lucide-react";
import { Avatar } from "@/components/general/avatar";
import { rolePriority } from "@/util/role-utility";
import { Field } from "@/components/general/field";
import { RoleBadge } from "@/components/general/role-badge";

export default function UserDetailPage({
                                           params,
                                       }: {
    params: Promise<{ userId: string }>;
}) {
    const { userId } = use(params);
    const id = Number(userId);
    const router = useRouter();
    const { user, loading, error } = useUser(id);
    const { deleteUser, loading: deleting } = useDeleteUser();

    function handleDelete() {
        if (!confirm("Delete this user? This cannot be undone.")) return;
        deleteUser(id, () => router.push("/dashboard/users"));
    }

    return (
        <div className="min-h-screen">
            {/* Top nav bar matching TeamDetailPage */}
            <div className="bg-white border-b border-[#ede9fb] px-6 py-3 flex items-center justify-between">
                <Link
                    href="/dashboard/users"
                    className="flex items-center gap-1.5 text-[13px] text-[#8e88a8] hover:text-[#534AB7] transition-colors"
                >
                    <ArrowLeft size={14} />
                    Users
                </Link>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        asChild
                        className="text-[13px] border-[#ddd9f5] text-[#534AB7] hover:bg-[#f3f0fd] h-8 px-3 rounded-lg gap-1.5"
                    >
                        <Link href={`/dashboard/users/${id}/edit`}>
                            <Pencil size={12} />
                            Edit
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        disabled={deleting}
                        onClick={handleDelete}
                        className="text-[13px] border-red-100 text-red-400 hover:bg-red-50 hover:border-red-200 h-8 px-3 rounded-lg gap-1.5"
                    >
                        <Trash2 size={12} />
                        Delete
                    </Button>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-6 py-8">
                {loading && (
                    <div className="flex items-center justify-center py-20 text-[13px] text-[#b0aac8]">
                        Loading user details…
                    </div>
                )}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-500">
                        {error}
                    </div>
                )}

                {user && (
                    <div className="space-y-6">
                        {/* Hero Header */}
                        <div className="bg-white border border-[#ede9fb] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
                            <Avatar
                                firstName={user.firstName}
                                lastName={user.lastName}
                                username={user.username}
                                size="lg"
                            />
                            <div className="flex-1">
                                <h1 className="text-[20px] font-bold text-[#1a1540] tracking-tight">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <p className="text-[14px] text-[#8e88a8] mt-0.5 font-medium flex items-center gap-1.5">
                                    <User size={14} className="text-[#c4bedd]" />
                                    @{user.username}
                                </p>
                            </div>

                            {/* Role Badges moved to the hero area */}
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                                {[...user.roles]
                                    .sort((a, b) => {
                                        const roleA = a.name.replace("ROLE_", "").toUpperCase();
                                        const roleB = b.name.replace("ROLE_", "").toUpperCase();
                                        return rolePriority[roleA] - rolePriority[roleB];
                                    })
                                    .map((r) => (
                                        <RoleBadge key={r.id} name={r.name} />
                                    ))
                                }
                            </div>
                        </div>

                        {/* Detailed Fields */}
                        <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-6 py-3 border-b border-[#f0edf9] bg-[#fcfbfe]">
                                <span className="text-[11px] font-bold text-[#b0aac8] uppercase tracking-widest">
                                    Account Information
                                </span>
                            </div>
                            <div className="px-6">
                                <Field label="User ID" value={`#${user.id}`} />
                                <Field label="First Name" value={user.firstName} />
                                <Field label="Last Name" value={user.lastName} />
                                <Field label="Username" value={user.username} />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}