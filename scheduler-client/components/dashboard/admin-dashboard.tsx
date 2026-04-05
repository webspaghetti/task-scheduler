"use client";

import Link from "next/link";
import { Users, Shield, ListTodo, CheckCircle2, Circle, TrendingUp, ShieldCheck, Activity } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useTeams } from "@/hooks/useTeams";
import { useTasks } from "@/hooks/useTasks";
import { useActionHistory } from "@/hooks/useActionHistory";
import { getCurrentUsername } from "@/lib/jwt";
import { TeamIcon } from "@/components/teams/team-icon";
import { TaskStatus } from "@/types";
import { Avatar } from "@/components/general/avatar";
import { RoleBadge } from "@/components/general/role-badge";
import { TaskAvatar } from "@/components/tasks/task-avatar";
import React from "react";
import { StatusBadge } from "@/components/general/status-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { SectionHeader } from "./section-header";
import { HistoryMessage } from "@/components/dashboard/history-message";
import { rolePriority } from "@/util/role-utility";

export default function AdminDashboard() {
    const username = getCurrentUsername();

    const { users, usersLoading, usersError } = useUsers();
    const { teams, teamsLoading, teamsError } = useTeams();
    const { tasks, tasksLoading, tasksError } = useTasks();
    const { history, historyLoading, historyError } = useActionHistory();

    const openTasks = tasks?.filter((t: any) => t.status !== "COMPLETED") ?? [];
    const completedTasks = tasks?.filter((t: any) => t.status === "COMPLETED") ?? [];
    const recentUsers = [...(users ?? [])].slice(0, 5);
    const recentTeams = [...(teams ?? [])].slice(0, 5);

    return (
        <main className="flex-1 p-6 space-y-6">

            {/* Admin Welcome banner */}
            <div className="bg-white border border-[#ede9fb] rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c6fe0] to-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/20 flex-shrink-0">
                    <ShieldCheck size={24} className="text-white" />
                </div>
                <div>
                    <p className="text-[18px] font-semibold text-[#26215C] leading-tight">
                        Administrator Overview
                    </p>
                    <p className="text-[13px] text-[#8e88a8] mt-0.5">
                        Welcome back{username ? `, ${username}` : ""}. Here's the current system status.
                    </p>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Users"
                    value={usersLoading ? "..." : usersError ? "!" : users.length}
                    sub={usersError ? "Failed to load users" : "Registered accounts"}
                    isError={!!usersError}
                    icon={<Users size={14} />}
                    href="/dashboard/users"
                />
                <StatCard
                    label="Active Teams"
                    value={teamsLoading ? "..." : teamsError ? "!" : teams.length}
                    sub={teamsError ? "Failed to load teams" : "Workspace groups"}
                    isError={!!teamsError}
                    icon={<Shield size={14} />}
                    href="/dashboard/teams"
                />
                <StatCard
                    label="Open tasks"
                    value={tasksLoading ? "..." : tasksError ? "!" : openTasks.length}
                    sub={tasksError ? "Failed to load tasks" : "Todo & in progress"}
                    isError={!!tasksError}
                    icon={<ListTodo size={14} />}
                    href="/dashboard/my-tasks"
                />
                <StatCard
                    label="Completed"
                    value={tasksLoading ? "..." : tasksError ? "!" : completedTasks.length}
                    sub={tasksError ? "Failed to load tasks" : "Tasks finished"}
                    isError={!!tasksError}
                    icon={<TrendingUp size={14} />}
                />
            </div>

            {/* Two-column detail panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent Users */}
                <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm">
                    <SectionHeader
                        label="Recent Users"
                        count={users?.length}
                        action={
                            <Link href="/dashboard/users" className="text-[12px] font-medium text-[#534AB7] hover:underline">
                                View all
                            </Link>
                        }
                    />
                    {usersLoading ? (
                        <div className="px-4 py-6 text-center text-[13px] text-[#c4bedd]">Loading…</div>
                    ) : usersError ? (
                        <div className="px-4 py-6 text-center text-[13px] text-red-400">Failed to load users.</div>
                    ) : recentUsers.length === 0 ? (
                        <div className="px-4 py-6 text-center text-[13px] text-[#c4bedd]">No users yet.</div>
                    ) : (
                        <div className="divide-y divide-[#f5f3ff]">
                            {recentUsers.map((user: any) => (
                                <Link
                                    key={user.id}
                                    href={`/dashboard/users/${user.id}`}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#faf9fe] transition-colors group cursor-pointer"
                                >
                                    <Avatar username={user.username} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-medium text-[#2d2860] group-hover:text-[#534AB7] transition-colors truncate">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-[11px] text-[#b0aac8] truncate">@{user.username}</p>
                                    </div>
                                    <div className="flex gap-1.5 flex-wrap justify-end">
                                        {[...user.roles]
                                            .sort((a, b) => {
                                                const roleA = (a.name ?? a).replace("ROLE_", "").toUpperCase();
                                                const roleB = (b.name ?? b).replace("ROLE_", "").toUpperCase();
                                                return rolePriority[roleA] - rolePriority[roleB];
                                            })
                                            .map((r: any) => (
                                                <RoleBadge key={r.id ?? r} name={r.name ?? r} />
                                            ))}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Teams */}
                <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm">
                    <SectionHeader
                        label="Recent Teams"
                        count={teams?.length}
                        action={
                            <Link href="/dashboard/teams" className="text-[12px] font-medium text-[#534AB7] hover:underline">
                                View all
                            </Link>
                        }
                    />
                    {teamsLoading ? (
                        <div className="px-4 py-6 text-center text-[13px] text-[#c4bedd]">Loading…</div>
                    ) : teamsError ? (
                        <div className="px-4 py-6 text-center text-[13px] text-red-400">Failed to load teams.</div>
                    ) : recentTeams.length === 0 ? (
                        <div className="px-4 py-6 text-center text-[13px] text-[#c4bedd]">No teams yet.</div>
                    ) : (
                        <div className="divide-y divide-[#f5f3ff]">
                            {recentTeams.map((team: any) => {
                                const openCount = team.tasks?.filter((t: any) => t.status !== "COMPLETED").length ?? 0;
                                return (
                                    <Link
                                        key={team.id}
                                        href={`/dashboard/teams/${team.id}`}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#faf9fe] transition-colors group cursor-pointer"
                                    >
                                        <TeamIcon name={team.name} />

                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-medium text-[#2d2860] group-hover:text-[#534AB7] transition-colors truncate">
                                                {team.name}
                                            </p>
                                            <p className="text-[11px] text-[#b0aac8]">
                                                {openCount} open task{openCount !== 1 ? "s" : ""}
                                            </p>
                                        </div>

                                        {/* Avatar Stack for Team Members */}
                                        <div className="flex items-center flex-shrink-0 mx-2">
                                            {(team as any).users?.slice(0, 3).map((u: any) => (
                                                <TaskAvatar key={u.id} username={u.username} />
                                            ))}
                                            {(team as any).users?.length > 3 && (
                                                <div className="w-7 h-7 rounded-full bg-[#f0edf9] flex items-center justify-center text-[9px] font-bold text-[#8e88a8] shadow-sm border-2 border-white -ml-2 relative">
                                                    +{(team as any).users.length - 3}
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

            {/* Recent Tasks */}
            <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm">
                <SectionHeader
                    label="Recent Tasks"
                    count={tasks?.length}
                    action={
                        <Link href="/dashboard/all-tasks" className="text-[12px] font-medium text-[#534AB7] hover:underline">
                            View all
                        </Link>
                    }
                />
                {tasksLoading ? (
                    <div className="px-5 py-6 text-center text-[13px] text-[#c4bedd]">Loading…</div>
                ) : tasksError ? (
                    <div className="px-5 py-6 text-center text-[13px] text-red-400">Failed to load tasks.</div>
                ) : !tasks || tasks.length === 0 ? (
                    <div className="px-5 py-10 text-center text-[13px] text-[#c4bedd]">No tasks yet.</div>
                ) : (
                    <div className="divide-y divide-[#f5f3ff] max-h-[320px] overflow-y-auto">
                        {tasks.slice(0, 10).map((task: any) => {
                            const completed = task.status === "COMPLETED";
                            return (
                                <Link
                                    key={task.id}
                                    href={task.team?.id ? `/dashboard/teams/${task.team.id}/tasks/${task.id}` : `/dashboard/all-tasks`}
                                    className="flex items-center gap-3 px-5 py-3 hover:bg-[#faf9fe] transition-colors group cursor-pointer"
                                >
                                    {completed ? (
                                        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                                    ) : (
                                        <Circle size={16} className="text-[#ddd9f5] flex-shrink-0 group-hover:text-[#534AB7] transition-colors" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-[13px] font-medium truncate group-hover:text-[#534AB7] transition-colors ${completed ? "text-[#a09abc] line-through" : "text-[#2d2860]"}`}>
                                            {task.title || task.name}
                                        </p>
                                        {task.team?.name && (
                                            <p className="text-[11px] text-[#b0aac8] truncate mt-0.5">{task.team.name}</p>
                                        )}
                                    </div>

                                    {/* Avatar Stack for Assigned Users */}
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

            {/* System Action History */}
            <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm">
                <SectionHeader
                    label="System Action History"
                    count={history?.length}
                    action={<Activity size={14} className="text-[#b0aac8]" />}
                />
                {historyLoading ? (
                    <div className="px-5 py-6 text-center text-[13px] text-[#c4bedd]">Loading history…</div>
                ) : historyError ? (
                    <div className="px-5 py-6 text-center text-[13px] text-red-400">{historyError}</div>
                ) : !history || history.length === 0 ? (
                    <div className="px-5 py-10 text-center text-[13px] text-[#c4bedd]">No activity recorded yet.</div>
                ) : (
                    <div className="divide-y divide-[#f5f3ff] max-h-[350px] overflow-y-auto">
                        {history.map((entry: any) => {
                            const date = new Date(entry.timestamp);
                            const formattedDate = isNaN(date.getTime())
                                ? entry.timestamp
                                : date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                            return (
                                <div key={entry.id} className="flex gap-4 px-5 py-3 hover:bg-[#faf9fe] transition-colors items-start">
                                    <div className="text-[11px] font-medium text-[#a09abc] whitespace-nowrap pt-[3px] min-w-[100px]">
                                        {formattedDate}
                                    </div>
                                    <div className="text-[13px] text-[#2d2860] leading-snug">
                                        <HistoryMessage text={entry.message} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

        </main>
    );
}