import type { UserResponseDto } from "./user";
import type { TeamResponseDto } from "./team";

// Response
export interface TaskResponseDto {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    team: TeamResponseDto;
    assignees: UserResponseDto[];
    createdAt: string;   // ISO 8601
    updatedAt: string;
}

// Request DTOs
export interface TaskCreateDto {
    title: string;
    description?: string;
    status?: TaskStatus;
    teamId: number;
}

export interface TaskUpdateDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
}

// Enums
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";