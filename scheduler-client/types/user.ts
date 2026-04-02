// Role
export interface RoleResponseDto {
    id: number;
    name: string;        // e.g. "ROLE_ADMIN", "ROLE_USER"
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