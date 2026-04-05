import type { UserResponseDto } from "./user";
import React from "react";

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

export interface TaskUpdateStatusDto {
    status: TaskStatus
}

// Grouping helper (client-side only)
// Used on the tasks page to group tasks by team
export interface TasksByTeam {
    teamId: number;
    teamName: string;
    tasks: TaskResponseDto[];
}

// Form
export interface TaskFormProps {
    name: string;
    description: string;
    teamId: string;
    onNameChange: (v: string) => void;
    onDescriptionChange: (v: string) => void;
    onTeamIdChange: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
    submitLabel: string;
    hideTeam?: boolean;
}