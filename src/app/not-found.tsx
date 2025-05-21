"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    // useEffect(() => {
    //     router.replace("/dashboard");
    // }, [router]);

    // return null; // หรือแสดง Loading...

    return (
        <div>
            <h3>404 File Not Found </h3>
        </div>
    );
}
