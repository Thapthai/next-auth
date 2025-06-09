"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailSuccessful() {
    const [countdown, setCountdown] = useState(10);
    const router = useRouter();

    useEffect(() => {
        if (countdown === 0) {
            router.push("/login");
            return;
        }

        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown, router]);

    const progress = ((10 - countdown) / 10) * 100;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
                <h1 className="text-2xl font-bold text-green-600 mb-4">
                    ยืนยันอีเมลสำเร็จแล้ว!
                </h1>
                <p className="text-gray-600 mb-4">บัญชีของคุณได้รับการยืนยันเรียบร้อยแล้ว</p>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                    กำลังเปลี่ยนหน้าเข้าสู่ระบบใน {countdown} วินาที...
                </p>

                <Link href="/login">
                    <Button className="w-full">เข้าสู่ระบบ</Button>
                </Link>
            </div>
        </div>
    );
}
