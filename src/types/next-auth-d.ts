import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            access_token?: string;
            permission?: number;
        } & DefaultSession["user"];
    }
}