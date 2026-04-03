import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#f7f6fb] flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-[120px] font-bold leading-none text-[#A7A6B2] select-none">
                    404
                </p>

                <h1 className="text-[22px] font-semibold text-[#26215C] mt-2 mb-2">
                    Page not found
                </h1>
                <p className="text-[14px] text-[#8e88a8] mb-8 max-w-sm mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex items-center justify-center gap-3">
                    <Button
                        asChild
                        className="bg-[#534AB7] hover:bg-[#6056c9] text-white rounded-lg h-10 px-5 text-[13px] font-medium"
                    >
                        <Link href="/dashboard">Go to dashboard</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}