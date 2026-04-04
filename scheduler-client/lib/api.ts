import axios from "axios";


const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

// Client
const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - attach JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if the request was made to auth endpoints
        const isAuthEndpoint = error.config?.url?.includes('/api/auth/');

        // Only redirect to login page if 401 && AND not auth attempt
        if (error.response?.status === 401 && !isAuthEndpoint) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;


// Auth
import type { LoginRequestDto, UserCreateDto, JwtResponseDto } from "@/types";

export const authApi = {
    login: (data: LoginRequestDto) =>
        api.post<JwtResponseDto>("/api/auth/login", data),

    register: (data: UserCreateDto) =>
        api.post<JwtResponseDto>("/api/auth/register", data),
};


// Users
import type { UserResponseDto, UserUpdateDto } from "@/types";

export const usersApi = {
    getAll: () =>
        api.get<UserResponseDto[]>(`/api/users`),

    getById: (userId: number) =>
        api.get<UserResponseDto>(`/api/users/${userId}`),

    create: (data: UserCreateDto) =>
        api.post<UserResponseDto>("/api/users", data),

    update: (userId: number, data: UserUpdateDto) =>
        api.put<UserResponseDto>(`/api/users/${userId}`, data),

    remove: (userId: number) =>
        api.delete(`/api/users/${userId}`),

    addRole: (userId: number, roleId: number) =>
        api.post(`/api/users/${userId}/roles/${roleId}`),

    removeRole: (userId: number, roleId: number) =>
        api.delete(`/api/users/${userId}/roles/${roleId}`),
};


// Teams
import type { TeamResponseDto, TeamCreateDto, TeamUpdateDto } from "@/types";

export const teamsApi = {
    getAll: () =>
        api.get<TeamResponseDto[]>(`/api/teams`),

    getById: (teamId: number) =>
        api.get<TeamResponseDto>(`/api/teams/${teamId}`),

    create: (data: TeamCreateDto) =>
        api.post<TeamResponseDto>("/api/teams", data),

    update: (teamId: number, data: TeamUpdateDto) =>
        api.put<TeamResponseDto>(`/api/teams/${teamId}`, data),

    remove: (teamId: number) =>
        api.delete(`/api/teams/${teamId}`),

    getMembers: (teamId: number) =>
        api.get<UserResponseDto[]>(`/api/teams/${teamId}/users`),

    getNonMembers: (teamId: number) =>
        api.get<UserResponseDto[]>(`/api/teams/${teamId}/non-users`),

    addMember: (teamId: number, userId: number) =>
        api.post(`/api/teams/${teamId}/users/${userId}`),

    removeMember: (teamId: number, userId: number) =>
        api.delete(`/api/teams/${teamId}/users/${userId}`),
};


// Tasks
import type { TaskResponseDto, TaskCreateDto, TaskUpdateDto } from "@/types";

export const tasksApi = {
    getById: (taskId: number) =>
        api.get<TaskResponseDto>(`/api/tasks/${taskId}`),

    create: (data: TaskCreateDto) =>
        api.post<TaskResponseDto>("/api/tasks", data),

    update: (taskId: number, data: TaskUpdateDto) =>
        api.put<TaskResponseDto>(`/api/tasks/${taskId}`, data),

    remove: (taskId: number) =>
        api.delete(`/api/tasks/${taskId}`),

    getByTeam: (teamId: number) =>
        api.get<TaskResponseDto[]>(`/api/tasks/teams/${teamId}`),

    getByTeamAndUser: (teamId: number, userId: number) =>
        api.get<TaskResponseDto[]>(`/api/tasks/teams/${teamId}/users/${userId}`),

    assignUser: (taskId: number, userId: number) =>
        api.post(`/api/tasks/${taskId}/users/${userId}`),

    unassignUser: (taskId: number, userId: number) =>
        api.delete(`/api/tasks/${taskId}/users/${userId}`),
};