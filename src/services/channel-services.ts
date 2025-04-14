import * as z from "zod"
import { prisma } from "@/lib/db"
import { ChannelStatus } from ".prisma/client"

export type ChannelDAO = {
	id: string
	name: string
	slug: string
	icon: string
	status: ChannelStatus
	createdAt: Date
	updatedAt: Date
}

export const channelSchema = z.object({
	name: z.string().min(1, "name is required."),
	slug: z.string().min(1, "slug is required."),
	icon: z.string().min(1, "icon is required."),
	status: z.nativeEnum(ChannelStatus),
})

export type ChannelFormValues = z.infer<typeof channelSchema>


export async function getChannelsDAO() {
  const found = await prisma.channel.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as ChannelDAO[]
}

export async function getChannelDAO(id: string) {
  const found = await prisma.channel.findUnique({
    where: {
      id
    },
  })
  return found as ChannelDAO
}

export async function getChannelDAOBySlug(slug: string) {
  const found = await prisma.channel.findUnique({
    where: {
      slug
    },
  })
  return found as ChannelDAO
}
    
export async function createChannel(data: ChannelFormValues) {
  // TODO: implement createChannel
  const created = await prisma.channel.create({
    data
  })
  return created
}

export async function updateChannel(id: string, data: ChannelFormValues) {
  const updated = await prisma.channel.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteChannel(id: string) {
  const deleted = await prisma.channel.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullChannelsDAO() {
  const found = await prisma.channel.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      clients: true
		}
  })
  return found as ChannelDAO[]
}
  
export async function getFullChannelDAO(id: string) {
  const found = await prisma.channel.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as ChannelDAO
}
    
export async function getChannelsByClientSlug(agencySlug: string, clientSlug: string) {
  const found = await prisma.channel.findMany({
    where: {
      clients: {
        some: {
          slug: clientSlug,
          agency: {
            slug: agencySlug
          }
        }
      }
    },
    include: {
      clients: true
    },
    orderBy: {
      id: 'asc'
    }
  })
  return found as ChannelDAO[]
}

export async function changeClientChannelPermission(channelId: string, clientId: string) {
  // if channel have client, remove it
  // if channel don't have client, add it

  const found= await prisma.channel.findUnique({
    where: {
      id: channelId
    },
    include: {
      clients: true
    }
  })

  if (!found) {
    throw new Error("Channel not found")
  }

  const hasClient= found.clients.some((client) => client.id === clientId)

  if (hasClient) {
    await prisma.channel.update({
      where: {
        id: channelId
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
    await prisma.channel.update({
      where: {
        id: channelId
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
