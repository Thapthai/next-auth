"use server";

import { signOut } from "next-auth/react";

export const logout = async () => {
    await signOut({ callbackUrl: "/login" }); // หลัง logout ให้ redirect ไปหน้า login
};


