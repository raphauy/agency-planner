import * as z from "zod"
import { prisma } from "@/lib/db"
import { ClientDAO } from "./client-services"

export type DomainDAO = {
	id: string
	name: string
	createdAt: Date
	updatedAt: Date
	client: ClientDAO
	clientId: string
}

export const DomainSchema = z.object({
	name: z.string().min(1, "name is required."),
	clientId: z.string().min(1, "clientId is required."),
})

export type DomainFormValues = z.infer<typeof DomainSchema>


export async function getDomainsDAO(clientId: string) {
  const found = await prisma.domain.findMany({
    where: {
      clientId: clientId
    },
    orderBy: {
      id: 'asc'
    },
  })
  return found as DomainDAO[]
}

export async function getDomainDAO(id: string) {
  const found = await prisma.domain.findUnique({
    where: {
      id
    },
  })
  return found as DomainDAO
}


    
export async function createDomain(data: DomainFormValues) {
  // TODO: implement createDomain
  const created = await prisma.domain.create({
    data
  })
  return created
}

export async function updateDomain(id: string, data: DomainFormValues) {
  const updated = await prisma.domain.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteDomain(id: string) {
  const deleted = await prisma.domain.delete({
    where: {
      id
    },
  })
  return deleted
}

