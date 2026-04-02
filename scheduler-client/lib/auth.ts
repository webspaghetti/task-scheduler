import type { JwtResponseDto } from "@/types";

const TOKEN_KEY = "token";

// Token helpers
export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    // Sync to cookie so middleware (server-side) can read it
    document.cookie = `${TOKEN_KEY}=${token}; path=/; SameSite=Lax`;
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    // Clear cookie too
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
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