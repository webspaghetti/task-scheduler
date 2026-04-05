export function TaskAvatar({ username }: { username: string }) {
    const colors = [
        ["#EEF2FF", "#4F46E5"],
        ["#FDF4FF", "#9333EA"],
        ["#FFF7ED", "#EA580C"],
        ["#F0FDF4", "#16A34A"],
        ["#FEF2F2", "#DC2626"],
    ];
    const [bg, fg] = colors[username.charCodeAt(0) % colors.length];
    return (
        <div
            title={username}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm border-2 border-white -ml-2 first:ml-0 relative hover:z-10 transition-transform hover:scale-110"
            style={{ backgroundColor: bg, color: fg }}
        >
            {username.slice(0, 2).toUpperCase()}
        </div>
    );
}