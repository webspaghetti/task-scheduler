"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

interface TaskFormProps {
    name: string;
    description: string;
    teamId: string;
    onNameChange: (v: string) => void;
    onDescriptionChange: (v: string) => void;
    onTeamIdChange: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
    submitLabel: string;
    hideTeam?: boolean;
}

export function TaskForm({
                             name, description, teamId,
                             onNameChange, onDescriptionChange, onTeamIdChange,
                             onSubmit, loading, error, submitLabel, hideTeam = false,
                         }: TaskFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[12px] font-medium text-[#6b6485]">Task name</Label>
                <Input id="name" value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. Fix login bug" required className="h-10 rounded-lg border-[#ddd9f5] focus-visible:ring-[#534AB7] text-[13px]" />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="description" className="text-[12px] font-medium text-[#6b6485]">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => onDescriptionChange(e.target.value)} placeholder="Describe the task…" rows={3} className="rounded-lg border-[#ddd9f5] focus-visible:ring-[#534AB7] text-[13px] resize-none" />
            </div>
            {!hideTeam && (
                <div className="space-y-1.5">
                    <Label htmlFor="teamId" className="text-[12px] font-medium text-[#6b6485]">Team ID</Label>
                    <Input id="teamId" type="number" value={teamId} onChange={(e) => onTeamIdChange(e.target.value)} placeholder="e.g. 3" required className="h-10 rounded-lg border-[#ddd9f5] focus-visible:ring-[#534AB7] text-[13px]" />
                    <p className="text-[11px] text-[#b0aac8]">Replace with a team selector once a list endpoint is available.</p>
                </div>
            )}
            {error && <p className="text-[13px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
            <Button type="submit" disabled={loading} className="bg-[#534AB7] hover:bg-[#6056c9] text-white rounded-lg h-10 px-6 text-[13px] font-medium disabled:opacity-50 cursor-pointer">
                {loading ? "Saving…" : submitLabel}
            </Button>
        </form>
    );
}