import NextAuth from "next-auth";
import { prisma } from "./prismadb";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,

  callbacks:{
    async jwt({ token, user }) {
      // When user signs in for the first time
      

      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image
      }
      return token;
    },

    async session({ session, token }) {
      // Expose token fields to session

      const userFromMongo = await prisma.user.findUnique({
        where: { id: token.sub },
      });
      console.log("User From Mongoo DB 🔥🔥🔥🔥🔥🔥🔥", userFromMongo)
      
      if (token) {
        session.user = {
          id: token.sub as string,
          email: token.email as string,
          name: token.name as string,
          image: userFromMongo?.image as string,
        }as any;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET as string,
  session: { strategy: "jwt" },
});
