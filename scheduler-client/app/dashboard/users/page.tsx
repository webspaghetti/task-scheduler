"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUsers, useDeleteUser } from "@/hooks/useUsers";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";

// Priority map for sorting roles
const rolePriority: Record<string, number> = {
    ADMIN: 1,
    MANAGER: 2,
    USER: 3,
};

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

// Avatar initials
function Avatar({ firstName, lastName }: { firstName: string, lastName:string }) {
    const initials = firstName[0].toUpperCase() + lastName[0].toUpperCase();
    return (
        <div className="w-8 h-8 rounded-full bg-[#EEEDFE] flex items-center justify-center text-[11px] font-semibold text-[#534AB7] flex-shrink-0">
            {initials}
        </div>
    );
}

// Page
export default function UsersPage() {
    const router = useRouter();

    const { users, loading, error, refetch } = useUsers();
    const { deleteUser, loading: deleting } = useDeleteUser();

    function handleDelete(userId: number) {
        if (!confirm("Delete this user? This cannot be undone.")) return;
        deleteUser(userId, () => refetch());
    }

    return (
        <>
            <PageHeader title="Users" description="Manage your team members.">
                <Button
                    asChild
                    className="bg-[#534AB7] hover:bg-[#6056c9] text-white rounded-lg text-[13px] h-9 px-4"
                >
                    <Link href="/dashboard/users/new">
                        <Plus size={14} className="mr-1.5" />
                        New user
                    </Link>
                </Button>
            </PageHeader>

            <main className="flex-1 p-6">
                {error && (
                    <p className="text-sm text-red-500 mb-4">{error}</p>
                )}

                <div className="bg-white border border-[#ede9fb] rounded-xl overflow-hidden">
                    {/* Table header */}
                    <div className="grid grid-cols-[2fr_2fr_2fr_auto] gap-4 px-5 py-3 border-b border-[#f0edf9] bg-[#faf9fe]">
                        <span className="text-[11px] font-semibold text-[#b0aac8] uppercase tracking-widest">User</span>
                        <span className="text-[11px] font-semibold text-[#b0aac8] uppercase tracking-widest">Name</span>
                        <span className="text-[11px] font-semibold text-[#b0aac8] uppercase tracking-widest">Roles</span>
                        <span className="text-[11px] font-semibold text-[#b0aac8] uppercase tracking-widest">Actions</span>
                    </div>

                    {/* Rows */}
                    {loading ? (
                        <div className="px-5 py-12 text-center text-[13px] text-[#b0aac8]">
                            Loading users…
                        </div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => router.push(`/dashboard/users/${user.id}`)}
                                className="grid grid-cols-[2fr_2fr_2fr_auto] gap-4 items-center px-5 py-3.5 border-b border-[#f0edf9] last:border-0 hover:bg-[#faf9fe] transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <Avatar firstName={user.firstName} lastName={user.lastName} />
                                    <Link
                                        href={`/dashboard/users/${user.id}`}
                                        className="text-[13px] font-medium text-[#26215C] hover:text-[#534AB7] transition-colors truncate"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {user.username}
                                    </Link>
                                </div>

                                <span className="text-[13px] text-[#6b6485] truncate">
                                    {user.firstName + " " + user.lastName}
                                </span>

                                <div className="flex flex-wrap gap-1">
                                    {[...user.roles]
                                        .sort((a, b) => {
                                            const roleA = a.name.replace("ROLE_", "").toUpperCase();
                                            const roleB = b.name.replace("ROLE_", "").toUpperCase();
                                            const weightA = rolePriority[roleA];
                                            const weightB = rolePriority[roleB];
                                            return weightA - weightB;
                                        })
                                        .map((r) => (
                                            <RoleBadge key={r.id} name={r.name} />
                                            )
                                        )
                                    }
                                </div>

                                {/* Stop propagation here so clicking buttons doesn't trigger row click */}
                                <div
                                    className="flex items-center gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        asChild
                                        className="h-8 w-8 text-[#8e88a8] hover:text-[#534AB7] hover:bg-[#EEEDFE] rounded-lg"
                                    >
                                        <Link href={`/dashboard/users/${user.id}/edit`}>
                                            <Pencil size={13} />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={deleting}
                                        onClick={() => handleDelete(user.id)}
                                        className="h-8 w-8 text-[#8e88a8] hover:text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={13} />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </>
    );
}