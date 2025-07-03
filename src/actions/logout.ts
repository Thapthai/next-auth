"use server";

import { signOut } from "next-auth/react";

export const logout = async () => {
    await signOut({ callbackUrl: "http://10.11.9.43:3005/login" }); // หลัง logout ให้ redirect ไปหน้า login
};


