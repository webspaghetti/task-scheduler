// Request DTOs
export interface LoginRequestDto {
    username: string;
    password: string;
}

export interface RegisterRequestDto {
    username: string;
    email: string;
    password: string;
}

// Response
export interface AuthResponseDto {
    token: string;
    type: string;        // e.g. "Bearer"
    username: string;
}