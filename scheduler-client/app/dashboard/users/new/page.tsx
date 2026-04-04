"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateUser } from "@/hooks/useUsers";
import { PageHeader } from "@/components/ui/page-header";
import { UserForm } from "@/components/users/user-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
        <>
            <PageHeader title="New user" description="Create a new team member account.">
                <Button
                    variant="ghost"
                    asChild
                    className="text-[13px] text-[#6b6485] hover:text-[#534AB7] hover:bg-[#f3f0fd] h-9 rounded-lg"
                >
                    <Link href="/dashboard/users">
                        <ArrowLeft size={14} className="mr-1.5" />
                        Back
                    </Link>
                </Button>
            </PageHeader>

            <main className="flex-1 p-6">
                <div className="max-w-md bg-white border border-[#ede9fb] rounded-xl p-6">
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
            </main>
        </>
    );
}