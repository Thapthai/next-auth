"use client"; // ใช้เพื่อบอกว่าโค้ดนี้เป็น client-side code

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

// ฟังก์ชันสำหรับการ logout
export const logout = async () => {
    await signOut({ callbackUrl: "/login" }); // หลัง logout ให้ redirect ไปหน้า login
};

const SettingPage = () => {
    return (
        <div>
            Setting Page
            <Button
                onClick={() => logout()} // เรียกใช้ฟังก์ชัน logout เมื่อกดปุ่ม
                className="text-red-500"
            >
                Logout
            </Button>
        </div>
    );
}

export default SettingPage;
