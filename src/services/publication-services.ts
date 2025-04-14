import * as z from "zod"
import { prisma } from "@/lib/db"
import { PublicationListener, PublicationStatus, PublicationType } from ".prisma/client"
import { ClientDAO } from "./client-services"
import { PilarDAO } from "./pilar-services"
import { CommentDAO, CommentFormValues, createComment } from "./comment-services"
import { getCurrentUser } from "@/lib/utils"
import { getUserDAO, getUsersOfClient, UserDAO } from "./user-services"
import { getPendingInvitationsOfClient } from "./invitation-services"

export type PublicationDAO = {
	id: string
	type: PublicationType
	status: PublicationStatus
	title: string
	images: string | undefined
	hashtags: string | undefined
	copy: string | undefined
	publicationDate: Date | null
  usageIsPending: boolean
	createdAt: Date
	updatedAt: Date
	clientId: string
  client: ClientDAO
	pilarId: string | undefined
  pilar: PilarDAO | undefined
  usageRecordId: string | undefined
  listeners: PublicationListener[]
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
	pilarId: z.string({required_error: "Tienes que elegir un pilar de contenido"})
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

export async function getLastPublicationsWithoutListeners(take: number) {
  const found = await prisma.publication.findMany({
    where: {
      listeners: {
        none: {}
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      client: {
        select: {
          name: true
        }
      }
		},
    take,
  })
  return found as PublicationDAO[]
}

export async function getCountPublicationsWithoutListeners() {
  const count = await prisma.publication.count({
    where: {
      listeners: {
        none: {}
      }
    }
  })
  return count
}

export async function getPublicationsDAOByClient(clientId: string) {

  const found = await prisma.publication.findMany({
    where: {
      client: {
        id: clientId
      },
    },
    orderBy: {
      publicationDate: 'desc'
    },
    include: {
      client: {
        include: {
          agency: {
            select: {
              slug: true
            }
          },          
        },
      },
      pilar: true
    }
  })
  return found as PublicationDAO[]
}

export async function getPublicationsDAOByClientWithFilter(agencySlug: string,clientSlug: string, filter: string, isClient: boolean) {

  const statusArray= isClient ? [PublicationStatus.REVISADO, PublicationStatus.APROBADO, PublicationStatus.PROGRAMADO, PublicationStatus.PUBLICADO] : Object.values(PublicationStatus)

  // filter can have values: P, R and S form Post, Reels and Stories
  const types: PublicationType[] = mapTypes(filter)

  const found = await prisma.publication.findMany({
    where: {
      client: {
        slug: clientSlug,
        agency: {
          slug: agencySlug
        }
      },
      type: {
        in: types
      },
      status: {
        in: statusArray
      },
    },
    orderBy: {
      publicationDate: 'desc'
    },
    include: {
      pilar: true
    }
  })
  return found as PublicationDAO[]
}

function mapTypes(filter: string) {
  const types: PublicationType[] = []

  if (!filter) 
    return types

  if (filter.toUpperCase().includes("P")) 
    types.push(PublicationType.INSTAGRAM_POST)

  if (filter.toUpperCase().includes("R")) 
    types.push(PublicationType.INSTAGRAM_REEL)

  if (filter.toUpperCase().includes("S")) 
    types.push(PublicationType.INSTAGRAM_STORY)
  
  return types
}

export async function getPublicationsDAOByClientAndType(clientId: string, type: PublicationType, isClient: boolean) {
  const statusArray= isClient ? [PublicationStatus.REVISADO, PublicationStatus.APROBADO, PublicationStatus.PROGRAMADO, PublicationStatus.PUBLICADO] : Object.values(PublicationStatus)

  const found = await prisma.publication.findMany({
    where: {
      client: {
        id: clientId
      },
      type,
      status: {
        in: statusArray
      },
    },
    orderBy: {
      publicationDate: 'desc'
    },
    include: {
      pilar: true
    }
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
      pilar: true,
    }
  })
  return found as PublicationDAO
}


export async function getPublicationDAOWithAgency(id: string) {
  const found = await prisma.publication.findUnique({
    where: {
      id
    },
    include: {
      client: {
        include: {
          agency: true,
        }
      },
      listeners: true
    }
  })
  return found as PublicationDAO
}

export async function createPublication(data: PublicationFormValues) {
  const created = await prisma.publication.create({
    data: {
      ...data,
      usageIsPending: true
    }
  })
  if (!created) return null
  const currentUser = await getCurrentUser()
  if (!currentUser) return false
  const userName= currentUser.name || currentUser.email
  const text = getText(created.type) + " por " + userName
  const commentForm: CommentFormValues = {
    text,
    publicationId: created.id
  }
  await createComment(commentForm)

  const users= await getUsersOfClient(created.clientId)
  const pendingInvitations= await getPendingInvitationsOfClient(created.clientId)
  const userIdsPendingInvitations= pendingInvitations.map((i) => i.userId)
  const activeUsers= users.filter((u) => !userIdsPendingInvitations.includes(u.id))
  await addListeners(created.id, activeUsers.map((u) => u.id))

  return created
}

function getText(type: PublicationType) {
  switch (type) {
    case PublicationType.INSTAGRAM_POST:
      return "Post creado"
    case PublicationType.INSTAGRAM_REEL:
      return "Reel creado"
    case PublicationType.INSTAGRAM_STORY:
      return "Historia creada"
    default:
      return "Publicación"
  }
}

export async function updatePublication(id: string, data: PublicationFormValues) {
  const updated = await prisma.publication.update({
    where: {
      id
    },
    data: {
      ...data,
      usageIsPending: true
    }
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

export async function updatePublicationStatus(id: string, status: PublicationStatus){  
  
  const publication = await getPublicationDAO(id)
  if (!publication) return false
  const oldStatus = publication.status

  const updated= await prisma.publication.update({
      where: {
          id
      },
      data: {
          status
      }
  })
  if (!updated) return false

  const currentUser = await getCurrentUser()
  if (!currentUser) return false
  const userName= currentUser.name || currentUser.email

  // create a system comment for the change of status
  const text = userName + " " + getStatusChangeText(updated.type, oldStatus, status)
  const commentForm: CommentFormValues = {
    text,
    publicationId: id
  }
  await createComment(commentForm)

  return true
}

function getStatusChangeText(type: PublicationType, oldStatus: PublicationStatus, newStatus: PublicationStatus) {
  switch (type) {
    case PublicationType.INSTAGRAM_POST:
      return `pasó el post de ${oldStatus} a ${newStatus}`
    case PublicationType.INSTAGRAM_REEL:
      return `pasó el reel de ${oldStatus} a ${newStatus}`
    case PublicationType.INSTAGRAM_STORY:
      return `pasó la historia de ${oldStatus} a ${newStatus}`
    default:
      return `Publicación ${oldStatus} a ${newStatus}`
  }
}

export async function setUsageRecord(id: string, usageRecordId: string) {
  const updated = await prisma.publication.update({
    where: {
      id
    },
    data: {
      usageRecordId
    }
  })
  return updated
}

export async function getListeners(publicationId: string) {

  const publicationListeners= await prisma.publicationListener.findMany({
    where: {
      publicationId
    },
    orderBy: {
      user: {
        name: 'asc'
      }
    },
    include: {
      user: true
		}
  })

  const res= publicationListeners.map((listener) => listener.user)

  return res  
}

export async function getAgencyListeners(publicationId: string) {
  const publicationListeners= await prisma.publicationListener.findMany({
    where: {
      publicationId,
      user: {
        role: { in: ["AGENCY_OWNER", "AGENCY_ADMIN", "AGENCY_CREATOR"] }
      }
    },
    include: {
      user: true
		}
  })

  const res= publicationListeners.map((listener) => listener.user)

  return res
}

export async function addListener(publicationId: string, userId: string) {
  const publication= await getPublicationDAO(publicationId)
  if (!publication) throw new Error("Publication not found")

  const user= await getUserDAO(userId)
  if (!user) throw new Error("User not found")

  const listener= await prisma.publicationListener.create({
    data: {
      publicationId,
      userId
    }
  })

  if (!listener) throw new Error("Error al agregar el listener")

  return listener
}

export async function addListeners(publicationId: string, userIds: string[]) {
  const publication= await getPublicationDAO(publicationId)
  if (!publication) throw new Error("Publication not found")

  const users= await prisma.user.findMany({
    where: {
      id: {
        in: userIds
      }
    }
  })

  if (!users) throw new Error("Users not found")

  const listeners= users.map(user => {
    return {
      publicationId,
      userId: user.id
    }
  })

  await prisma.publicationListener.createMany({
    data: listeners
  })

  return true
}

export async function removeListener(publicationId: string, userId: string) {

  const deleted=await prisma.publicationListener.delete({
    where: {
      publicationId_userId: {
        publicationId,
        userId,
      },
    },
  })

  return deleted
}

export type PublicationMember = {
  id: string
  name: string | undefined
  image: string | undefined
  listener: boolean
}

export async function getTeamMembers(publicationId: string) {
  const publication= await getPublicationDAOWithAgency(publicationId)
  if (!publication) throw new Error("Publication not found")

  const clientUsers= await getUsersOfClient(publication.clientId)
  const listenersIds= await prisma.publicationListener.findMany({
    where: {
      publicationId
    },
    select: {
      userId: true
    }
  })

  const res: PublicationMember[] = clientUsers.map((user) => {
    const listener= listenersIds.some(listener => listener.userId === user.id)
    let altImage= publication.client.image
    if (user.role.startsWith("AGENCY")) {
        altImage= publication.client.agency.image
    }

    return {
      id: user.id,
      name: user.name,
      image: user.image || altImage,
      listener
    }
  })

  return res


}