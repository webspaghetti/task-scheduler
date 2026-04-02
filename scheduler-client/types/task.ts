import type { UserResponseDto } from "./user";

// Response
export interface TaskResponseDto {
    id: number;
    name: string;
    description: string;
    teamId: number;
    status: string;
    createdAt: string;   // ISO 8601
    completedAt: string;
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