import { TaskStatus } from "@/types";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import React from "react";

export const STATUS_META: Record<TaskStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    TODO:        { label: "Todo",        color: "text-[#534AB7]", bg: "bg-[#EEEDFE]", icon: <Circle size={12} /> },
    IN_PROGRESS: { label: "In progress", color: "text-[#D97706]", bg: "bg-[#FFEDD5]", icon: <Clock size={12} /> },
    COMPLETED:   { label: "Completed",   color: "text-[#3B6D11]", bg: "bg-[#EAF3DE]", icon: <CheckCircle2 size={12} /> },
};