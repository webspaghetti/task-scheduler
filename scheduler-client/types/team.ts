import type { UserResponseDto } from "./user";
import { TaskResponseDto } from "@/types/task";
import React from "react";

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

// Shared
export interface SharedTeamsPageProps {
    teams: TeamResponseDto[];
    isLoading: boolean;
    error: string | null;
    canManageTeam: boolean;
}

// Form
export interface TeamFormProps {
    name: string;
    onNameChange: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
    submitLabel: string;
}