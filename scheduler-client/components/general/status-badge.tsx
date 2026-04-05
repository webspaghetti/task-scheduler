import { TaskStatus } from "@/types";
import { STATUS_META } from "@/util/status-utility";
import React from "react";

export function StatusBadge({ status }: { status: TaskStatus }) {
    const s = STATUS_META[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold flex-shrink-0 ${s.bg} ${s.color}`}>
            {s.icon}{s.label}
        </span>
    );
}