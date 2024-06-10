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

export async function getUsersOfClient(clientId: string) {
  const found = await prisma.user.findMany({
    where: {
      clients: {
        some: {
          id: clientId
        }
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

export async function inviteUser(data: UserFormValues, clientId: string) {
  // check if user already exists, if not create it
  let user= await prisma.user.findUnique({
    where: {
      email: data.email
    }
  })

  if (!user) {
    user= await createUser(data)    
    if (!user) {
      throw new Error("Error al crear el usuario")
    }  
  } else {
    if (user.role !== "CLIENT_ADMIN" && user.role !== "CLIENT_USER") {
      throw new Error("El usuario a invitar debe tener el rol de cliente")
    }
  }


  const client= await prisma.client.findUnique({
    where: {
      id: clientId
    },
    include: {
      users: true
    }
  })

  if (!client) {
    throw new Error("El cliente no existe")    
  }

  // check if user is already in the client
  const hasUser= client.users.some((u) => u.id === user.id)

  if (!hasUser) {
    await prisma.client.update({
      where: {
        id: clientId
      },
      data: {
        users: {
          connect: {
            id: user.id
          }
        }
      }
    })
  }

  await prisma.invitation.create({
    data: {
      clientId,
      userId: user.id,
      status: "PENDING"
    }
  })

  return true
}

export async function getUsersOfClientWithPendingInvitations(clientId: string) {
  const users= await prisma.user.findMany({
    where: {
      invitations: {
        some: {
          clientId,
          status: "PENDING"
        }
      }
    },
  })

  return users as UserDAO[]
}