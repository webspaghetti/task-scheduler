"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateTeam } from "@/hooks/useTeams";
import { TeamForm } from "@/components/teams/team-form";
import { ArrowLeft, Users } from "lucide-react";

export default function NewTeamPage() {
    const router = useRouter();
    const { createTeam, loading, error } = useCreateTeam();
    const [name, setName] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        createTeam({ name }, (team) => {
            router.push(`/dashboard/teams/${team.id}`);
        });
    }

    return (
        <div className="min-h-screen">
            {/* Top nav bar */}
            <div className="bg-white border-b border-[#ede9fb] px-6 py-3 flex items-center justify-between">
                <Link
                    href="/dashboard/teams"
                    className="flex items-center gap-1.5 text-[13px] font-medium text-[#8e88a8] hover:text-[#534AB7] transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to teams
                </Link>
            </div>

            <main className="max-w-xl mx-auto px-6 py-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#EEEDFE] flex items-center justify-center text-[#534AB7]">
                        <Users size={24} />
                    </div>
                    <div>
                        <h1 className="text-[20px] font-bold text-[#1a1540] tracking-tight">New team</h1>
                        <p className="text-[13px] text-[#8e88a8]">Create a new team.</p>
                    </div>
                </div>

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
                            submitLabel="Create team"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}