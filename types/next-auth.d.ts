// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { EUserRole } from "./user.interface";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: EUserRole;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        role: EUserRole;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: EUserRole;
    }
}