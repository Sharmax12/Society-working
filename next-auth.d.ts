import { Role } from "@prisma/client";
import { type DefaultSession } from "next-auth"


export type ExtendedUser = DefaultSession["user"] & {
    id?: string;
    role: Role;
}

declare module "next-auth"{
    interface Session{
        user:ExtendedUser
    }
}

declare module "next-auth/jwt"{
    interface JWT{
        role:Role;
        authVersion?: number;
    }
}