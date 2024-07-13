import { prisma } from "@/lib/db"
import * as z from "zod"
import { UserDAO } from "./user-services"

export type AgencyDAO = {
	id: string
	name: string
  slug: string
	image: string | undefined
	igHandle: string | undefined
  description: string | undefined
	emailFrom: string | undefined
	contactEmail: string | undefined
  domain: string | undefined
  storageCloudName: string | undefined
  storageApiKey: string | undefined
  storageApiSecret: string | undefined
	ownerId: string | undefined
  owner: UserDAO | undefined
	createdAt: Date
	updatedAt: Date
}

export const agencySchema = z.object({
	name: z.string({required_error: "name is required."}),
  slug: z.string({required_error: "slug is required."}),
	image: z.string().optional(),
	igHandle: z.string().optional(),
  description: z.string().optional(),
  emailFrom: z.string().optional(),
	contactEmail: z.string().optional(),
  domain: z.string().optional(),
  storageCloudName: z.string().optional(),
  storageApiKey: z.string().optional(),
  storageApiSecret: z.string().optional(),
})

export type AgencyFormValues = z.infer<typeof agencySchema>


export async function getAgencysDAO() {
  const found = await prisma.agency.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as AgencyDAO[]
}

export async function getAgencyDAO(id: string) {
  const found = await prisma.agency.findUnique({
    where: {
      id
    },
  })
  return found as AgencyDAO
}

export async function getAgencyDAOBySlug(slug: string) {
  const found = await prisma.agency.findUnique({
    where: {
      slug
    },
  })
  return found as AgencyDAO
}
    
export async function createAgency(data: AgencyFormValues) {
  // TODO: implement createAgency
  const created = await prisma.agency.create({
    data
  })
  return created
}

export async function updateAgency(id: string, data: AgencyFormValues) {
  const updated = await prisma.agency.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteAgency(id: string) {
  const deleted = await prisma.agency.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullAgencysDAO() {
  const found = await prisma.agency.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      owner: true
		}
  })
  return found as AgencyDAO[]
}
  
export async function getFullAgencyDAO(id: string) {
  const found = await prisma.agency.findUnique({
    where: {
      id
    },
    include: {
      owner: true
		}
  })
  return found as AgencyDAO
}
    

export async function setOwner(agencyId: string, userId: string) {
  const updated = await prisma.agency.update({
    where: {
      id: agencyId
    },
    data: {
      ownerId: userId
    }
  })
  return updated
}

export async function getAgencyOfPublication(publicationId: string) {
  const found = await prisma.agency.findFirst({
    where: {
      clients: {
        some: {
          publications: {
            some: {
              id: publicationId
            }
          }
        }
      }
    },
  })
  return found as AgencyDAO
}

