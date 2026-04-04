"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, useDeleteUser } from "@/hooks/useUsers";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ShieldCheck, ArrowLeft } from "lucide-react";

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

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div className="py-3.5 border-b border-[#f0edf9] last:border-0 flex items-center">
            <span className="w-32 text-[12px] font-medium text-[#b0aac8] uppercase tracking-wider flex-shrink-0">
                {label}
            </span>
            <span className="text-[13px] text-[#3d3654]">{value || "—"}</span>
        </div>
    );
}

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
        <>
            <PageHeader title="User detail">
                <Button
                    variant="ghost"
                    asChild
                    className="text-[13px] text-[#6b6485] hover:text-[#534AB7] hover:bg-[#f3f0fd] h-9 rounded-lg"
                >
                    <Link href="/dashboard/users">
                        <ArrowLeft size={14} className="mr-1.5" />
                        Back
                    </Link>
                </Button>
                <Button
                    variant="outline"
                    asChild
                    className="text-[13px] border-[#ddd9f5] text-[#534AB7] hover:bg-[#f3f0fd] h-9 rounded-lg"
                >
                    <Link href={`/dashboard/users/${id}/edit`}>
                        <Pencil size={13} className="mr-1.5" />
                        Edit
                    </Link>
                </Button>
                <Button
                    variant="outline"
                    disabled={deleting}
                    onClick={handleDelete}
                    className="text-[13px] border-red-200 text-red-500 hover:bg-red-50 h-9 rounded-lg"
                >
                    <Trash2 size={13} className="mr-1.5" />
                    Delete
                </Button>
            </PageHeader>

            <main className="flex-1 p-6">
                {loading && (
                    <div className="text-[13px] text-[#b0aac8]">Loading…</div>
                )}
                {error && (
                    <div className="text-sm text-red-500">{error}</div>
                )}
                {user && (
                    <div className="max-w-xl space-y-5">
                        {/* Avatar + name */}
                        <div className="bg-white border border-[#ede9fb] rounded-xl p-5 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-[#EEEDFE] flex items-center justify-center text-lg font-semibold text-[#534AB7]">
                                {/* Use name initials if available, fallback to username */}
                                {user.firstName && user.lastName
                                    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                                    : user.username.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-[16px] font-semibold text-[#26215C]">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-[13px] text-[#8e88a8]">@{user.username}</p>
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="bg-white border border-[#ede9fb] rounded-xl px-5">
                            <Field label="ID" value={String(user.id)} />
                            <Field label="First Name" value={user.firstName} />
                            <Field label="Last Name" value={user.lastName} />
                            <Field label="Username" value={user.username} />

                            <div className="py-3.5 flex items-center">
                                <span className="w-32 text-[12px] font-medium text-[#b0aac8] uppercase tracking-wider flex-shrink-0">
                                    Roles
                                </span>
                                <div className="flex flex-wrap gap-1.5">
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
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}