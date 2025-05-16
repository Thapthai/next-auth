'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { signIn } from 'next-auth/react';

export default function TwoFAPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const twoFAToken = searchParams.get("token");

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    if (userId == null || twoFAToken == null) {
        router.push('login');
    }

    const handleVerify = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/auth/2fa/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${twoFAToken}`, // แนบ token
                },
                body: JSON.stringify({ userId: Number(userId), code }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "รหัสไม่ถูกต้อง");
                return;
            }

            // เข้าระบบผ่าน NextAuth
            const result = await signIn("credentials", {
                redirect: false,
                email: data.user.email,
                token: data.token,
                user: JSON.stringify(data.user),
            });

            if (result?.ok) {
                router.push("/dashboard");
            }

        } catch (err) {
            toast.error("เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-20 space-y-4">
            <h1 className="text-xl font-bold">กรอกรหัส 2FA</h1>
            <Input
                placeholder="รหัส 6 หลัก"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <Button onClick={handleVerify} disabled={loading}>
                {loading ? "กำลังตรวจสอบ..." : "ยืนยัน"}
            </Button>
        </div>
    );
}
