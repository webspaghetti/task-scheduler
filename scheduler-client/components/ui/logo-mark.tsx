export function LogoMark({ size = 28 }: { size?: number }) {
    return (
        <div
            style={{ width: size, height: size }}
            className="rounded-lg bg-[#534AB7] flex items-center justify-center flex-shrink-0"
        >
            <svg
                width={size * 0.57}
                height={size * 0.57}
                viewBox="0 0 16 16"
                fill="none"
            >
                <rect x="2" y="2" width="5" height="5" rx="1.5" fill="#AFA9EC" />
                <rect x="9" y="2" width="5" height="5" rx="1.5" fill="#7F77DD" />
                <rect x="2" y="9" width="5" height="5" rx="1.5" fill="#7F77DD" />
                <rect x="9" y="9" width="5" height="5" rx="1.5" fill="#534AB7" />
            </svg>
        </div>
    );
}