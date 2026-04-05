"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTask, useUpdateTask } from "@/hooks/useTasks";
import { TaskForm } from "@/components/tasks/task-form";
import { ArrowLeft, PencilLine } from "lucide-react";

export default function EditTaskPage({params}: { params: Promise<{ teamId: string; taskId: string }>; }) {
    const { teamId, taskId } = use(params);

    const id = Number(taskId);
    const router = useRouter();

    const { task, loading: fetching } = useTask(id);
    const { updateTask, loading, error } = useUpdateTask(id);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (task) {
            setName(task.name);
            setDescription(task.description ?? "");
        }
    }, [task]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        updateTask({ name, description }, () => router.push(`/dashboard/teams/${teamId}/tasks/${id}`));
    }

    return (
        <div className="min-h-screen">
            {/* Top nav bar */}
            <div className="bg-white border-b border-[#ede9fb] px-6 py-3 flex items-center justify-between">
                <Link
                    href={`/dashboard/teams/${teamId}/tasks/${id}`}
                    className="flex items-center gap-1.5 text-[13px] text-[#8e88a8] hover:text-[#534AB7] transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to Task
                </Link>
                <Link
                    href={`/dashboard/teams/${teamId}`}
                    className="flex items-center gap-1.5 text-[13px] text-[#8e88a8] hover:text-[#534AB7] transition-colors"
                >
                    Team Dashboard
                </Link>
            </div>

            <main className="max-w-2xl mx-auto px-6 py-8">
                {fetching ? (
                    <div className="flex items-center justify-center py-20 text-[13px] text-[#b0aac8]">
                        Loading task details…
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Hero Header */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c6fe0] to-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/20 flex-shrink-0">
                                <PencilLine size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-[20px] font-bold text-[#1a1540] tracking-tight">
                                    Edit Task
                                </h1>
                                <p className="text-[13px] text-[#8e88a8] mt-1 max-w-xl">
                                    Update the details, title, and description for this task.
                                </p>
                            </div>
                        </div>

                        {/* Form Container */}
                        <div className="bg-white border border-[#ede9fb] rounded-2xl p-6 shadow-sm">
                            <TaskForm
                                name={name}
                                description={description}
                                teamId={teamId}
                                onNameChange={setName}
                                onDescriptionChange={setDescription}
                                onTeamIdChange={() => {}}
                                onSubmit={handleSubmit}
                                loading={loading}
                                error={error}
                                submitLabel="Save changes"
                                hideTeam
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}