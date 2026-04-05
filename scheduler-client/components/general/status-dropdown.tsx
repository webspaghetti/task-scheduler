import type {TaskStatus} from "@/types";
import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { STATUS_META } from "@/util/status-utility";

export function StatusDropdown({
                            status,
                            onChange,
                            disabled
                        }: {
    status: TaskStatus;
    onChange: (status: TaskStatus) => void;
    disabled?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const s = STATUS_META[status];


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className={`inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#534AB7]/30 ${s.bg} ${s.color} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-95 shadow-sm'}`}
            >
                {s.icon}
                {s.label}
                <ChevronDown size={14} className={`transition-transform duration-200 opacity-70 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-[#ede9fb] rounded-xl shadow-lg shadow-[#534AB7]/10 z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-[#f0edf9] bg-[#faf9fe]">
                        <span className="text-[10px] font-bold text-[#b0aac8] uppercase tracking-wider">Update Status</span>
                    </div>
                    <div className="py-1">
                        {Object.entries(STATUS_META).map(([key, val]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    onChange(key as TaskStatus);
                                    setIsOpen(false);
                                }}
                                className={`w-full cursor-pointer flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium transition-colors hover:bg-[#f5f3ff] ${status === key ? 'text-[#534AB7] bg-[#f8f7ff]' : 'text-[#4b4668]'}`}
                            >
                                <span className={val.color}>{val.icon}</span>
                                {val.label}
                                {status === key && <CheckCircle2 size={12} className="ml-auto text-[#534AB7]" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}