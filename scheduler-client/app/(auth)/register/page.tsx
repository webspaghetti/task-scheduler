"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import { LogoMark } from "@/components/ui/logo-mark";

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (password !== passwordConfirm) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const { data } = await authApi.register({ username, firstName, lastName, password });
            saveAuth(data);
            router.push("/dashboard");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative w-full max-w-md">
            <div className="rounded-2xl border border-slate-200 bg-[#EEEAFB]/80 backdrop-blur-sm p-10 shadow-sm">
                {/* Logo */}
                <div className="flex items-center gap-2.5 mb-10">
                    <LogoMark />
                    <span className="text-sm font-semibold text-[#534AB7] tracking-wide">
                        teamflow
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-semibold text-slate-900 mb-1">
                    Create account
                </h1>
                <p className="text-sm text-slate-500 mb-8">
                    Join your team today
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="firstName"
                                className="text-xs font-medium text-[#8e8aaf] uppercase tracking-wider"
                            >
                                First name
                            </Label>
                            <Input
                                id="firstName"
                                type="text"
                                autoComplete="firstName"
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400
                                focus-visible:ring-[#534AB7] focus-visible:border-[#534AB7] h-11 rounded-xl"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="lastName"
                                className="text-xs font-medium text-[#8e8aaf] uppercase tracking-wider"
                            >
                                Last name
                            </Label>
                            <Input
                                id="lastName"
                                type="text"
                                autoComplete="lastName"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400
                                focus-visible:ring-[#534AB7] focus-visible:border-[#534AB7] h-11 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label
                            htmlFor="username"
                            className="text-xs font-medium text-slate-600 uppercase tracking-wider"
                        >
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            autoComplete="username"
                            placeholder="johndoe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400
                            focus-visible:ring-[#534AB7] focus-visible:border-[#534AB7] h-11 rounded-xl shadow-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label
                            htmlFor="password"
                            className="text-xs font-medium text-slate-600 uppercase tracking-wider"
                        >
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400
                            focus-visible:ring-[#534AB7] focus-visible:border-[#534AB7] h-11 rounded-xl shadow-sm"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="passwordConfirm"
                            className="text-xs font-medium text-slate-600 uppercase tracking-wider"
                        >
                            Confirm password
                        </Label>
                        <Input
                            id="passwordConfirm"
                            type="password"
                            autoComplete="password-confirm"
                            placeholder="••••••••••••••••"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400
                            focus-visible:ring-[#534AB7] focus-visible:border-[#534AB7] h-11 rounded-xl shadow-sm"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 rounded-xl bg-[#534AB7] hover:bg-[#433b93] text-white
                        font-medium transition-colors disabled:opacity-50 shadow-sm"
                    >
                        {loading ? "Creating account…" : "Create account"}
                    </Button>
                </form>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have one?{" "}
                    <Link
                        href="/login"
                        className="text-[#534AB7] font-medium hover:text-[#433b93] transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}