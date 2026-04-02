// Request DTOs
export interface LoginRequestDto {
    username: string;
    password: string;
}

export interface UserCreateDto {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

// Response
export interface JwtResponseDto {
    token: string;
}