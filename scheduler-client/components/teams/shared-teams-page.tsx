"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Users, CheckSquare } from "lucide-react";
import type { SharedTeamsPageProps } from "@/types/team";
import { TeamIcon } from "@/components/teams/team-icon";

export default function SharedTeamsPage({
                                            teams,
                                            isLoading,
                                            error,
                                            canManageTeam,
                                        }: SharedTeamsPageProps) {
    return (
        <>
            <PageHeader title="Teams" description="Manage your teams, view their members, and organize workflows.">
                {canManageTeam && (
                    <Button
                        asChild
                        className="bg-[#534AB7] hover:bg-[#6056c9] text-white rounded-lg text-[13px] h-9 px-4 shadow-sm"
                    >
                        <Link href="/dashboard/teams/new">
                            <Plus size={14} className="mr-1.5" />
                            New team
                        </Link>
                    </Button>
                )}
            </PageHeader>

            <main className="flex-1 p-6 mx-auto w-full">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-500 mb-6">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-20 text-[13px] text-[#b0aac8]">
                        Loading teams…
                    </div>
                ) : teams.length === 0 ? (
                    <div className="bg-white border border-[#ede9fb] rounded-2xl px-6 py-16 text-center shadow-sm">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#f5f3ff] flex items-center justify-center">
                            <Users size={20} className="text-[#a79fdf]" />
                        </div>
                        <h3 className="text-[15px] font-semibold text-[#1a1540] mb-1">No teams found</h3>
                        <p className="text-[13px] text-[#8e88a8] mb-5">Get started by creating your first team.</p>
                        {canManageTeam && (
                            <Button
                                asChild
                                className="bg-[#534AB7] hover:bg-[#6056c9] text-white rounded-lg text-[13px] h-9 px-4 shadow-sm"
                            >
                                <Link href="/dashboard/teams/new">
                                    <Plus size={14} className="mr-1.5" />
                                    Create first team
                                </Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {teams.map((team) => (
                            <Link
                                key={team.id}
                                href={`/dashboard/teams/${team.id}`}
                                className="block"
                            >
                                <div className="bg-white border border-[#ede9fb] rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-[#d4d0f5] transition-all group cursor-pointer">

                                    {/* Header */}
                                    <div className="flex items-start gap-3">
                                        <TeamIcon name={team.name} />

                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="text-[15px] font-bold text-[#1a1540] group-hover:text-[#534AB7] transition-colors leading-tight truncate mb-0.5">
                                                {team.name}
                                            </div>
                                            <p className="text-[12px] text-[#b0aac8] truncate">
                                                Team ID #{team.id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-1"></div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-2 pt-3 border-t border-[#f5f3ff]">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f9f8fe] border border-[#f0edf9] text-[12px] font-medium text-[#7c6fe0]">
                                            <Users size={12} className="text-[#a79fdf]" />
                                            {team.users.length}{" "}
                                            <span className="text-[#b0aac8] font-normal">
                                                {team.users.length === 1 ? "member" : "members"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f9f8fe] border border-[#f0edf9] text-[12px] font-medium text-[#7c6fe0]">
                                            <CheckSquare size={12} className="text-[#a79fdf]" />
                                            {team.tasks.length}{" "}
                                            <span className="text-[#b0aac8] font-normal">
                                                {team.tasks.length === 1 ? "task" : "tasks"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}