"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUsers, useDeleteUser } from "@/hooks/useUsers";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ShieldCheck, Users } from "lucide-react";

// Priority map for sorting roles
const rolePriority: Record<string, number> = {
    ADMIN: 1,
    MANAGER: 2,
    USER: 3,
};

// Polished Role badge matching the new aesthetic
function RoleBadge({ name }: { name: string }) {
    const label = name.replace("ROLE_", "");

    const roleColors: Record<string, string> = {
        USER: "bg-[#E1F5EE] text-[#0F6E56]",      // Green tint
        MANAGER: "bg-[#EEEDFE] text-[#534AB7]",   // Brand purple tint
        ADMIN: "bg-[#FFF4E5] text-[#B76E00]",     // Amber tint
    };

    const colorClass = roleColors[label.toUpperCase()] || "bg-[#f5f3ff] text-[#7c6fe0]";

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
            <ShieldCheck size={11} />
            {label}
        </span>
    );
}

// Dynamic, colorful avatar generator
function Avatar({ firstName, lastName, username }: { firstName: string, lastName: string, username: string }) {
    const colors = [
        ["#EEF2FF", "#4F46E5"],
        ["#FDF4FF", "#9333EA"],
        ["#FFF7ED", "#EA580C"],
        ["#F0FDF4", "#16A34A"],
        ["#FEF2F2", "#DC2626"],
    ];

    // Hash based on username to keep colors consistent for the same user
    const index = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const [bg, fg] = colors[index];
    const initials = (firstName[0] + lastName[0]).toUpperCase();

    return (
        <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm flex-shrink-0"
            style={{ backgroundColor: bg, color: fg }}
        >
            {initials}
        </div>
    );
}

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
            <PageHeader title="Users" description="Manage user accounts, roles, and access.">
                <Button
                    asChild
                    className="bg-[#534AB7] hover:bg-[#6056c9] text-white rounded-lg text-[13px] h-9 px-4 shadow-sm"
                >
                    <Link href="/dashboard/users/new">
                        <Plus size={14} className="mr-1.5" />
                        New user
                    </Link>
                </Button>
            </PageHeader>

            <main className="flex-1 p-6 mx-auto w-full">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-500 mb-6">
                        {error}
                    </div>
                )}

                <div className="bg-white border border-[#ede9fb] rounded-2xl shadow-sm overflow-hidden">
                    {/* Table header */}
                    <div className="grid grid-cols-[2fr_2fr_2fr_auto] gap-4 px-6 py-3.5 border-b border-[#f0edf9] bg-[#fcfbfe]">
                        <span className="text-[11px] font-bold text-[#b0aac8] uppercase tracking-widest">User</span>
                        <span className="text-[11px] font-bold text-[#b0aac8] uppercase tracking-widest">Full Name</span>
                        <span className="text-[11px] font-bold text-[#b0aac8] uppercase tracking-widest">Roles</span>
                        <span className="text-[11px] font-bold text-[#b0aac8] uppercase tracking-widest text-right pr-2">Actions</span>
                    </div>

                    {/* Table Body */}
                    {loading ? (
                        <div className="px-6 py-20 text-center text-[13px] text-[#b0aac8]">
                            Loading users…
                        </div>
                    ) : users.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#f5f3ff] flex items-center justify-center">
                                <Users size={20} className="text-[#a79fdf]" />
                            </div>
                            <h3 className="text-[15px] font-semibold text-[#1a1540] mb-1">No users found</h3>
                            <p className="text-[13px] text-[#8e88a8]">Create a new user to grant them access.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#f0edf9]">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => router.push(`/dashboard/users/${user.id}`)}
                                    className="grid grid-cols-[2fr_2fr_2fr_auto] gap-4 items-center px-6 py-3.5 hover:bg-[#faf9fe] transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Avatar
                                            firstName={user.firstName}
                                            lastName={user.lastName}
                                            username={user.username}
                                        />
                                        <div className="flex flex-col min-w-0">
                                            <Link
                                                href={`/dashboard/users/${user.id}`}
                                                className="text-[14px] font-bold text-[#1a1540] hover:text-[#534AB7] transition-colors truncate"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {user.username}
                                            </Link>
                                            <span className="text-[12px] text-[#b0aac8] truncate">
                                                ID #{user.id}
                                            </span>
                                        </div>
                                    </div>

                                    <span className="text-[13px] font-medium text-[#6b6485] truncate">
                                        {user.firstName} {user.lastName}
                                    </span>

                                    <div className="flex flex-wrap gap-1.5">
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

                                    {/* Actions - Stop propagation here so clicking buttons doesn't trigger row click */}
                                    <div
                                        className="flex items-center gap-1 justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                            className="h-8 w-8 text-[#8e88a8] hover:text-[#534AB7] hover:bg-[#f0edf9] rounded-lg"
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
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}