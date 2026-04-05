"use client";

import React, { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    useTask,
    useDeleteTask,
    useTaskAssignment,
    useUpdateTaskStatus
} from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Pencil,
    Trash2,
    CheckCircle2,
    Circle,
    Clock,
    ListTodo,
    UserPlus,
    UserMinus,
    Calendar,
    ChevronDown
} from "lucide-react";
import type { TaskStatus } from "@/types";
import { useNonTaskAssigneesInTeam } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";

const STATUS: Record<TaskStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    TODO: { label: "Todo", color: "text-[#534AB7]", bg: "bg-[#EEEDFE]", icon: <Circle size={12} /> },
    IN_PROGRESS: { label: "In progress", color: "text-[#D97706]", bg: "bg-[#FFEDD5]", icon: <Clock size={12} /> },
    COMPLETED: { label: "Completed", color: "text-[#3B6D11]", bg: "bg-[#EAF3DE]", icon: <CheckCircle2 size={12} /> },
};

function StatusDropdown({
                            status,
                            onChange,
                            disabled
                        }: {
    status: TaskStatus;
    onChange: (status: TaskStatus) => void;
    disabled?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const s = STATUS[status];


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className={`inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#534AB7]/30 ${s.bg} ${s.color} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-95 shadow-sm'}`}
            >
                {s.icon}
                {s.label}
                <ChevronDown size={14} className={`transition-transform duration-200 opacity-70 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-[#ede9fb] rounded-xl shadow-lg shadow-[#534AB7]/10 z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-[#f0edf9] bg-[#faf9fe]">
                        <span className="text-[10px] font-bold text-[#b0aac8] uppercase tracking-wider">Update Status</span>
                    </div>
                    <div className="py-1">
                        {Object.entries(STATUS).map(([key, val]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    onChange(key as TaskStatus);
                                    setIsOpen(false);
                                }}
                                className={`w-full cursor-pointer flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium transition-colors hover:bg-[#f5f3ff] ${status === key ? 'text-[#534AB7] bg-[#f8f7ff]' : 'text-[#4b4668]'}`}
                            >
                                <span className={val.color}>{val.icon}</span>
                                {val.label}
                                {status === key && <CheckCircle2 size={12} className="ml-auto text-[#534AB7]" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

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

function StatBadge({ label, icon, value }: { label: string; icon: React.ReactNode; value: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f5f3ff] border border-[#ede9fb]">
            <span className="text-[#7c6fe0]">{icon}</span>
            <span className="text-[12px] font-semibold text-[#534AB7]">{value}</span>
            <span className="text-[12px] text-[#9b94c9]">{label}</span>
        </div>
    );
}

export default function TaskDetailPage({
                                           params,
                                       }: {
    params: Promise<{ teamId: string; taskId: string }>;
}) {
    const { canManageTeam } = useAuth();

    const { teamId, taskId } = use(params);
    const id = Number(taskId);
    const router = useRouter();

    const { task, loading, error, refetch: refetchTask } = useTask(id);
    const { deleteTask, loading: deleting } = useDeleteTask();

    const { updateTask, loading: updatingStatus, error: updateError } = useUpdateTaskStatus(id);

    const { nonAssignees = [], loading: nonAssigneesLoading, refetch: refetchNonAssignees } = useNonTaskAssigneesInTeam(id);
    const { assignUser, unassignUser, loading: assignmentLoading, error: assignmentError } = useTaskAssignment(id);

    function handleDelete() {
        if (!confirm("Delete this task? This cannot be undone.")) return;
        deleteTask(id, () => router.push(`/dashboard/teams/${teamId}`));
    }

    function handleStatusChange(newStatus: TaskStatus) {
        if (!task) return;

        // Passing name as a workaround for the backend validation requirement
        // We cast to 'any' here temporarily assuming your TaskUpdateStatusDto only strictly allows 'status'
        const payload = {
            status: newStatus,
            name: task.name
        } as any;

        updateTask(payload, () => {
            if (refetchTask) refetchTask();
        });
    }

    function handleAssignUser(userId: number) {
        assignUser(userId, () => {
            if (refetchTask) refetchTask();
            if (refetchNonAssignees) refetchNonAssignees();
        });
    }

    function handleUnassignUser(userId: number) {
        unassignUser(userId, () => {
            if (refetchTask) refetchTask();
            if (refetchNonAssignees) refetchNonAssignees();
        });
    }

    return (
        <div className="min-h-screen">
            {/* Top nav bar */}
            <div className="bg-white border-b border-[#ede9fb] px-6 py-3 flex items-center justify-between">
                <Link
                    href={`/dashboard/teams/${teamId}`}
                    className="flex items-center gap-1.5 text-[13px] text-[#8e88a8] hover:text-[#534AB7] transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to Team
                </Link>
                {canManageTeam && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            asChild
                            className="text-[13px] border-[#ddd9f5] text-[#534AB7] hover:bg-[#f3f0fd] h-8 px-3 rounded-lg gap-1.5"
                        >
                            <Link href={`/dashboard/teams/${teamId}/tasks/${id}/edit`}>
                                <Pencil size={12} />
                                Edit Task
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
                )}
            </div>

            <main className="max-w-4xl mx-auto px-6 py-8">
                {loading && (
                    <div className="flex items-center justify-center py-20 text-[13px] text-[#b0aac8]">
                        Loading task…
                    </div>
                )}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-500 mb-6">
                        {error}
                    </div>
                )}
                {assignmentError && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-500 mb-6">
                        {assignmentError}
                    </div>
                )}
                {updateError && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-500 mb-6">
                        Failed to update status: {updateError}
                    </div>
                )}

                {task && (
                    <div className="space-y-6">
                        {/* Hero header */}
                        <div className="bg-white border border-[#ede9fb] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c6fe0] to-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/20 flex-shrink-0">
                                    <ListTodo size={20} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-[20px] font-bold text-[#1a1540] tracking-tight">
                                        {task.name}
                                    </h1>
                                    {task.description ? (
                                        <p className="text-[13px] text-[#8e88a8] mt-1 max-w-xl">
                                            {task.description}
                                        </p>
                                    ) : (
                                        <p className="text-[13px] text-[#c4bedd] mt-1 italic">
                                            No description provided.
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-5">
                                        <StatBadge
                                            value={new Date(task.createdAt).toLocaleDateString()}
                                            label="created"
                                            icon={<Calendar size={12} />}
                                        />
                                        {task.completedAt && (
                                            <StatBadge
                                                value={new Date(task.completedAt).toLocaleDateString()}
                                                label="completed"
                                                icon={<CheckCircle2 size={12} />}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-shrink-0 flex items-center gap-3">
                                {updatingStatus && <span className="text-[12px] text-[#b0aac8] animate-pulse">Saving...</span>}
                                <StatusDropdown
                                    status={task.status as TaskStatus}
                                    onChange={handleStatusChange}
                                    disabled={updatingStatus}
                                />
                            </div>
                        </div>

                        {/* Two-column grid for Assignment */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Assigned Users */}
                            <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm">
                                <div className="px-4 py-3 border-b border-[#f0edf9]">
                                    <span className="text-[11px] font-bold text-[#b0aac8] uppercase tracking-widest">
                                        Assignees · {task.users?.length || 0}
                                    </span>
                                </div>
                                {!task.users || task.users.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-[13px] text-[#c4bedd]">
                                        No one assigned to this task yet.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[#f5f3ff] max-h-[280px] overflow-y-auto">
                                        {task.users.map((user: any) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#faf9fe] transition-colors group"
                                            >
                                                <Avatar username={user.username} />
                                                <span className="flex-1 text-[13px] font-medium text-[#2d2860] truncate">
                                                    {user.firstName + " " + user.lastName + " (" + user.username + ")"}
                                                </span>
                                                {canManageTeam && (
                                                    <button
                                                        disabled={assignmentLoading}
                                                        onClick={() => handleUnassignUser(user.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#c4bedd] hover:text-red-400 hover:bg-red-50 transition-all"
                                                        title="Unassign user"
                                                    >
                                                        <UserMinus size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Available Team Members */}
                            <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm">
                                <div className="px-4 py-3 border-b border-[#f0edf9]">
                                    <span className="text-[11px] font-bold text-[#b0aac8] uppercase tracking-widest">
                                        Assign from Team · {nonAssignees.length}
                                    </span>
                                </div>
                                {nonAssigneesLoading ? (
                                    <div className="px-4 py-6 text-center text-[13px] text-[#c4bedd]">
                                        Loading available team members…
                                    </div>
                                ) : nonAssignees.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-[13px] text-[#c4bedd]">
                                        Everyone on the team is assigned! 🎉
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[#f5f3ff] max-h-[280px] overflow-y-auto">
                                        {nonAssignees.map((user: any) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#faf9fe] transition-colors group"
                                            >
                                                <Avatar username={user.username} />
                                                <span className="flex-1 text-[13px] font-medium text-[#2d2860] truncate">
                                                    {user.firstName + " " + user.lastName + " (" + user.username + ")"}
                                                </span>
                                                {canManageTeam && (
                                                    <button
                                                        disabled={assignmentLoading}
                                                        onClick={() => handleAssignUser(user.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#c4bedd] hover:text-[#534AB7] hover:bg-[#f0edf9] transition-all"
                                                        title="Assign to task"
                                                    >
                                                        <UserPlus size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}