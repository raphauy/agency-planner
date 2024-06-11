import * as z from "zod"
import { prisma } from "@/lib/db"
import { InvitationStatus } from "@prisma/client"

export type InvitationDAO = {
	id: string
  status: InvitationStatus
	createdAt: Date
	updatedAt: Date
	userId: string
	clientId: string | null
  clientName: string | undefined
	agencyId: string | null
  agencyName: string | undefined
}

export const invitationSchema = z.object({
	userId: z.string().min(1, "userId is required."),
	clientId: z.string().optional(),
	agencyId: z.string().optional(),
})

export type InvitationFormValues = z.infer<typeof invitationSchema>


export async function getInvitationsDAO() {
  const found = await prisma.invitation.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      client: true,
      agency: true,
		}
  })
  const res: InvitationDAO[] = found.map((invitation) => {
    return {
      ...invitation,
      clientName: invitation.client?.name,
      agencyName: invitation.agency?.name,
    }
  })
  return res
}

export async function getInvitationDAO(id: string) {
  const found = await prisma.invitation.findUnique({
    where: {
      id
    },
    include: {
      client: true,
      agency: true,
		}
  })
  if (!found) return null

  const res: InvitationDAO = {
    ...found,
    clientName: found.client?.name,
    agencyName: found.agency?.name,
  }
  
  return res
}
    
export async function createInvitation(data: InvitationFormValues) {
  const created = await prisma.invitation.create({
    data
  })
  if (!created) return null

  return created
}

export async function updateInvitation(id: string, data: InvitationFormValues) {
  const updated = await prisma.invitation.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteInvitation(id: string) {
  const deleted = await prisma.invitation.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullInvitationsDAO() {
  const found = await prisma.invitation.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
		}
  })
  return found as InvitationDAO[]
}
  
export async function getFullInvitationDAO(id: string) {
  const found = await prisma.invitation.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as InvitationDAO
}

export async function getPendingInvitationsOfAgency(agencyId: string) {
  const found = await prisma.invitation.findMany({
    where: {
      agencyId,
      status: 'PENDING'
    },
    include: {
      client: true,
      agency: true,
		}
  })
  const res: InvitationDAO[] = found.map((invitation) => {
    return {
      ...invitation,
      clientName: invitation.client?.name,
      agencyName: invitation.agency?.name,
    }
  })
  return res
}

export async function getPendingInvitationsOfClient(clientId: string) {
  const found = await prisma.invitation.findMany({
    where: {
      clientId,
      status: 'PENDING'
    },
    include: {
      client: true,
      agency: true,
		}
  })
  const res: InvitationDAO[] = found.map((invitation) => {
    return {
      ...invitation,
      clientName: invitation.client?.name,
      agencyName: invitation.agency?.name,
    }
  })
  return res
}