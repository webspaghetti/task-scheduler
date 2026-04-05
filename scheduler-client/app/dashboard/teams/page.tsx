"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTeams, useMyTeams } from "@/hooks/useTeams";
import SharedTeamsPage from "@/components/teams/shared-teams-page";

// Data Fetcher for Admins
function AdminTeamsView() {
    const { teams, teamsLoading, teamsError } = useTeams();

    return (
        <SharedTeamsPage
            teams={teams || []}
            isLoading={teamsLoading}
            error={teamsError}
            canManageTeam={true}
        />
    );
}

// Data Fetcher for Standard Users
function UserTeamsView() {
    const { canManageTeam } = useAuth();
    const { teams, teamsLoading, teamsError } = useMyTeams();

    return (
        <SharedTeamsPage
            teams={teams || []}
            isLoading={teamsLoading}
            error={teamsError}
            canManageTeam={canManageTeam}
        />
    );
}

// Main Page Component
export default function TeamsPage() {
    const { isAdmin } = useAuth();

    // Conditionally route to the correct data fetching component
    if (isAdmin) {
        return <AdminTeamsView />;
    }

    return <UserTeamsView />;
}