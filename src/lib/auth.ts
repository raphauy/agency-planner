import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import { prisma as db } from "@/lib/db";
import { deleteOTPConfirmation, getOTPConfirmationByUserId, getUserById } from "@/services/login-services";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id as string);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      const oTPConfirmation = await getOTPConfirmationByUserId(user.id as string);

      if (!oTPConfirmation) return false;

      // Delete two factor confirmation for next sign in
      await deleteOTPConfirmation(oTPConfirmation.id);

      return true;
    },
    async session({ token, session }) {
      //console.log("session token", token);
      
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }


      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email as string
        session.user.agencyId = token.agencyId as string
        session.user.agencySlug = token.agencySlug as string
        session.user.agencyName = token.agencyName as string        
      }

      return session;
    },
    async jwt({ token }) {
      
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      

      if (!existingUser) return token;

      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      token.agencyId = existingUser.agencyId
      token.agencySlug= existingUser.agency?.slug
      token.agencyName= existingUser.agency?.name

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
