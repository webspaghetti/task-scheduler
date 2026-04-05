export function Avatar({ firstName, lastName, username, size = "md" }: { firstName?: string, lastName?: string, username: string, size?: "md" | "lg" }) {
    const colors = [
        ["#EEF2FF", "#4F46E5"],
        ["#FDF4FF", "#9333EA"],
        ["#FFF7ED", "#EA580C"],
        ["#F0FDF4", "#16A34A"],
        ["#FEF2F2", "#DC2626"],
    ];

    // Hash based on username to keep colors consistent for the same user
    const index = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const [bg, fg] = colors[index];

    const initials = (firstName?.[0] || "") + (lastName?.[0] || "");
    const displayInitials = initials ? initials.toUpperCase() : username.slice(0, 2).toUpperCase();

    const sizeClasses = size === "lg" ? "w-14 h-14 text-[18px]" : "w-9 h-9 text-[11px]";

    return (
        <div
            className={`${sizeClasses} rounded-full flex items-center justify-center font-bold shadow-sm flex-shrink-0`}
            style={{ backgroundColor: bg, color: fg }}
        >
            {displayInitials}
        </div>
    );
}
