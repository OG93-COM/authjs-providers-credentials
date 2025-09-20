import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";

const edgeAuthConfig = {
  providers: [
    Github, // only providers that don’t need prisma
  ],
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;

export default edgeAuthConfig;
