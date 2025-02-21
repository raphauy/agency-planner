import * as z from "zod"
import { prisma } from "@/lib/db"
import { AudienceDAO } from "./audience-services"

export type EmailContactDAO = {
	id: string
	name: string | undefined
	email: string
	unsubscribed: boolean
	createdAt: Date
	updatedAt: Date
	audience: AudienceDAO
	audienceId: string
}

export const EmailContactSchema = z.object({
	name: z.string().optional(),
	email: z.string().min(1, "email is required."),
	unsubscribed: z.boolean(),
	audienceId: z.string().min(1, "audienceId is required."),
})

export type EmailContactFormValues = z.infer<typeof EmailContactSchema>


export async function getEmailContactsDAO(audienceId: string) {
  const found = await prisma.emailContact.findMany({
    where: {
      audienceId
    },
    orderBy: {
      id: 'asc'
    }
  })
  return found as EmailContactDAO[]
}

export async function getEmailContactDAO(id: string) {
  const found = await prisma.emailContact.findUnique({
    where: {
      id
    },
  })
  return found as EmailContactDAO
}


    
export async function createEmailContact(data: EmailContactFormValues) {
  // TODO: implement createEmailContact
  const created = await prisma.emailContact.create({
    data
  })
  return created
}

export async function updateEmailContact(id: string, data: EmailContactFormValues) {
  const updated = await prisma.emailContact.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteEmailContact(id: string) {
  const deleted = await prisma.emailContact.delete({
    where: {
      id
    },
  })
  return deleted
}

export type SimpleEmailContactDAO= {
  id: string
  name: string | undefined
  email: string
}

export async function getAudienceContactsDAO(audienceId: string): Promise<SimpleEmailContactDAO[]>{
  const found= await prisma.emailContact.findMany({
    where: {
      audienceId
    }
  })
  return found as SimpleEmailContactDAO[]
}