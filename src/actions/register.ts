"use server"

import * as z from "zod";
import { RegisterSchema } from '@/schemas';
import { redirect } from "next/navigation"; // ✅ import redirect

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);


    if (!validatedFields.success) return { error: "Invalid fields! " };

    const { name, email, password } = validatedFields.data;

    const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
        const error = await res.json();
        if (error.message === 'email unique') {
            return { error: "Email นี้มีผู้ใช้งานแล้ว" };
        }
    }

    redirect("/verify-email-pending");
    return { success: "Registration successful!" };

}
