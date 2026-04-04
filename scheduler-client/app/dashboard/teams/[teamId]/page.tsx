"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    useTeam,
    useTeamMembership,
    useDeleteTeam,
    useNonTeamMembers
} from "@/hooks/useTeams";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2, UserPlus, UserMinus, ListTodo, CheckCircle2, Users, Circle } from "lucide-react";

function Avatar({ username }: { username: string }) {
    const colors = [
        ["#EEF2FF", "#4F46E5"],
        ["#FDF4FF", "#9333EA"],
        ["#FFF7ED", "#EA580C"],
        ["#F0FDF4", "#16A34A"],
        ["#FEF2F2", "#DC2626"],
    ];
    const [bg, fg] = colors[username.charCodeAt(0) % colors.length];
    return (
        <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0 shadow-sm"
            style={{ backgroundColor: bg, color: fg }}
        >
            {username.slice(0, 2).toUpperCase()}
        </div>
    );
}

function StatBadge({ count, label, icon }: { count: number; label: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f5f3ff] border border-[#ede9fb]">
            <span className="text-[#7c6fe0]">{icon}</span>
            <span className="text-[12px] font-semibold text-[#534AB7]">{count}</span>
            <span className="text-[12px] text-[#9b94c9]">{label}</span>
        </div>
    );
}

export default function TeamDetailPage({
                                           params,
                                       }: {
    params: Promise<{ teamId: string }>;
}) {
    const { teamId } = use(params);
    const id = Number(teamId);
    const router = useRouter();

    const { team, loading, error, refetch: refetchTeam } = useTeam(id);
    const { nonMembers, loading: nonMembersLoading, refetch: refetchNonMembers } = useNonTeamMembers(id);
    const { addMember, removeMember, loading: memberLoading, error: memberError } = useTeamMembership(id);
    const { deleteTeam, loading: deleting } = useDeleteTeam();

    function handleDelete() {
        if (!confirm("Delete this team? This cannot be undone.")) return;
        deleteTeam(id, () => router.push("/dashboard/teams"));
    }

    function handleAddMember(userId: number) {
        addMember(userId, () => {
            if (refetchTeam) refetchTeam();
            refetchNonMembers();
        });
    }

    function handleRemoveMember(userId: number) {
        removeMember(userId, () => {
            if (refetchTeam) refetchTeam();
            refetchNonMembers();
        });
    }

    return (
        <div className="min-h-screen">
            {/* Top nav bar */}
            <div className="bg-white border-b border-[#ede9fb] px-6 py-3 flex items-center justify-between">
                <Link
                    href="/dashboard/teams"
                    className="flex items-center gap-1.5 text-[13px] text-[#8e88a8] hover:text-[#534AB7] transition-colors"
                >
                    <ArrowLeft size={14} />
                    Teams
                </Link>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        asChild
                        className="text-[13px] border-[#ddd9f5] text-[#534AB7] hover:bg-[#f3f0fd] h-8 px-3 rounded-lg gap-1.5"
                    >
                        <Link href={`/dashboard/teams/${id}/edit`}>
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

            <main className="max-w-4xl mx-auto px-6 py-8">
                {loading && (
                    <div className="flex items-center justify-center py-20 text-[13px] text-[#b0aac8]">
                        Loading team…
                    </div>
                )}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-500">
                        {error}
                    </div>
                )}

                {team && (
                    <div className="space-y-6">

                        {/* Hero header */}
                        <div className="bg-white border border-[#ede9fb] rounded-2xl p-6 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c6fe0] to-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/20">
                                        <Users size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-[20px] font-bold text-[#1a1540] tracking-tight">
                                            {team.name}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-5">
                                <StatBadge count={team.users?.length || 0} label="members" icon={<Users size={12} />} />
                                <StatBadge count={team.tasks?.length || 0} label="tasks" icon={<ListTodo size={12} />} />
                                {team.tasks?.length > 0 && (
                                    <StatBadge
                                        count={team.tasks.filter((t: any) => t.status === "COMPLETED").length}
                                        label="completed"
                                        icon={<CheckCircle2 size={12} />}
                                    />
                                )}
                            </div>
                        </div>

                        {memberError && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-500">
                                {memberError}
                            </div>
                        )}

                        {/* Two-column grid */}
                        <div className="grid grid-cols-2 gap-4">

                            {/* Members */}
                            <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm">
                                <div className="px-4 py-3 border-b border-[#f0edf9]">
                                    <span className="text-[11px] font-bold text-[#b0aac8] uppercase tracking-widest">
                                        Members · {team.users?.length || 0}
                                    </span>
                                </div>
                                {!team.users || team.users.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-[13px] text-[#c4bedd]">
                                        No members yet.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[#f5f3ff] max-h-[280px] overflow-y-auto">
                                        {team.users.map((member: any) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#faf9fe] transition-colors group"
                                            >
                                                <Avatar username={member.username} />
                                                <span className="flex-1 text-[13px] font-medium text-[#2d2860] truncate">
                                                    {member.firstName + " " + member.lastName + " (" + member.username + ")"}
                                                </span>
                                                <button
                                                    disabled={memberLoading}
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#c4bedd] hover:text-red-400 hover:bg-red-50 transition-all"
                                                    title="Remove member"
                                                >
                                                    <UserMinus size={13} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Available Users */}
                            <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm">
                                <div className="px-4 py-3 border-b border-[#f0edf9]">
                                    <span className="text-[11px] font-bold text-[#b0aac8] uppercase tracking-widest">
                                        Add Users · {nonMembers.length}
                                    </span>
                                </div>
                                {nonMembersLoading ? (
                                    <div className="px-4 py-6 text-center text-[13px] text-[#c4bedd]">
                                        Loading…
                                    </div>
                                ) : nonMembers.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-[13px] text-[#c4bedd]">
                                        Everyone's in! 🎉
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[#f5f3ff] max-h-[280px] overflow-y-auto">
                                        {nonMembers.map((user: any) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#faf9fe] transition-colors group"
                                            >
                                                <Avatar username={user.username} />
                                                <span className="flex-1 text-[13px] font-medium text-[#2d2860] truncate">
                                                    {user.firstName + " " + user.lastName + " (" + user.username + ")"}
                                                </span>
                                                <button
                                                    disabled={memberLoading}
                                                    onClick={() => handleAddMember(user.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#c4bedd] hover:text-[#534AB7] hover:bg-[#f0edf9] transition-all"
                                                    title="Add to team"
                                                >
                                                    <UserPlus size={13} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tasks */}
                        <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-5 py-3 border-b border-[#f0edf9]">
                                <span className="text-[11px] font-bold text-[#b0aac8] uppercase tracking-widest">
                                    Tasks · {team.tasks?.length || 0}
                                </span>
                            </div>

                            {!team.tasks || team.tasks.length === 0 ? (
                                <div className="px-5 py-10 text-center text-[13px] text-[#c4bedd]">
                                    No tasks assigned to this team yet.
                                </div>
                            ) : (
                                <div className="divide-y divide-[#f5f3ff] max-h-[320px] overflow-y-auto">
                                    {team.tasks.map((task: any) => {
                                        const done = task.status === "COMPLETED";
                                        return (
                                            <Link key={task.id} href={`/dashboard/tasks/${task.id}`}>
                                                <div className="flex items-center gap-3 px-5 py-3 hover:bg-[#faf9fe] transition-colors group">
                                                    {done ? (
                                                        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                                                    ) : (
                                                        <Circle size={16} className="text-[#ddd9f5] flex-shrink-0" />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-[13px] font-medium truncate transition-colors group-hover:text-[#534AB7] ${done ? "text-[#a09abc] line-through" : "text-[#2d2860]"}`}>
                                                            {task.title || task.name}
                                                        </p>
                                                        {task.description && (
                                                            <p className="text-[11px] text-[#b0aac8] truncate mt-0.5">
                                                                {task.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                                        done
                                                            ? "bg-emerald-50 text-emerald-500"
                                                            : "bg-[#f5f3ff] text-[#7c6fe0]"
                                                    }`}>
                                                        {done ? "Done" : task.status ?? "Open"}
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}