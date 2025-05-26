import NextAuth, { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { permission } from "process";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            credentials: {
                email: { type: "email", label: "Email", placeholder: "johndoe@gmail.com" },
                password: { type: "password", label: "Password", placeholder: "*****" },
                token: { type: "text" }, // เพิ่มสำหรับ 2FA
                user: { type: "text" },  // เพิ่มสำหรับ 2FA
                permission: { type: "number" },
            },
            authorize: async (credentials: any) => {
                const { email, password, token, user } = credentials;

                try {

                    if (email && password && !token) {
                        const res = await fetch("http://localhost:3000/auth/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email, password }),
                        });

                        const data = await res.json();

                        if (!res.ok) throw new Error(data.message || 'Login failed');

                        if (data.status === '2FA_REQUIRED') {
                            throw new Error(JSON.stringify({
                                twoFA: true,
                                twoFA_token: data.twofa_token,
                                user_id: data.user_id
                            }));
                        }

                        if (data.status === 'LOGIN_2FA_SUCCESSFUL' || data.status === 'LOGIN_NORMAL_SUCCESSFUL') {
                            return data.user;
                        }

                        return null;
                    }

                    // กรณี login หลังผ่าน 2FA แล้ว (ใช้ token + user)
                    if (token && user) {
                        const parsedUser = typeof user === 'string' ? JSON.parse(user) : user;
                        return parsedUser;
                    }

                    return null;
                } catch (err) {

                    throw err;

                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
        error: "/error",
        verifyRequest: "/verify",
    },
    session: {
        strategy: "jwt"
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as any;
            return session;
        }
    }
}
