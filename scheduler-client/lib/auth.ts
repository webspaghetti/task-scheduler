import type { JwtResponseDto } from "@/types";

const TOKEN_KEY = "token";

// Token helpers
export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

// Save full auth response after login/register
export function saveAuth(auth: JwtResponseDto): void {
    setToken(auth.token);
}

export function clearAuth(): void {
    removeToken();
}