"use client";

import React from "react";
import Link from "next/link";
import { useMyTasks } from "@/hooks/useTasks";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import type { TaskResponseDto, TaskStatus } from "@/types";
import { CheckCircle2, Circle, Clock, Pencil, LayoutList, FolderGit2 } from "lucide-react";
import { useRouter } from "next/navigation";

const STATUS: Record<TaskStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    TODO: { label: "Todo", color: "text-[#534AB7]", bg: "bg-[#EEEDFE]", icon: <Circle size={12} /> },
    IN_PROGRESS: { label: "In progress", color: "text-[#D97706]", bg: "bg-[#FFEDD5]", icon: <Clock size={12} /> },
    COMPLETED: { label: "Completed", color: "text-[#3B6D11]", bg: "bg-[#EAF3DE]", icon: <CheckCircle2 size={12} /> },
};

function StatusBadge({ status }: { status: TaskStatus }) {
    const s = STATUS[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold ${s.bg} ${s.color}`}>
            {s.icon}{s.label}
        </span>
    );
}

// Consistent colorful avatar generator
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
            title={username}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm border-2 border-white -ml-2 first:ml-0 relative hover:z-10 transition-transform hover:scale-110"
            style={{ backgroundColor: bg, color: fg }}
        >
            {username.slice(0, 2).toUpperCase()}
        </div>
    );
}

// Dynamic gradient icon for team headers
function TeamIcon({ name }: { name: string }) {
    const themes = [
        { from: "#4F46E5", to: "#7C3AED", shadow: "shadow-[#4F46E5]/20" },
        { from: "#059669", to: "#10B981", shadow: "shadow-[#059669]/20" },
        { from: "#EA580C", to: "#F97316", shadow: "shadow-[#EA580C]/20" },
        { from: "#DC2626", to: "#EF4444", shadow: "shadow-[#DC2626]/20" },
        { from: "#2563EB", to: "#3B82F6", shadow: "shadow-[#2563EB]/20" },
        { from: "#C026D3", to: "#D946EF", shadow: "shadow-[#C026D3]/20" },
    ];

    const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % themes.length;
    const theme = themes[index];

    return (
        <div
            className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] text-white font-bold shadow-sm flex-shrink-0 ${theme.shadow}`}
            style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
        >
            {name.slice(0, 2).toUpperCase()}
        </div>
    );
}

function TaskRow({ task, teamId }: { task: TaskResponseDto; teamId: string | number }) {
    const router = useRouter();
    const isCompleted = task.status === "COMPLETED";

    return (
        <div
            onClick={() => router.push(`/dashboard/teams/${teamId}/tasks/${task.id}`)}
            className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 border-b border-[#f0edf9] last:border-0 hover:bg-[#faf9fe] transition-colors group cursor-pointer"
        >
            <div className="flex-1 min-w-0">
                <Link
                    href={`/dashboard/teams/${teamId}/tasks/${task.id}`}
                    className={`text-[14px] font-bold transition-colors truncate block ${
                        isCompleted
                            ? "text-[#a09abc] line-through decoration-1"
                            : "text-[#1a1540] hover:text-[#534AB7]"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {task.name}
                </Link>

                {task.description && (
                    <p className={`text-[13px] truncate mt-0.5 ${
                        isCompleted ? "text-[#c4bedd]" : "text-[#8e88a8]"
                    }`}>
                        {task.description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-6 sm:ml-auto">
                {/* Avatars */}
                <div className={`flex items-center flex-shrink-0 ${isCompleted ? "opacity-60" : ""}`}>
                    {task.users.slice(0, 3).map((u) => (
                        <Avatar key={u.id} username={u.username} />
                    ))}
                    {task.users.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-[#f0edf9] flex items-center justify-center text-[9px] font-bold text-[#8e88a8] shadow-sm border-2 border-white -ml-2 relative">
                            +{task.users.length - 3}
                        </div>
                    )}
                </div>

                <div className="w-28 flex-shrink-0">
                    <StatusBadge status={task.status} />
                </div>

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 text-[#b0aac8] hover:text-[#534AB7] hover:bg-[#EEEDFE] rounded-lg flex-shrink-0"
                    >
                        <Link href={`/dashboard/teams/${teamId}/tasks/${task.id}/edit`}>
                            <Pencil size={14} />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function TasksPage() {
    const { groups, loading, error } = useMyTasks();

    const totalTasks = groups.reduce((sum, g) => sum + g.tasks.length, 0);
    const completedTasks = groups.reduce((sum, g) => sum + g.tasks.filter((t) => t.status === "COMPLETED").length, 0);

    return (
        <>
            <PageHeader title="My tasks" description="Tasks assigned to you, grouped by team." />

            <main className="flex-1 p-6 mx-auto w-full space-y-6">
                {!loading && groups.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#ede9fb] shadow-sm">
                            <div className="w-6 h-6 rounded-md bg-[#EEEDFE] flex items-center justify-center">
                                <LayoutList size={12} className="text-[#534AB7]" />
                            </div>
                            <span className="text-[13px] font-bold text-[#1a1540]">{totalTasks}</span>
                            <span className="text-[13px] text-[#8e88a8] pr-1">Total tasks</span>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#ede9fb] shadow-sm">
                            <div className="w-6 h-6 rounded-md bg-[#EAF3DE] flex items-center justify-center">
                                <CheckCircle2 size={12} className="text-[#3B6D11]" />
                            </div>
                            <span className="text-[13px] font-bold text-[#1a1540]">{completedTasks}</span>
                            <span className="text-[13px] text-[#8e88a8] pr-1">Completed</span>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#ede9fb] shadow-sm">
                            <div className="w-6 h-6 rounded-md bg-[#f5f3ff] flex items-center justify-center">
                                <FolderGit2 size={12} className="text-[#7c6fe0]" />
                            </div>
                            <span className="text-[13px] font-bold text-[#1a1540]">{groups.length}</span>
                            <span className="text-[13px] text-[#8e88a8] pr-1">Teams</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-500">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20 text-[13px] text-[#b0aac8]">
                        Loading your tasks…
                    </div>
                ) : groups.length === 0 ? (
                    <div className="bg-white border border-[#ede9fb] rounded-2xl px-6 py-16 text-center shadow-sm">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#f5f3ff] flex items-center justify-center">
                            <CheckCircle2 size={20} className="text-[#a79fdf]" />
                        </div>
                        <h3 className="text-[15px] font-semibold text-[#1a1540] mb-1">No tasks assigned</h3>
                        <p className="text-[13px] text-[#8e88a8]">
                            You have no tasks assigned yet, or you're not a member of any team.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {groups.map((group) => (
                            <div key={group.teamId} className="bg-white border border-[#ede9fb] rounded-2xl shadow-sm overflow-hidden">
                                {/* Team Group Header */}
                                <Link href={`/dashboard/teams/${group.teamId}`} className="block">
                                    <div className="bg-[#fcfbfe] border-b border-[#ede9fb] px-5 py-3.5 flex items-center justify-between hover:bg-[#f7f5ff] transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <TeamIcon name={group.teamName} />
                                            <span className="text-[14px] font-bold text-[#1a1540] hover:text-[#534AB7] transition-colors">
                                                {group.teamName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f0edf9] text-[11px] font-semibold text-[#7c6fe0]">
                                            {group.tasks.length} {group.tasks.length === 1 ? "task" : "tasks"}
                                        </div>
                                    </div>
                                </Link>

                                {/* Tasks List */}
                                <div className="flex flex-col">
                                    {group.tasks.map((task) => (
                                        <TaskRow key={task.id} task={task} teamId={group.teamId} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}