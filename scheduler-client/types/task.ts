import type { UserResponseDto } from "./user";

// Enums
export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

// Response
export interface TaskResponseDto {
    id: number;
    name: string;
    description: string;
    teamId: number;
    status: TaskStatus;
    createdAt: string;   // ISO 8601
    completedAt: string;   // ISO 8601
    users: UserResponseDto[];
}

// Request DTOs
export interface TaskCreateDto {
    name: string;
    description: string;
    teamId: number;
}

export interface TaskUpdateDto {
    name: string;
    description: string;
}

// Grouping helper (client-side only)
// Used on the tasks page to group tasks by team
export interface TasksByTeam {
    teamId: number;
    teamName: string;
    tasks: TaskResponseDto[];
}