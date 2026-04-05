"use client";

import { useState, useEffect, useCallback } from "react";
import { teamsApi } from "@/lib/api";
import type { TeamResponseDto, TeamCreateDto, TeamUpdateDto, UserResponseDto } from "@/types";
import { getErrorMessage } from "@/lib/utils";

// Fetch all teams
export function useTeams() {
    const [teams, setTeams] = useState<TeamResponseDto[]>([]);
    const [teamsLoading, setTeamsLoading] = useState(true);
    const [teamsError, setTeamsError] = useState("");

    const fetch = useCallback(async () => {
        setTeamsLoading(true);
        setTeamsError("");
        try {
            const { data } = await teamsApi.getAll();
            setTeams(data);
        } catch(err) {
            setTeamsError(getErrorMessage(err));
        } finally {
            setTeamsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { teams, teamsLoading, teamsError, refetch: fetch };
}

// Fetch all my teams
export function useMyTeams() {
    const [teams, setTeams] = useState<TeamResponseDto[]>([]);
    const [teamsLoading, setTeamsLoading] = useState(true);
    const [teamsError, setTeamsError] = useState("");

    const fetch = useCallback(async () => {
        setTeamsLoading(true);
        setTeamsError("");
        try {
            const { data } = await teamsApi.getMine();
            setTeams(data);
        } catch(err) {
            setTeamsError(getErrorMessage(err));
        } finally {
            setTeamsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { teams, teamsLoading, teamsError, refetch: fetch };
}

// Fetch single team
export function useTeam(teamId: number) {
    const [team, setTeam] = useState<TeamResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetch = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await teamsApi.getById(teamId);
            setTeam(data);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [teamId]);

    useEffect(() => { fetch(); }, [fetch]);

    return { team, loading, error, refetch: fetch };
}

// Fetch team members
export function useTeamMembers(teamId: number) {
    const [members, setMembers] = useState<UserResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetch = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await teamsApi.getMembers(teamId);
            setMembers(data);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [teamId]);

    useEffect(() => { fetch(); }, [fetch]);

    return { members, loading, error, refetch: fetch };
}

// Fetch non-team members
export function useNonTeamMembers(teamId: number) {
    const [nonMembers, setNonMembers] = useState<UserResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetch = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await teamsApi.getNonMembers(teamId);
            setNonMembers(data);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [teamId]);

    useEffect(() => { fetch(); }, [fetch]);

    return { nonMembers, loading, error, refetch: fetch };
}

// Create team
export function useCreateTeam() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function createTeam(
        data: TeamCreateDto,
        onSuccess?: (team: TeamResponseDto) => void
    ) {
        setLoading(true);
        setError("");
        try {
            const { data: team } = await teamsApi.create(data);
            onSuccess?.(team);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return { createTeam, loading, error };
}

// Update team
export function useUpdateTeam(teamId: number) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function updateTeam(
        data: TeamUpdateDto,
        onSuccess?: (team: TeamResponseDto) => void
    ) {
        setLoading(true);
        setError("");
        try {
            const { data: team } = await teamsApi.update(teamId, data);
            onSuccess?.(team);
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return { updateTeam, loading, error };
}

// Delete team
export function useDeleteTeam() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function deleteTeam(teamId: number, onSuccess?: () => void) {
        setLoading(true);
        setError("");
        try {
            await teamsApi.remove(teamId);
            onSuccess?.();
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return { deleteTeam, loading, error };
}

// Manage members
export function useTeamMembership(teamId: number) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function addMember(userId: number, onSuccess?: () => void) {
        setLoading(true);
        setError("");
        try {
            await teamsApi.addMember(teamId, userId);
            onSuccess?.();
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    async function removeMember(userId: number, onSuccess?: () => void) {
        setLoading(true);
        setError("");
        try {
            await teamsApi.removeMember(teamId, userId);
            onSuccess?.();
        } catch(err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return { addMember, removeMember, loading, error };
}