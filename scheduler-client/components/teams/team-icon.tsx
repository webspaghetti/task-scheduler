export function TeamIcon({ name }: { name: string }) {
    const themes = [
        { from: "#4F46E5", to: "#7C3AED", shadow: "shadow-[#4F46E5]/20" }, // Indigo to Purple
        { from: "#059669", to: "#10B981", shadow: "shadow-[#059669]/20" }, // Emerald
        { from: "#EA580C", to: "#F97316", shadow: "shadow-[#EA580C]/20" }, // Orange
        { from: "#DC2626", to: "#EF4444", shadow: "shadow-[#DC2626]/20" }, // Red
        { from: "#2563EB", to: "#3B82F6", shadow: "shadow-[#2563EB]/20" }, // Blue
        { from: "#C026D3", to: "#D946EF", shadow: "shadow-[#C026D3]/20" }, // Fuchsia
    ];

    // Create a simple hash from the string to ensure the same team always gets the same color
    const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % themes.length;
    const theme = themes[index];

    return (
        <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-[13px] text-white font-bold shadow-md flex-shrink-0 ${theme.shadow}`}
            style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
        >
            {name.slice(0, 2).toUpperCase()}
        </div>
    );
}