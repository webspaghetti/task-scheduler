import React from "react";

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F9F8FF] flex items-center justify-center p-4">
            {/* Ambient orbs - Opacity slightly increased for visibility on light bg */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#534AB7] opacity-[0.15] blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#7F77DD] opacity-[0.15] blur-3xl" />
                <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-[#AFA9EC] opacity-[0.2] blur-3xl" />
            </div>
            {children}
        </div>
    );
}