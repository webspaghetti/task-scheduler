import type {TaskResponseDto} from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/general/avatar";
import { StatusBadge } from "@/components/general/status-badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import React from "react";

export function TaskRow({ task, teamId }: { task: TaskResponseDto; teamId: string | number }) {
    const { canManageTeam } = useAuth();

    const router = useRouter();
    const isCompleted = task.status === "COMPLETED";

    return (
        <div
            onClick={() => router.push(`/dashboard/teams/${teamId}/tasks/${task.id}`)}
            className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 border-b border-[#f0edf9] last:border-0 hover:bg-[#faf9fe] transition-colors group cursor-pointer"
        >
            <div className="flex-1 min-w-0">
                <Link
                    href={`/dashboard/teams/${teamId}/tasks/${task.id}`}
                    className={`text-[14px] font-bold transition-colors truncate block ${
                        isCompleted
                            ? "text-[#a09abc] line-through decoration-1"
                            : "text-[#1a1540] hover:text-[#534AB7]"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {task.name}
                </Link>

                {task.description && (
                    <p className={`text-[13px] truncate mt-0.5 ${
                        isCompleted ? "text-[#c4bedd]" : "text-[#8e88a8]"
                    }`}>
                        {task.description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-6 sm:ml-auto">
                <div className={`flex items-center flex-shrink-0 ${isCompleted ? "opacity-60" : ""}`}>
                    {task.users.slice(0, 3).map((u) => (
                        <Avatar key={u.id} username={u.username} />
                    ))}
                    {task.users.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-[#f0edf9] flex items-center justify-center text-[9px] font-bold text-[#8e88a8] shadow-sm border-2 border-white -ml-2 relative">
                            +{task.users.length - 3}
                        </div>
                    )}
                </div>

                <div className="w-28 flex-shrink-0">
                    <StatusBadge status={task.status} />
                </div>

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                >
                    {canManageTeam && (
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8 text-[#b0aac8] hover:text-[#534AB7] hover:bg-[#EEEDFE] rounded-lg flex-shrink-0"
                        >
                            <Link href={`/dashboard/teams/${teamId}/tasks/${task.id}/edit`}>
                                <Pencil size={14} />
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}