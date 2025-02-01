import * as z from "zod"
import { prisma } from "@/lib/db"
import { ClientDAO } from "./client-services"

export type AudienceDAO = {
	id: string
	name: string
	createdAt: Date
	updatedAt: Date
	clientId: string
}

export const AudienceSchema = z.object({
	name: z.string().min(1, "name is required."),
	clientId: z.string().min(1, "clientId is required."),
})

export type AudienceFormValues = z.infer<typeof AudienceSchema>


export async function getAudiencesDAO(clientId: string) {
  const found = await prisma.audience.findMany({
    where: {
      clientId
    },
    orderBy: {
      id: 'asc'
    },
  })
  return found as AudienceDAO[]
}

export async function getAudienceDAO(id: string) {
  const found = await prisma.audience.findUnique({
    where: {
      id
    },
  })
  return found as AudienceDAO
}


    
export async function createAudience(data: AudienceFormValues) {
  // TODO: implement createAudience
  const created = await prisma.audience.create({
    data
  })
  return created
}

export async function updateAudience(id: string, data: AudienceFormValues) {
  const updated = await prisma.audience.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteAudience(id: string) {
  const deleted = await prisma.audience.delete({
    where: {
      id
    },
  })
  return deleted
}

