import * as z from "zod"
import { prisma } from "@/lib/db"
import { UserRole } from "@prisma/client"
import { UserDAO } from "./user-services"
import { ClientDAO } from "./client-services"

export type PermissionsDAO = {
  userId: string
  userName: string | undefined
  userEmail: string
  userImage: string | undefined
  userRole: UserRole
  agencyId: string | undefined
  clients: ClientDAO[]  
}

export async function getPermissionsOfUser(userId: string): Promise<PermissionsDAO> {
  const found= await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      clients: true
    }
  })

  if (!found) {
    throw new Error("User not found")
  }

  const permisions= {
    userId: found.id,
    userName: found.name,
    userEmail: found.email,
    userImage: found.image,
    userRole: found.role,    
    agencyId: found.agencyId,
    clients: found?.clients
  }

  return permisions as PermissionsDAO
}

export async function getPermissionsOfAgency(agencyId: string): Promise<PermissionsDAO[]> {
  const found= await prisma.user.findMany({
    where: {
      agencyId
    },
    include: {
      clients: true
    }
  })

  if (!found) {
    throw new Error("Agency not found")
  }

  const res= found.map((user) => {
    return {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
      userRole: user.role,
      agencyId: user.agencyId,
      clients: user.clients
    }
  })

  return res as PermissionsDAO[]
}

