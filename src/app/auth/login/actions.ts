"use server";

import { signIn } from "@/lib/auth";
import { sendCodeEmail } from "@/services/email-services";
import { LoginSchema, createOTPConfirmation, deleteOTPConfirmation, generateOTPCode, getOTPCodeByEmail, getOTPConfirmationByUserId, getUserByEmail, setUserAsVerified } from "@/services/login-services";
import { AuthError } from "next-auth";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import * as z from "zod";


export async function loginAction(values: z.infer<typeof LoginSchema>, callbackUrl?: string) {
  
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    return { error: "No existe un usuario con este email!" };
  }

  if (existingUser.email) {
    if (code) {
      const oTPCode = await getOTPCodeByEmail(existingUser.email)

      if (!oTPCode) {
        return { error: "Código no encontrado!" }
      }

      if (oTPCode.code !== code) {
        return { error: "Código equivocado!" }
      }

      const hasExpired = new Date(oTPCode.expires) < new Date()

      if (hasExpired) {
        return { error: "Código expirado!" }
      }

      await setUserAsVerified(existingUser.id)

      // await deleteOTPCode(oTPCode.id)

      const existingConfirmation = await getOTPConfirmationByUserId(existingUser.id)

      if (existingConfirmation) {
        await deleteOTPConfirmation(existingConfirmation.id)
      }

      await createOTPConfirmation(existingUser.id)
    } else {
      const oTPCode = await generateOTPCode(existingUser.email)
      const isProduction= process.env.NODE_ENV === "production"
      if (isProduction) {
        await sendCodeEmail(existingUser.agencyId, oTPCode.email, oTPCode.code)
      } else {
        console.log("email", oTPCode.email)        
        console.log("code", oTPCode.code)
      }

      return { code: true, success: "Te enviamos un código de acceso!" };
    }
  }

  try {
    console.log("credentials", { email, code });
    
    const ok= await signIn("credentials", {
      email,
      code,
      redirect: false
    })

    if (ok && !ok.error) {
      console.log("user logged in")      
    } else {
      return { error: ok?.error || "Algo salió mal!" };
    }

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas!" }
        default:
          return { error: "Algo salió mal!" }
      }
    }

    throw error;
  }
};
