import * as z from "zod"
import { prisma } from "@/lib/db"
import { getClientDAO, getClientDAOBySlugs } from "./client-services"

export type PilarDAO = {
	id: string
	name: string
	description: string | undefined
	color: string
	clientId: string
}

export const pilarSchema = z.object({
	name: z.string({required_error: "name is required."}),
	description: z.string().optional(),
	color: z.string({required_error: "color is required."}),
  agencySlug: z.string({required_error: "agencySlug is required."}),
	clientSlug: z.string({required_error: "clientSlug is required."}),
})

export type PilarFormValues = z.infer<typeof pilarSchema>


export async function getPilarsDAO() {
  const found = await prisma.pilar.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as PilarDAO[]
}

export async function getPilarsDAOBySlugs(agencySlug: string, clientSlug: string) {
  const client= await getClientDAOBySlugs(agencySlug, clientSlug)
  const found = await prisma.pilar.findMany({
    where: {
      clientId: client.id
    },
    orderBy: {
      id: 'asc'
    },
  })
  return found as PilarDAO[]

}

export async function getPilarDAO(id: string) {
  const found = await prisma.pilar.findUnique({
    where: {
      id
    },
  })
  return found as PilarDAO
}
    
export async function createPilar(data: PilarFormValues) {
  const client= await getClientDAOBySlugs(data.agencySlug, data.clientSlug)
  const created = await prisma.pilar.create({
    data: {      
      clientId: client.id,
      name: data.name,  
      description: data.description,
      color: data.color,      
    }
  })
  return created
}

export async function updatePilar(id: string, data: PilarFormValues) {
  const client= await getClientDAOBySlugs(data.agencySlug, data.clientSlug)
  const updated = await prisma.pilar.update({
    where: {
      id
    },
    data: {
      clientId: client.id,
      name: data.name,  
      description: data.description,
      color: data.color,      
    }
  })
  return updated
}

export async function deletePilar(id: string) {
  const deleted = await prisma.pilar.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullPilarsDAO() {
  const found = await prisma.pilar.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
		}
  })
  return found as PilarDAO[]
}
  
export async function getFullPilarDAO(id: string) {
  const found = await prisma.pilar.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as PilarDAO
}
    