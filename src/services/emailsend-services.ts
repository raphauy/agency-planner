import * as z from "zod"
import { prisma } from "@/lib/db"
import { NewsletterDAO } from "./newsletter-services"
import { EmailSendStatus } from "@prisma/client"

export type EmailSendDAO = {
	id: string
	status: EmailSendStatus
	to: string
	subject: string
	createdAt: Date
	sentAt: Date | undefined
	newsletter: NewsletterDAO
	newsletterId: string
}

export const EmailSendSchema = z.object({
	status: z.nativeEnum(EmailSendStatus),
	to: z.string().min(1, "to is required."),
	subject: z.string().min(1, "subject is required."),
	newsletterId: z.string().min(1, "newsletterId is required."),
})

export type EmailSendFormValues = z.infer<typeof EmailSendSchema>


export async function getEmailSendsDAO() {
  const found = await prisma.emailSend.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as EmailSendDAO[]
}

export async function getEmailSendDAO(id: string) {
  const found = await prisma.emailSend.findUnique({
    where: {
      id
    },
  })
  return found as EmailSendDAO
}


    
export async function createEmailSend(data: EmailSendFormValues) {
  // TODO: implement createEmailSend
  const created = await prisma.emailSend.create({
    data
  })
  return created
}

export async function updateEmailSend(id: string, data: EmailSendFormValues) {
  const updated = await prisma.emailSend.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteEmailSend(id: string) {
  const deleted = await prisma.emailSend.delete({
    where: {
      id
    },
  })
  return deleted
}

