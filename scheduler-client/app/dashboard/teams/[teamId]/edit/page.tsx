"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTeam, useUpdateTeam } from "@/hooks/useTeams";
import { PageHeader } from "@/components/ui/page-header";
import { TeamForm } from "@/components/teams/team-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
        <>
            <PageHeader title="Edit team" description="Update team details.">
                <Button
                    variant="ghost"
                    asChild
                    className="text-[13px] text-[#6b6485] hover:text-[#534AB7] hover:bg-[#f3f0fd] h-9 rounded-lg"
                >
                    <Link href={`/dashboard/teams/${id}`}>
                        <ArrowLeft size={14} className="mr-1.5" />
                        Back
                    </Link>
                </Button>
            </PageHeader>

            <main className="flex-1 p-6">
                {fetching ? (
                    <div className="text-[13px] text-[#b0aac8]">Loading…</div>
                ) : (
                    <div className="max-w-md bg-white border border-[#ede9fb] rounded-xl p-6">
                        <TeamForm
                            name={name}
                            onNameChange={setName}
                            onSubmit={handleSubmit}
                            loading={loading}
                            error={error}
                            submitLabel="Save changes"
                        />
                    </div>
                )}
            </main>
        </>
    );
}