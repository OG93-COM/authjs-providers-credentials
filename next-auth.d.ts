// I Create this file for declaration the type of session.user.role 🔥🔥🔥🔥🔥🔥🔥
// I Create this file for declaration the type of session.user.role 🔥🔥🔥🔥🔥🔥🔥

import NextAuth, {type DefaultSession} from "next-auth";
import { User, Role } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {role : Role}
    }
}