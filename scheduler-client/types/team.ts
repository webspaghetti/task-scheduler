import type { UserResponseDto } from "./user";
import { TaskResponseDto } from "@/types/task";

// Response
export interface TeamResponseDto {
    id: number;
    name: string;
    tasks: TaskResponseDto[];
    users: UserResponseDto[];
}

// Request DTOs
export interface TeamCreateDto {
    name: string;
}

export interface TeamUpdateDto {
    name: string;
}

// Shared DTO
export interface SharedTeamsPageProps {
    teams: TeamResponseDto[];
    isLoading: boolean;
    error: string | null;
    canManageTeam: boolean;
}