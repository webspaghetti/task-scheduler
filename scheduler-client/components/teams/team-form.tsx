"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface TeamFormProps {
    name: string;
    onNameChange: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
    submitLabel: string;
}

export function TeamForm({
                             name,
                             onNameChange,
                             onSubmit,
                             loading,
                             error,
                             submitLabel,
                         }: TeamFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[12px] font-medium text-[#6b6485]">
                    Team name
                </Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="e.g. Backend squad"
                    required
                    className="h-10 rounded-lg border-[#ddd9f5] focus-visible:ring-[#534AB7] text-[13px]"
                />
            </div>

            {error && (
                <p className="text-[13px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <Button
                type="submit"
                disabled={loading}
                className="bg-[#534AB7] hover:bg-[#6056c9] cursor-pointer text-white rounded-lg h-10 px-6 text-[13px] font-medium disabled:opacity-50"
            >
                {loading ? "Saving…" : submitLabel}
            </Button>
        </form>
    );
}