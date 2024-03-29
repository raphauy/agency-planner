import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { LoginSchema, deleteOTPCode, getOTPCodeByEmail, getUserByEmail } from "@/services/login-services";


export default {
  //trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {

        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, code } = validatedFields.data;
          
          const user = await getUserByEmail(email);
          
          if (!user || !user.email) return null;

          const oTPCode = await getOTPCodeByEmail(user.email)

          if (!oTPCode) {
            return null
          }
    
          if (oTPCode.code !== code) {
            return null
          }

          await deleteOTPCode(oTPCode.id)

          console.log("authorize user", user);
          
          return user;
        }

        return null;
      }
    })
  ],
} satisfies NextAuthConfig