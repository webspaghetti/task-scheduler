export function Field({ label, value }: { label: string; value: string }) {
    return (
        <div className="py-4 border-b border-[#f0edf9] last:border-0 flex items-center">
            <span className="w-36 text-[11px] font-bold text-[#b0aac8] uppercase tracking-widest flex-shrink-0">
                {label}
            </span>
            <span className="text-[14px] font-medium text-[#2d2860]">{value || "—"}</span>
        </div>
    );
}