'use client';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export const logout = async () => {
    await signOut({ callbackUrl: "/login" }); // หลัง logout ให้ redirect ไปหน้า login
};

export default function LogoutButton() {
    const t = useTranslations("SiteHeader");

    return (
        <DropdownMenuItem
            onClick={() => logout()}
            className="text-red-500"
        >
            {t('logoutButton')}
        </DropdownMenuItem>
    );
}
