import * as z from "zod"
import { prisma } from "@/lib/db"
import { UserDAO } from "./user-services"
import { AgencyDAO } from "./agency-services"
import { getUsersDAO } from "./user-services"
import { getCurrentAgencyId, getCurrentAgencySlug, getCurrentUser } from "@/lib/utils"
import { FunctionalityDAO } from "./functionality-services"
import { BillableItemFormValues, createBillableItem } from "./billableitem-services"
import { PilarDAO } from "./pilar-services"

export type ClientDAO = {
	id: string
	name: string
	slug: string
	image: string | undefined
	description: string | undefined
	igHandle: string | undefined
	brandVoice: string | undefined
	createdAt: Date
	updatedAt: Date
	users: UserDAO[]
	agency: AgencyDAO
  functionalities: FunctionalityDAO[]
  pilars: PilarDAO[]
	agencyId: string
}

export const clientSchema = z.object({
	name: z.string({required_error: "name is required."}),
	slug: z.string({required_error: "slug is required."}),
	image: z.string().optional(),
	description: z.string().optional(),
	igHandle: z.string().optional(),
	brandVoice: z.string().optional(),
	agencyId: z.string({required_error: "agencyId is required."}),
})

export type ClientFormValues = z.infer<typeof clientSchema>


export async function getClientsDAO() {
  const found = await prisma.client.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as ClientDAO[]
}


export async function getClientsDAOByAgencyId(agencyId: string) {
  const found = await prisma.client.findMany({
    where: {
      agencyId,
    },
    orderBy: {
      id: 'asc'
    },
    include: {
      users: true,
      agency: true,
      functionalities: true,
    }
  })
  return found as ClientDAO[]
}

export async function getClientsDAOByAgencySlug(agencySlug: string) {

  const agencyId= await prisma.agency.findUnique({
    where: {
      slug: agencySlug
    },
  })
  .then(res => res?.id)

  return getClientsDAOByAgencyId(agencyId as string)
}

export async function getClientDAO(id: string) {
  const found = await prisma.client.findUnique({
    where: {
      id
    },
  })
  return found as ClientDAO
}

export async function getClientDAOBySlug(slug: string) {
  const found = await prisma.client.findUnique({
    where: {
      slug
    },
    include: {
      pilars: true,
    }
  })
  return found as ClientDAO

}
    
export async function createClient(data: ClientFormValues) {
  const created = await prisma.client.create({
    data
  })
  const agencyId= data.agencyId
  // link the client to all AGENCY_ADMIN users of agency with agencyId and the AGENCY_OWNER user of the agency with agencyId
  const allUsers= await getUsersDAO()
  const agencyAdminUsers= allUsers.filter(c => c.role === 'AGENCY_ADMIN' && c.agencyId === agencyId)
  const agencyOwner= allUsers.find(c => c.role === 'AGENCY_OWNER' && c.agencyId === agencyId)
  if (agencyOwner) {
    agencyAdminUsers.push(agencyOwner)
  }
  console.log(`connecting ${agencyAdminUsers.length} users to the client ${created.name}`)

  await setUsers(created.id, agencyAdminUsers)

  return created
}

export async function updateClient(id: string, data: ClientFormValues) {
  const updated = await prisma.client.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteClient(id: string) {
  const deleted = await prisma.client.delete({
    where: {
      id
    },
  })
  return deleted
}
    
export async function getComplentaryUsers(id: string) {
  const found = await prisma.client.findUnique({
    where: {
      id
    },
    include: {
      users: true,
    }
  })
  const all= await getUsersDAO()
  const res= all.filter(aux => {
    return !found?.users.find(c => c.id === aux.id)
  })
  
  return res
}

export async function setUsers(id: string, users: UserDAO[]) {
  const oldUsers= await prisma.client.findUnique({
    where: {
      id
    },
    include: {
      users: true,
    }
  })
  .then(res => res?.users)

  await prisma.client.update({
    where: {
      id
    },
    data: {
      users: {
        disconnect: oldUsers
      }
    }
  })

  const updated= await prisma.client.update({
    where: {
      id
    },
    data: {
      users: {
        connect: users.map(c => ({id: c.id}))
      }
    }
  })

  if (!updated) {
    return false
  }

  return true
}



export async function getFullClientsDAO() {
  const found = await prisma.client.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			users: true,
			agency: true,
		}
  })
  return found as ClientDAO[]
}
  
export async function getFullClientDAO(id: string) {
  const found = await prisma.client.findUnique({
    where: {
      id
    },
    include: {
			users: true,
			agency: true,
		}
  })
  return found as ClientDAO
}

export async function getClientsOfUser(userId: string) {
  const found = await prisma.client.findMany({
    where: {
      users: {
        some: {
          id: userId
        }
      }
    },
    include: {
      agency: true,
      users: true,
    }
  })

  return found as ClientDAO[]
}

export async function getClientsOfCurrentUser() {
  const currentUser= await getCurrentUser()
  if (!currentUser?.id) return []

  return getClientsOfUser(currentUser.id)
}