"use client";

import Link from "next/link";
import {useDeleteTeam, useTeams} from "@/hooks/useTeams";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Users, CheckSquare } from "lucide-react";

export default function TeamsPage() {

    const { teams, loading, error, refetch } = useTeams();
    const { deleteTeam, loading: deleting } = useDeleteTeam();

    function handleDelete(teamId: number) {
        if (!confirm("Delete this team? This cannot be undone.")) return;
        deleteTeam(teamId, () => refetch());
    }

    return (
        <>
            <PageHeader title="Teams" description="Manage your teams.">
                <Button
                    asChild
                    className="bg-[#534AB7] hover:bg-[#6056c9] text-white rounded-lg text-[13px] h-9 px-4"
                >
                    <Link href="/dashboard/teams/new">
                        <Plus size={14} className="mr-1.5" />
                        New team
                    </Link>
                </Button>
            </PageHeader>

            <main className="flex-1 p-6">
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                {loading ? (
                    <div className="text-[13px] text-[#b0aac8]">Loading teams…</div>
                ) : teams.length === 0 ? (
                    <div className="bg-white border border-[#ede9fb] rounded-xl px-5 py-12 text-center">
                        <p className="text-[13px] text-[#b0aac8] mb-3">No teams yet.</p>
                        <Button
                            asChild
                            variant="outline"
                            className="text-[#534AB7] border-[#ddd9f5] hover:bg-[#f3f0fd] text-[13px] h-9 rounded-lg"
                        >
                            <Link href="/dashboard/teams/new">
                                <Plus size={13} className="mr-1.5" />
                                Create first team
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teams.map((team) => (
                            <div
                                key={team.id}
                                className="bg-white border border-[#ede9fb] rounded-xl p-5 flex flex-col gap-3 hover:border-[#c9c3f0] transition-colors"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between gap-2">
                                    <Link
                                        href={`/dashboard/teams/${team.id}`}
                                        className="text-[14px] font-semibold text-[#26215C] hover:text-[#534AB7] transition-colors leading-snug"
                                    >
                                        {team.name}
                                    </Link>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                            className="h-7 w-7 text-[#8e88a8] hover:text-[#534AB7] hover:bg-[#EEEDFE] rounded-lg"
                                        >
                                            <Link href={`/dashboard/teams/${team.id}/edit`}>
                                                <Pencil size={12} />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            disabled={deleting}
                                            onClick={() => handleDelete(team.id)}
                                            className="h-7 w-7 text-[#8e88a8] hover:text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={12} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Description
                                {team.description && (
                                    <p className="text-[12px] text-[#8e88a8] leading-relaxed line-clamp-2">
                                        {team.description}
                                    </p>
                                )}*/}

                                {/* Member + task count */}
                                <div className="flex items-center justify-between text-[12px] text-[#b0aac8] mt-auto pt-2 border-t border-[#f0edf9]">
                                    <div className="flex items-center gap-1.5">
                                        <Users size={12} />
                                        {team.users.length}{" "}
                                        {team.users.length === 1 ? "member" : "members"}
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <CheckSquare size={12} />
                                        {team.tasks.length}{" "}
                                        {team.tasks.length === 1 ? "task" : "tasks"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}