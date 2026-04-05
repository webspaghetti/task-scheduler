import React from "react";

export function HistoryMessage({ text }: { text: string }) {
    // Split the text by specific keywords while preserving them in the output array using capture groups
    const parts = text.split(/(CREATED|UPDATED|ADDED|REMOVED|DELETED|TASK:|TEAM:|USER:|ROLE:)/g);

    return (
        <span>
            {parts.map((part, i) => {
                switch (part) {
                    case "CREATED":
                    case "ADDED":
                        return <span key={i} className="text-emerald-600 font-bold text-[11px] px-1 bg-emerald-50 rounded mx-0.5">{part}</span>;
                    case "REMOVED":
                    case "DELETED":
                        return <span key={i} className="text-red-500 font-bold text-[11px] px-1 bg-red-50 rounded mx-0.5">{part}</span>;
                    case "UPDATED":
                        return <span key={i} className="text-amber-500 font-bold text-[11px] px-1 bg-amber-50 rounded mx-0.5">{part}</span>;
                    case "TASK:":
                    case "TEAM:":
                    case "USER:":
                    case "ROLE:":
                        return <span key={i} className="text-[#534AB7] font-semibold ml-1">{part}</span>;
                    default:
                        return <span key={i}>{part}</span>;
                }
            })}
        </span>
    );
}