// Request DTOs
export interface LoginRequestDto {
    username: string;
    password: string;
}

// Response
export interface JwtResponseDto {
    token: string;
}