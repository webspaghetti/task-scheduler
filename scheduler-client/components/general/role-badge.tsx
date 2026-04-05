import { ShieldCheck } from "lucide-react";

const roleColors: Record<string, string> = {
    USER: "bg-[#E1F5EE] text-[#0F6E56]",      // Green tint
    MANAGER: "bg-[#EEEDFE] text-[#534AB7]",   // Brand purple tint
    ADMIN: "bg-[#FFF4E5] text-[#B76E00]",     // Amber tint
};

export function RoleBadge({ name }: { name: string }) {
    const label = name.replace("ROLE_", "");
    const colorClass = roleColors[label.toUpperCase()];
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
            <ShieldCheck size={11} />
            {label}
        </span>
    );
}