"use client";

import { useState, useEffect, useCallback } from "react";
import { usersApi } from "@/lib/api";
import type { UserResponseDto, UserCreateDto, UserUpdateDto } from "@/types";
import { getErrorMessage } from "@/lib/utils";

// Fetch all users
export function useUsers() {
    const [users, setUsers] = useState<UserResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetch = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await usersApi.getAll();
            setUsers(data);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { users, loading, error, refetch: fetch };
}

// Fetch single user
export function useUser(userId: number) {
    const [user, setUser] = useState<UserResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetch = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await usersApi.getById(userId);
            setUser(data);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => { fetch(); }, [fetch]);

    return { user, loading, error, refetch: fetch };
}

// Create user
export function useCreateUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function createUser(
        data: UserCreateDto,
        onSuccess?: (user: UserResponseDto) => void
    ) {
        setLoading(true);
        setError("");
        try {
            const { data: user } = await usersApi.create(data);
            onSuccess?.(user);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return { createUser, loading, error };
}

// Update user
export function useUpdateUser(userId: number) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function updateUser(
        data: UserUpdateDto,
        onSuccess?: (user: UserResponseDto) => void
    ) {
        setLoading(true);
        setError("");
        try {
            const { data: user } = await usersApi.update(userId, data);
            onSuccess?.(user);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return { updateUser, loading, error };
}

// Delete user
export function useDeleteUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function deleteUser(userId: number, onSuccess?: () => void) {
        setLoading(true);
        setError("");
        try {
            await usersApi.remove(userId);
            onSuccess?.();
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return { deleteUser, loading, error };
}

// Manage roles
export function useUserRoles(userId: number) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function addRole(roleId: number, onSuccess?: () => void) {
        setLoading(true);
        setError("");
        try {
            await usersApi.addRole(userId, roleId);
            onSuccess?.();
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    async function removeRole(roleId: number, onSuccess?: () => void) {
        setLoading(true);
        setError("");
        try {
            await usersApi.removeRole(userId, roleId);
            onSuccess?.();
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return { addRole, removeRole, loading, error };
}