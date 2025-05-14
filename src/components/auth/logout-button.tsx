'use client';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export const logout = async () => {
    await signOut({ callbackUrl: "/login" }); // หลัง logout ให้ redirect ไปหน้า login
};

export default function LogoutButton() {
    return (
        <DropdownMenuItem
            onClick={() => logout()}
            className="text-red-500"
        >
            Logout
        </DropdownMenuItem>
    );
}
