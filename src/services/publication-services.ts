import * as z from "zod"
import { prisma } from "@/lib/db"
import { PublicationStatus, PublicationType } from "@prisma/client"
import { ClientDAO } from "./client-services"
import { PilarDAO } from "./pilar-services"

export type PublicationDAO = {
	id: string
	type: PublicationType
	status: PublicationStatus
	title: string
	images: string | undefined
	hashtags: string | undefined
	copy: string | undefined
	publicationDate: Date | null
	createdAt: Date
	updatedAt: Date
	clientId: string
  client: ClientDAO
	pilarId: string | undefined
  pilar: PilarDAO | undefined
}

export const publicationSchema = z.object({	
	title: z.string().min(1, "El título es obligatorio."),
  type: z.nativeEnum(PublicationType),
  status: z.nativeEnum(PublicationStatus),
	images: z.string().optional(),
	hashtags: z.string().optional(),
	copy: z.string().optional(),
  publicationDate: z.date().optional().nullable(),
	link: z.string().optional(),
	clientId: z.string({required_error: "clientId is required."}),
	pilarId: z.string().optional(),
})

export type PublicationFormValues = z.infer<typeof publicationSchema>


export async function getPublicationsDAO() {
  const found = await prisma.publication.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as PublicationDAO[]
}

export async function getPublicationsDAOByClientSlug(clientSlug: string) {
  const found = await prisma.publication.findMany({
    where: {
      client: {
        slug: clientSlug
      }
    },
    orderBy: {
      publicationDate: 'desc'
    },

  })
  return found as PublicationDAO[]
}

export async function getPublicationDAO(id: string) {
  const found = await prisma.publication.findUnique({
    where: {
      id
    },
    include: {
      client: true,
      pilar: true
    }
  })
  return found as PublicationDAO
}
    
export async function createPublication(data: PublicationFormValues) {
  const created = await prisma.publication.create({
    data
  })
  return created
}

export async function updatePublication(id: string, data: PublicationFormValues) {
  const updated = await prisma.publication.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deletePublication(id: string) {
  const deleted = await prisma.publication.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullPublicationsDAO() {
  const found = await prisma.publication.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {      
		}
  })
  return found as PublicationDAO[]
}
  
export async function getFullPublicationDAO(id: string) {
  const found = await prisma.publication.findUnique({
    where: {
      id
    },
    include: {
      client: true
		}
  })
  
  return found as PublicationDAO
}
    