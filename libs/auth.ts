import NextAuth from "next-auth";
import { prisma } from "./prismadb";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  pages: {
    signIn: "/login",
  },

  secret: process.env.AUTH_SECRET as string,
  session: { strategy: "jwt" },
});
