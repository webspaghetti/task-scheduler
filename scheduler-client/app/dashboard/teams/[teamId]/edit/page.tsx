"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTeam, useUpdateTeam } from "@/hooks/useTeams";
import { TeamForm } from "@/components/teams/team-form";
import { ArrowLeft, Users } from "lucide-react";

export default function EditTeamPage({
                                         params,
                                     }: {
    params: Promise<{ teamId: string }>;
}) {
    const { teamId } = use(params);
    const id = Number(teamId);
    const router = useRouter();

    const { team, loading: fetching } = useTeam(id);
    const { updateTeam, loading, error } = useUpdateTeam(id);

    const [name, setName] = useState("");

    useEffect(() => {
        if (team) {
            setName(team.name);
        }
    }, [team]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        updateTeam({ name }, () =>
            router.push(`/dashboard/teams/${id}`)
        );
    }

    return (
        <div className="min-h-screen">
            {/* Top nav bar */}
            <div className="bg-white border-b border-[#ede9fb] px-6 py-3 flex items-center justify-between">
                <Link
                    href={`/dashboard/teams/${id}`}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-[#8e88a8] hover:text-[#534AB7] transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to team
                </Link>
            </div>

            <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#EEEDFE] flex items-center justify-center text-[#534AB7]">
                        <Users size={20} />
                    </div>
                    <div>
                        <h1 className="text-[20px] font-bold text-[#1a1540] tracking-tight">Edit Team</h1>
                        <p className="text-[13px] text-[#8e88a8]">Update team details.</p>
                    </div>
                </div>

                {fetching && !team ? (
                    <div className="flex items-center justify-center py-20 text-[13px] text-[#b0aac8]">
                        Loading team details…
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Team Information Section */}
                        <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm h-fit">
                            <div className="px-6 py-4 border-b border-[#f0edf9] bg-[#fcfbfe]">
                                <h2 className="text-[14px] font-bold text-[#1a1540]">Team Information</h2>
                            </div>
                            <div className="p-6">
                                <TeamForm
                                    name={name}
                                    onNameChange={setName}
                                    onSubmit={handleSubmit}
                                    loading={loading}
                                    error={error}
                                    submitLabel="Save changes"
                                />
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}