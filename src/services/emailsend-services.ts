import * as z from "zod"
import { prisma } from "@/lib/db"
import { NewsletterDAO } from "./newsletter-services"
import { EmailSendStatus } from "@prisma/client"

export type EmailSendDAO = {
	id: string
	status: EmailSendStatus
	name: string | null
	to: string
	subject: string
	resendId: string | null
	createdAt: Date
	sentAt: Date | undefined
	newsletter: NewsletterDAO
	newsletterId: string
}

export const EmailSendSchema = z.object({
	status: z.nativeEnum(EmailSendStatus),
	name: z.string().optional(),
	to: z.string().min(1, "to is required."),
	subject: z.string().min(1, "subject is required."),
	newsletterId: z.string().min(1, "newsletterId is required."),
})

export type EmailSendFormValues = z.infer<typeof EmailSendSchema>


export async function getEmailSendsDAO(newsletterId: string) {
  const found = await prisma.emailSend.findMany({
    where: {
      newsletterId
    },
    orderBy: {
      sentAt: 'desc'
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

export async function setResendId(id: string, resendId: string) {
  const sentAt= new Date()
  const updated = await prisma.emailSend.update({
    where: {
      id
    },
    data: {
      resendId,
      sentAt
    }
  })
  return updated
}

export async function setEmailSendStatus(id: string, resendStatus: string) {
  const status= mapStatus(resendStatus)
  if (!status) {
    console.error("Invalid status: ", resendStatus)
    throw new Error("Invalid status: " + resendStatus)
  }
  const updated = await prisma.emailSend.update({
    where: {
      id
    },
    data: {
      status
    }
  })
  return updated
}

export async function getPendingEmailSendsDAO(newsletterId: string, max: number) {
  const found = await prisma.emailSend.findMany({
    where: {
      newsletterId,
      status: "PENDING"
    },
    take: max
  })
  return found as EmailSendDAO[]
}

export async function getNewsletterIdsWithPendingEmailsends() {
  const results = await prisma.$queryRaw`SELECT DISTINCT "newsletterId" FROM "EmailSend" WHERE status = 'PENDING'` as { newsletterId: string }[]
  return results.map(result => result.newsletterId)
}

function mapStatus(resendStatus: string): EmailSendStatus | null {
  if (resendStatus === "sent") {
    return "SENT"
  }
  if (resendStatus === "delivered") {
    return "DELIVERED"
  }
  if (resendStatus === "delivery_delayed") {
    return "DELIVERED_DELAYED"
  }
  if (resendStatus === "complained") {
    return "COMPLAINED"
  }
  if (resendStatus === "bounced") {
    return "BOUNCED"
  }
  return null
}

export async function getSentEmailSend(take: number) {
  const found = await prisma.emailSend.findMany({
    where: {
      status: "SENT"
    },
    take
  })
  return found as EmailSendDAO[]
}

export async function getPendingEmailSendsCount(newsletterId: string) {
  const count = await prisma.emailSend.count({
    where: {
      newsletterId,
      status: "PENDING"
    }
  })
  return count
}