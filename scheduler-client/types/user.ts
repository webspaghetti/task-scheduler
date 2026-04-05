// Role
import React from "react";

export interface RoleResponseDto {
    id: number;
    name: string;
}

// Response
export interface UserResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    roles: RoleResponseDto[];
}

// Request DTOs
export interface UserCreateDto {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export interface UserUpdateDto {
    firstName: string;
    lastName: string;
}

// Form
export interface UserFormProps {
    firstName: string;
    lastName: string;
    username?: string;
    password?: string;
    passwordConfirm?: string;
    onFirstNameChange: (v: string) => void;
    onLastNameChange: (v: string) => void;
    onUsernameChange?: (v: string) => void;
    onPasswordChange?: (v: string) => void;
    onPasswordConfirmChange?: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
    submitLabel: string;
}