import * as z from "zod"
import { prisma } from "@/lib/db"
import { UserRole } from "@prisma/client"
import { getCurrentUser } from "@/lib/utils"

export type UserDAO = {
	id: string
	name: string | undefined
	email: string
	emailVerified: Date | undefined
	image: string | undefined
	role: UserRole
  agencyId: string | undefined
  agencyName: string | undefined
	createdAt: Date
	updatedAt: Date
}

export const userSchema = z.object({
	name: z.string().optional(),
	email: z.string({required_error: "email is required."}),
  role: z.nativeEnum(UserRole),
	image: z.string().optional(),
  agencyId: z.string().optional(),
})

export type UserFormValues = z.infer<typeof userSchema>


export async function getUsersDAO() {
  const found = await prisma.user.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as UserDAO[]
}

export async function getUserDAO(id: string) {
  const found = await prisma.user.findUnique({
    where: {
      id
    },
  })
  return found as UserDAO
}
    
export async function createUser(data: UserFormValues) {
  const created = await prisma.user.create({
    data
  })
  return created
}

export async function updateUser(id: string, data: UserFormValues) {
  const updated = await prisma.user.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteUser(id: string) {
  const deleted = await prisma.user.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullUsersDAO() {
  const found = await prisma.user.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      agency: true,
      clients: true
		}
  })

  const res= found.map((user) => {
    return {
      ...user,
      agencyName: user.agency?.name
    }
  })

  return res as UserDAO[]
}
  
export async function getFullUserDAO(id: string) {
  const found = await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      agency: true,
      clients: true
    }
  })
  const res= {
    ...found,
    agencyName: found?.agency?.name
  }
  return res as UserDAO
}


export async function getUsersOfAgency(agencyId: string) {
  const found = await prisma.user.findMany({
    where: {
      agencyId,
      role: {
        in: ["AGENCY_OWNER", "AGENCY_ADMIN", "AGENCY_CREATOR"]
      }
    },
    orderBy: {
      id: 'asc'
    },
    include: {
      agency: true
    }
  })

  const res= found.map((user) => {
    return {
      ...user,
      agencyName: user.agency?.name
    }
  })

  return res as UserDAO[]
}

export async function getFullUsersOfAgency(agencyId: string) {
  const found = await prisma.user.findMany({
    where: {
      agencyId
    },
    orderBy: {
      id: 'asc'
    },
    include: {
      agency: true,
      clients: true
    }
  })

  const res= found.map((user) => {
    return {
      ...user,
      agencyName: user.agency?.name
    }
  })

  return res as UserDAO[]
}

export async function changeClientUserPermission(userId: string, clientId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      clients: true
    }
  })

  if (!user) {
    throw new Error("User not found")
  }

  if (user.role === "AGENCY_OWNER") {
    const currentUser= await getCurrentUser()
    const currentUserId = currentUser?.id
    if (userId !== currentUserId && currentUser?.role !== "ADMIN") {
      throw new Error("Solo el Agency Owner puede cambiar sus propios permisos")
    }
  }

  const hasClient = user.clients.some((client) => client.id === clientId)

  if (hasClient) {
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        clients: {
          disconnect: {
            id: clientId
          }
        }
      }
    })
  } else {
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        clients: {
          connect: {
            id: clientId
          }
        }
      }
    })
  }

  return true
}