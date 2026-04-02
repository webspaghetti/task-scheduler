// Role
export interface RoleResponseDto {
    id: number;
    name: string;        // e.g. "ROLE_ADMIN", "ROLE_USER"
}

// Response
export interface UserResponseDto {
    id: number;
    username: string;
    email: string;
    roles: RoleResponseDto[];
}

// Request DTOs
export interface UserCreateDto {
    username: string;
    email: string;
    password: string;
}

export interface UserUpdateDto {
    username?: string;
    email?: string;
    password?: string;
}