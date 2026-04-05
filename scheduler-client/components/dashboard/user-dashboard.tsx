"use client";

import Link from "next/link";
import { ListTodo, CheckCircle2, Clock, Circle } from "lucide-react";
import { useMyTasksGrouped } from "@/hooks/useTasks";
import { getCurrentUsername } from "@/lib/jwt";
import { TeamIcon } from "@/components/teams/team-icon";
import { TaskAvatar } from "../tasks/task-avatar";
import { StatusBadge } from "@/components/general/status-badge";
import { TaskStatus } from "@/types";
import React from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { SectionHeader } from "@/components/dashboard/section-header";

export default function UserDashboard() {
    const username = getCurrentUsername();
    const { groups, loading: tasksLoading, error: tasksError } = useMyTasksGrouped();

    // Flatten all tasks across groups for stats + task list
    const allTasks = groups.flatMap((g) => g.tasks);
    const openTasks = allTasks.filter((t) => t.status !== "COMPLETED");
    const inProgressTasks = allTasks.filter((t) => t.status === "IN_PROGRESS");
    const completedTasks = allTasks.filter((t) => t.status === "COMPLETED");

    return (
        <main className="flex-1 p-6 space-y-6">

            {/* Welcome banner */}
            <div className="bg-white border border-[#ede9fb] rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c6fe0] to-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/20 flex-shrink-0">
                    <span className="text-white font-bold text-[15px]">
                        {username ? username.slice(0, 2).toUpperCase() : "?"}
                    </span>
                </div>
                <div>
                    <p className="text-[18px] font-semibold text-[#26215C] leading-tight">
                        Welcome back{username ? `, ${username}` : ""}!
                    </p>
                    <p className="text-[13px] text-[#8e88a8] mt-0.5">
                        Here's what's on your plate today.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    label="My open tasks"
                    value={tasksLoading ? "..." : tasksError ? "!" : openTasks.length}
                    sub={tasksError ? "Failed to load tasks" : "Todo + in progress"}
                    isError={!!tasksError}
                    icon={<ListTodo size={14} />}
                />
                <StatCard
                    label="In progress"
                    value={tasksLoading ? "..." : tasksError ? "!" : inProgressTasks.length}
                    sub={tasksError ? "Failed to load tasks" : "Currently active"}
                    isError={!!tasksError}
                    icon={<Clock size={14} />}
                />
                <StatCard
                    label="Completed"
                    value={tasksLoading ? "..." : tasksError ? "!" : completedTasks.length}
                    sub={tasksError ? "Failed to load tasks" : "Tasks finished"}
                    isError={!!tasksError}
                    icon={<CheckCircle2 size={14} />}
                />
            </div>

            {/* Two-column: My Tasks + My Teams */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* My Tasks */}
                <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm">
                    <SectionHeader
                        label="My Tasks"
                        count={allTasks.length}
                    />
                    {tasksLoading ? (
                        <div className="px-5 py-6 text-center text-[13px] text-[#c4bedd]">Loading…</div>
                    ) : tasksError ? (
                        <div className="px-5 py-6 text-center text-[13px] text-red-400">Failed to load tasks.</div>
                    ) : allTasks.length === 0 ? (
                        <div className="px-5 py-10 text-center text-[13px] text-[#c4bedd]">
                            No tasks assigned to you yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-[#f5f3ff] max-h-[320px] overflow-y-auto">
                            {allTasks.map((task) => {
                                const completed = task.status === "COMPLETED";
                                // Find the team data from groups
                                const team = groups.find((g) => g.tasks.some((t) => t.id === task.id));
                                const teamName = team?.teamName;
                                const teamId = team?.teamId;

                                return (
                                    <Link
                                        key={task.id}
                                        href={teamId ? `/dashboard/teams/${teamId}/tasks/${task.id}` : "#"}
                                        className="flex items-center gap-3 px-5 py-3 hover:bg-[#faf9fe] transition-colors group cursor-pointer"
                                    >
                                        {completed ? (
                                            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                                        ) : (
                                            <Circle size={16} className="text-[#ddd9f5] flex-shrink-0 group-hover:text-[#534AB7] transition-colors" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-[13px] font-medium truncate group-hover:text-[#534AB7] transition-colors ${completed ? "text-[#a09abc] line-through" : "text-[#2d2860]"}`}>
                                                {task.name || (task as any).title}
                                            </p>
                                            {teamName && (
                                                <p className="text-[11px] text-[#b0aac8] truncate mt-0.5">{teamName}</p>
                                            )}
                                        </div>

                                        {/* Avatar Stack */}
                                        <div className={`flex items-center flex-shrink-0 mr-4 ${completed ? "opacity-60" : ""}`}>
                                            {(task as any).users?.slice(0, 3).map((u: any) => (
                                                <TaskAvatar key={u.id} username={u.username} />
                                            ))}
                                            {(task as any).users?.length > 3 && (
                                                <div className="w-7 h-7 rounded-full bg-[#f0edf9] flex items-center justify-center text-[9px] font-bold text-[#8e88a8] shadow-sm border-2 border-white -ml-2 relative">
                                                    +{(task as any).users.length - 3}
                                                </div>
                                            )}
                                        </div>

                                        <StatusBadge status={task.status as TaskStatus} />
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* My Teams */}
                <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm">
                    <SectionHeader
                        label="My Teams"
                        count={groups.length}
                    />
                    {tasksLoading ? (
                        <div className="px-4 py-6 text-center text-[13px] text-[#c4bedd]">Loading…</div>
                    ) : tasksError ? (
                        <div className="px-4 py-6 text-center text-[13px] text-red-400">Failed to load teams.</div>
                    ) : groups.length === 0 ? (
                        <div className="px-4 py-10 text-center text-[13px] text-[#c4bedd]">
                            You're not in any team yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-[#f5f3ff] max-h-[320px] overflow-y-auto">
                            {groups.map((group) => {
                                return (
                                    <Link
                                        key={group.teamId}
                                        href={`/dashboard/teams/${group.teamId}`}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#faf9fe] transition-colors group"
                                    >
                                        <TeamIcon name={group.teamName} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-medium text-[#2d2860] group-hover:text-[#534AB7] transition-colors truncate">
                                                {group.teamName}
                                            </p>
                                            <p className="text-[11px] text-[#b0aac8]">
                                                {group.tasks.length} task{group.tasks.length !== 1 ? "s" : ""} assigned to you
                                            </p>
                                        </div>

                                        {/* Avatar Stack for Team Members */}
                                        <div className="flex items-center flex-shrink-0 mx-2">
                                            {(group as any).users?.slice(0, 3).map((u: any) => (
                                                <TaskAvatar key={u.id} username={u.username} />
                                            ))}
                                            {(group as any).users?.length > 3 && (
                                                <div className="w-7 h-7 rounded-full bg-[#f0edf9] flex items-center justify-center text-[9px] font-bold text-[#8e88a8] shadow-sm border-2 border-white -ml-2 relative">
                                                    +{(group as any).users.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}