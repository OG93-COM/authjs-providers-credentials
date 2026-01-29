import NextAuth from "next-auth";
import { prisma } from "./prismadb";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({

  // Update user before signup for email verification
  events:{
    async linkAccount({user}){
      await prisma.user.update({
        where: {id: user.id},
        data: {emailVerified: new Date()}
      })
    }
  },
  adapter: PrismaAdapter(prisma),
  ...authConfig,

  callbacks:{
      //It not necessary to use JWT //It not necessary to use JWT //It not necessary to use JWT 
      async jwt({ token, user }) {
        // When user signs in for the first time
        if (user) {
          token.sub = user.id;
          token.email = user.email;
          token.name = user.name;
          token.picture = user.image;
        }
        return token;
      },
      //It not necessary to use JWT //It not necessary to use JWT //It not necessary to use JWT

      // used to block signin where user with credential have email not verified
      async signIn( {user, account} ) {
        // Give access for provider without credentials
        if(account?.provider !== "credentials") return true;

        const userFromDb =  await prisma.user.findUnique({where : {id : user.id}})
        if(!userFromDb?.emailVerified) {
          return false;
        } else {
          return true;
        }
      },

    async session({ session, token }) {
      // Expose token fields to session

      if(session.user && token.sub) {
        session.user.id = token.sub
        const userFromDb = await prisma.user.findUnique({
          where: { id: token.sub },
        });

          if (userFromDb) {
            session.user = {
              id: token.sub as string,
              email: token.email as string,
              name: token.name as string,
              image: userFromDb?.image as string,
              role: userFromDb?.role as string,
              enabledTowStep: userFromDb?.enabledTowStep as boolean,
            } as any;
          }
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
