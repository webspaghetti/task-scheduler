import type { UserResponseDto } from "./user";

// Response
export interface TeamResponseDto {
    id: number;
    name: string;
    description?: string;
    members: UserResponseDto[];
}

// Request DTOs
export interface TeamCreateDto {
    name: string;
    description?: string;
}

export interface TeamUpdateDto {
    name?: string;
    description?: string;
}