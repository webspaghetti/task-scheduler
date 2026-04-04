"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateTeam } from "@/hooks/useTeams";
import { PageHeader } from "@/components/ui/page-header";
import { TeamForm } from "@/components/teams/team-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
        <>
            <PageHeader title="New team" description="Create a new team.">
                <Button
                    variant="ghost"
                    asChild
                    className="text-[13px] text-[#6b6485] hover:text-[#534AB7] hover:bg-[#f3f0fd] h-9 rounded-lg"
                >
                    <Link href="/dashboard/teams">
                        <ArrowLeft size={14} className="mr-1.5" />
                        Back
                    </Link>
                </Button>
            </PageHeader>

            <main className="flex-1 p-6">
                <div className="max-w-md bg-white border border-[#ede9fb] rounded-xl p-6">
                    <TeamForm
                        name={name}
                        onNameChange={setName}
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                        submitLabel="Create team"
                    />
                </div>
            </main>
        </>
    );
}