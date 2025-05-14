
import { error } from "console";
import NextAuth, { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            credentials: {
                email: { type: "email", label: "Email", placeholder: "johndoe@gmail.com" },
                password: { type: "password", label: "Password", placeholder: "*****" },
            },
            authorize: async (credentials: any) => {
                const { email, password } = credentials;
                if (!email || !password) return null;

                try {
                    const res = await fetch("http://localhost:3000/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password })
                    });

                    const data = await res.json();

                    if (!res.ok) throw new Error(data.message || 'Login failed');

                    return data;

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
            if (user) token.user = user;
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as any;
            return session;
        }
    }
}
