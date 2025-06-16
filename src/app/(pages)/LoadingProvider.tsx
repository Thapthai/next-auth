"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";


export default function LoadingProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const [isLoading, setIsLoading] = useState(false);

    function Spinner({ className = "" }: { className?: string }) {
        return (
            <div className={`animate-spin rounded-full border-4 border-blue-500 border-t-transparent h-10 w-10 ${className}`} />
        );
    }

    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleComplete = () => setIsLoading(false);

        // route change start & complete
        router.prefetch(pathname); // ให้เร็วขึ้น
        handleStart();

        const timeout = setTimeout(() => {
            handleComplete();
        }, 300); // กันกรณี redirect หรือโหลดเร็วเกินไป

        return () => clearTimeout(timeout);
    }, [pathname]);
    return (
        <div className="relative w-full h-full">
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60">
                    <Spinner className="w-10 h-10 text-blue-500" />
                </div>
            )}

            <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
                {children}
            </div>
        </div>
    );
}
