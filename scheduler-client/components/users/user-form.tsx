"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import {UserFormProps} from "@/types";

export function UserForm({
                             firstName,
                             lastName,
                             username,
                             password,
                             passwordConfirm,
                             onFirstNameChange,
                             onLastNameChange,
                             onUsernameChange,
                             onPasswordChange,
                             onPasswordConfirmChange,
                             onSubmit,
                             loading,
                             error,
                             submitLabel,
                         }: UserFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-[12px] font-medium text-[#6b6485]">
                        First Name
                    </Label>
                    <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => onFirstNameChange(e.target.value)}
                        placeholder="John"
                        required
                        className="h-10 rounded-lg border-[#ddd9f5] focus-visible:ring-[#534AB7] text-[13px]"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-[12px] font-medium text-[#6b6485]">
                        Last Name
                    </Label>
                    <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => onLastNameChange(e.target.value)}
                        placeholder="Doe"
                        required
                        className="h-10 rounded-lg border-[#ddd9f5] focus-visible:ring-[#534AB7] text-[13px]"
                    />
                </div>
            </div>

            {onUsernameChange && username !== undefined && (
                <div className="space-y-1.5">
                    <Label htmlFor="username" className="text-[12px] font-medium text-[#6b6485]">
                        Username
                    </Label>
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => onUsernameChange(e.target.value)}
                        placeholder="johndoe"
                        required
                        className="h-10 rounded-lg border-[#ddd9f5] focus-visible:ring-[#534AB7] text-[13px]"
                    />
                </div>
            )}

            {onPasswordChange && password !== undefined && (
                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-[12px] font-medium text-[#6b6485]">
                        Password
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="h-10 rounded-lg border-[#ddd9f5] focus-visible:ring-[#534AB7] text-[13px]"
                    />
                </div>
            )}

            {onPasswordConfirmChange && passwordConfirm !== undefined && (
                <div className="space-y-1.5">
                    <Label htmlFor="passwordConfirm" className="text-[12px] font-medium text-[#6b6485]">
                        Confirm Password
                    </Label>
                    <Input
                        id="passwordConfirm"
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => onPasswordConfirmChange(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="h-10 rounded-lg border-[#ddd9f5] focus-visible:ring-[#534AB7] text-[13px]"
                    />
                </div>
            )}

            {error && (
                <p className="text-[13px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <Button
                type="submit"
                disabled={loading}
                className="bg-[#534AB7] hover:bg-[#6056c9] text-white rounded-lg h-10 px-6 text-[13px] font-medium disabled:opacity-50 cursor-pointer"
            >
                {loading ? "Saving…" : submitLabel}
            </Button>
        </form>
    );
}