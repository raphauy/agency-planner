"use server"

import { sendContactOnLandingEmail } from "@/services/email-services"

export async function sendMessageAction(email: string, message: string) {
  
  await sendContactOnLandingEmail(email, message)

  return true
}