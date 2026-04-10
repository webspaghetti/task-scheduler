"use client";

import { useState, useEffect, useCallback } from "react";
import { tasksApi, teamsApi } from "@/lib/api";
import { getCurrentUserId } from "@/lib/jwt";
import type {
    TaskResponseDto,
    TaskCreateDto,
    TaskUpdateDto,
    TasksByTeam, TaskUpdateStatusDto,
} from "@/types";
import { getErrorMessage } from "@/lib/utils";

// All tasks grouped by team
export function useAllTasksGrouped() {
    const [groups, setGroups] = useState<TasksByTeam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetch = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const { data: teams } = await teamsApi.getAll();

            const settled = await Promise.allSettled(
                teams.map(async (team) => {
                    const { data: tasks } = await tasksApi.getByTeam(team.id);

                    return {
                        teamId: team.id,
                        teamName: team.name,
                        tasks,
                    } satisfies TasksByTeam;
                })
            );

            const result: TasksByTeam[] = settled
                .filter((r): r is PromiseFulfilledResult<TasksByTeam> => r.status === "fulfilled")
                .map((r) => r.value)
                .filter((g) => g.tasks.length > 0);

            setGroups(result);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    return { groups, loading, error, refetch: fetch };
}

// My tasks grouped by team
export function useMyTasksGrouped() {
    const [groups, setGroups] = useState<TasksByTeam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetch = useCallback(async () => {
        const userId = getCurrentUserId();
        if (!userId) {
            setGroups([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError("");
        try {
            const { data: teams } = await teamsApi.getMine();

            const settled = await Promise.allSettled(
                teams.map(async (team) => {
                    const { data: tasks } = await tasksApi.getByTeamAndUser(team.id, userId);
                    return {
                        teamId: team.id,
                        teamName: team.name,
                        tasks,
                    } satisfies TasksByTeam;
                })
            );

            const result: TasksByTeam[] = settled
                .filter((r): r is PromiseFulfilledResult<TasksByTeam> => r.status === "fulfilled")
                .map((r) => r.value)
                .filter((g) => g.tasks.length > 0);

            setGroups(result);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    return { groups, loading, error, refetch: fetch };
}

// Fetch all tasks
export function useTasks() {
    const [tasks, setTasks] = useState<TaskResponseDto[]>([]);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [tasksError, setTasksError] = useState("");

    const fetch = useCallback(async () => {
        setTasksLoading(true);
        setTasksError("");
        try {
            const { data } = await tasksApi.getAll();
            setTasks(data);
        } catch(err) {
            setTasksError(getErrorMessage(err));
        } finally {
            setTasksLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    return { tasks, tasksLoading, tasksError, refetch: fetch };
}

// Fetch single task
export function useTask(taskId: number) {
    const [task, setTask] = useState<TaskResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetch = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await tasksApi.getById(taskId);
            setTask(data);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [taskId]);

    useEffect(() => { fetch(); }, [fetch]);

    return { task, loading, error, refetch: fetch };
}

// Create task
export function useCreateTask() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function createTask(
        data: TaskCreateDto,
        onSuccess?: (task: TaskResponseDto) => void
    ) {
        setLoading(true);
        setError("");
        try {
            const { data: task } = await tasksApi.create(data);
            onSuccess?.(task);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return { createTask, loading, error };
}

// Update task
export function useUpdateTask(taskId: number) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function updateTask(
        data: TaskUpdateDto,
        onSuccess?: (task: TaskResponseDto) => void
    ) {
        setLoading(true);
        setError("");
        try {
            const { data: task } = await tasksApi.update(taskId, data);
            onSuccess?.(task);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return { updateTask, loading, error };
}

export function useUpdateTaskStatus(taskId: number) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function updateTask(
        data: TaskUpdateStatusDto,
        onSuccess?: (task: TaskResponseDto) => void
    ) {
        setLoading(true);
        setError("");
        try {
            const { data: task } = await tasksApi.updateStatus(taskId, data);
            onSuccess?.(task);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return { updateTask, loading, error };
}

// Delete task
export function useDeleteTask() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function deleteTask(taskId: number, onSuccess?: () => void) {
        setLoading(true);
        setError("");
        try {
            await tasksApi.remove(taskId);
            onSuccess?.();
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return { deleteTask, loading, error };
}

// Assign / unassign user
export function useTaskAssignment(taskId: number) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function assignUser(userId: number, onSuccess?: () => void) {
        setLoading(true);
        setError("");
        try {
            await tasksApi.assignUser(taskId, userId);
            onSuccess?.();
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    async function unassignUser(userId: number, onSuccess?: () => void) {
        setLoading(true);
        setError("");
        try {
            await tasksApi.unassignUser(taskId, userId);
            onSuccess?.();
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return { assignUser, unassignUser, loading, error };
}