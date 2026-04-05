"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateUser } from "@/hooks/useUsers";
import { UserForm } from "@/components/users/user-form";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function NewUserPage() {
    const router = useRouter();
    const { createUser, loading, error: apiError } = useCreateUser();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [validationError, setValidationError] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setValidationError("");

        if (password !== passwordConfirm) {
            setValidationError("Passwords do not match");
            return;
        }

        createUser({ firstName, lastName, username, password }, (user) => {
            router.push(`/dashboard/users/${user.id}`);
        });
    }

    return (
        <div className="min-h-screen">
            {/* Top nav bar */}
            <div className="bg-white border-b border-[#ede9fb] px-6 py-3 flex items-center justify-between">
                <Link
                    href="/dashboard/users"
                    className="flex items-center gap-1.5 text-[13px] font-medium text-[#8e88a8] hover:text-[#534AB7] transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to users
                </Link>
            </div>

            <main className="max-w-xl mx-auto px-6 py-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#EEEDFE] flex items-center justify-center text-[#534AB7]">
                        <UserPlus size={24} />
                    </div>
                    <div>
                        <h1 className="text-[20px] font-bold text-[#1a1540] tracking-tight">New user</h1>
                        <p className="text-[13px] text-[#8e88a8]">Create a new team member account.</p>
                    </div>
                </div>

                <div className="bg-white border border-[#ede9fb] rounded-2xl overflow-hidden shadow-sm h-fit">
                    <div className="px-6 py-4 border-b border-[#f0edf9] bg-[#fcfbfe]">
                        <h2 className="text-[14px] font-bold text-[#1a1540]">User Information</h2>
                    </div>
                    <div className="p-6">
                        <UserForm
                            firstName={firstName}
                            lastName={lastName}
                            username={username}
                            password={password}
                            passwordConfirm={passwordConfirm}
                            onFirstNameChange={setFirstName}
                            onLastNameChange={setLastName}
                            onUsernameChange={setUsername}
                            onPasswordChange={setPassword}
                            onPasswordConfirmChange={setPasswordConfirm}
                            onSubmit={handleSubmit}
                            loading={loading}
                            error={validationError || apiError}
                            submitLabel="Create user"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}