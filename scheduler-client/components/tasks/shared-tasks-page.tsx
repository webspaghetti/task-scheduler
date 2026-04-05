"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import type { SharedTasksPageProps } from "@/types";
import { CheckCircle2, LayoutList, FolderGit2 } from "lucide-react";
import { TeamIcon } from "@/components/teams/team-icon";
import { TaskRow } from "@/components/tasks/task-row";

export default function SharedTasksPage({
                                            title,
                                            description,
                                            emptyTitle = "No tasks found",
                                            emptyDescription = "There are currently no tasks to display.",
                                            useTasksHook
                                        }: SharedTasksPageProps) {

    const { groups, loading, error } = useTasksHook();

    const totalTasks = groups.reduce((sum, g) => sum + g.tasks.length, 0);
    const completedTasks = groups.reduce((sum, g) => sum + g.tasks.filter((t) => t.status === "COMPLETED").length, 0);

    return (
        <>
            <PageHeader title={title} description={description} />

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
                        Loading tasks…
                    </div>
                ) : groups.length === 0 ? (
                    <div className="bg-white border border-[#ede9fb] rounded-2xl px-6 py-16 text-center shadow-sm">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#f5f3ff] flex items-center justify-center">
                            <CheckCircle2 size={20} className="text-[#a79fdf]" />
                        </div>
                        {/* 4. Use dynamic empty state props */}
                        <h3 className="text-[15px] font-semibold text-[#1a1540] mb-1">{emptyTitle}</h3>
                        <p className="text-[13px] text-[#8e88a8]">
                            {emptyDescription}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {groups.map((group) => (
                            <div key={group.teamId} className="bg-white border border-[#ede9fb] rounded-2xl shadow-sm overflow-hidden">
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