import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./validationSchema";
import * as bcrypt from "bcrypt";
import { prisma } from "./prismadb";

export default {
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    }),
    // Login with password credentials
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validation = loginSchema.safeParse(credentials);
        if (!validation.success) return null;

        const { email, password } = validation.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        console.log(user.name , " Connected");

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) return user;

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
