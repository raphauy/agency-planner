"use server";

import { signIn } from "@/lib/auth";
import { sendCodeEmail } from "@/lib/mail";
import { LoginSchema, createOTPConfirmation, deleteOTPConfirmation, generateOTPCode, getOTPCodeByEmail, getOTPConfirmationByUserId, getUserByEmail, setUserAsVerified } from "@/services/login-services";
import { AuthError } from "next-auth";
import * as z from "zod";


export async function loginAction(values: z.infer<typeof LoginSchema>, callbackUrl?: string) {
  
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    return { error: "Email does not exist!" }
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
      await sendCodeEmail(
        oTPCode.email,
        oTPCode.code,
      );

      return { code: true, success: "Te enviamos un código de acceso!" };
    }
  }

  try {
    console.log("credentials", { email, code });
    
    const ok= await signIn("credentials", {
      email,
      code
    })

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
