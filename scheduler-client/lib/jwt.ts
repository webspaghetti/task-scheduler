interface JwtPayload {
    userId: number;
    sub: string;
    roles: string[];
    iat: number;
    exp: number;
}

// Decode the JWT payload
export function decodeJwt(token: string): JwtPayload | null {
    try {
        const base64 = token.split(".")[1];
        const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json) as JwtPayload;
    } catch {
        return null;
    }
}

export function getCurrentUserId(): number | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    return decodeJwt(token)?.userId ?? null;
}

export function getCurrentUsername(): string | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    return decodeJwt(token)?.sub ?? null;
}

export function getCurrentRoles(): string[] {
    if (typeof window === "undefined") return [];
    const token = localStorage.getItem("token");
    if (!token) return [];
    return decodeJwt(token)?.roles ?? [];
}

export function hasRole(role: string): boolean {
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return getCurrentRoles().includes(normalized);
}