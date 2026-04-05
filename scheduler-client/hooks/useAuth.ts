import { hasRole, getCurrentUsername, getCurrentUserId } from "@/lib/jwt";

export function useAuth() {
    return {
        userId: getCurrentUserId(),
        username: getCurrentUsername(),
        isAdmin: hasRole("ADMIN"),
        isManager: hasRole("MANAGER"),
        canManageTeam: hasRole("ADMIN") || hasRole("MANAGER"),
    };
}