// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { EUserRole } from "./user.interface";

declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            role: EUserRole;
            avatar:string
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        role: EUserRole;
        _id: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string;
        role: EUserRole;
    }
}