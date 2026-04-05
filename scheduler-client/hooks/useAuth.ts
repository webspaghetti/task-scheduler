import { hasRole, getCurrentUsername } from "@/lib/jwt";

export function useAuth() {
    return {
        username: getCurrentUsername(),
        isAdmin: hasRole("ADMIN"),
        isManager: hasRole("MANAGER"),
        canManageTeam: hasRole("ADMIN") || hasRole("MANAGER"),
    };
}