import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/utils"
import * as z from "zod"
import { AgencyDAO } from "./agency-services"
import { ChannelDAO, getChannelDAOBySlug } from "./channel-services"
import { PilarDAO } from "./pilar-services"
import { UserDAO, getUsersDAO } from "./user-services"
import { WhatsappInstanceDAO } from "./wrc-sdk-types"

export type ClientDAO = {
	id: string
	name: string
	slug: string
	image: string | undefined
	description: string | undefined
	igHandle: string | undefined
	brandVoice: string | undefined
  prompt: string | undefined
  copyPrompt: string | undefined
  defaultHashtags: string | undefined
  includeBrandVoice: boolean
  includeLastCopys: boolean
  leadPrompt: string | undefined
  ignoredNumbers: string | undefined
  messageArrivedDelay: number
  sessionTTL: number
  timezone: string
	createdAt: Date
	updatedAt: Date
	users: UserDAO[]
	agency: AgencyDAO
  channels: ChannelDAO[]
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
  defaultHashtags: z.string().optional(),
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
      name: 'asc'
    },
    include: {
      users: true,
      agency: true,
      channels: true,
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
    include: {
      agency: true
    }
  })
  return found as ClientDAO
}

export async function getClientDAOBySlugs(agencySlug: string, clientSlug: string) {
  const found = await prisma.client.findFirst({
    where: {
      agency: {
        slug: agencySlug
      },
      slug: clientSlug
    },
    include: {
      pilars: true,
      agency: true,
      channels: true,
    }
  })
  return found as ClientDAO
}
    
export async function createClient(data: ClientFormValues) {
  const slug= await getUniqueSlug(data)
  data.slug= slug
  let prompt= `Eres un experto copywriter que ayuda al usuario con sus copys para publicaciones de las redes sociales de ${data.name}.\n\n`
  prompt+= "- Utiliza saltos de línea para separar los párrafos de cada copy.\n"
  prompt+= "- Un copy de Instagram debe tener un largo aproximado de 100 palabras.\n"
  prompt+= "- Un copy de Instagram debe ser claro y conciso, y debe ser útil para los clientes.\n"


  const created = await prisma.client.create({
    data: {
      ...data,
      prompt
    },
    include: {
      agency: true,
    }
  })
  
  const agencyId= data.agencyId
  const allUsers= await getUsersDAO()
  const agencyAdminUsers= allUsers.filter(c => c.role === 'AGENCY_ADMIN' && c.agencyId === agencyId)
  const agencyOwner= allUsers.find(c => c.role === 'AGENCY_OWNER' && c.agencyId === agencyId)
  if (agencyOwner) {
    agencyAdminUsers.push(agencyOwner)
  }
  console.log(`connecting ${agencyAdminUsers.length} users to the client ${created.name}`)

  await setUsers(created.id, agencyAdminUsers)

  // set default channels
  const instagramCheannel= await getChannelDAOBySlug('instagram')
  if (instagramCheannel) {
    await prisma.client.update({
      where: {
        id: created.id
      },
      data: {
        channels: {
          connect: {id: instagramCheannel.id}
        }
      }
    })
    console.log('channel connected', instagramCheannel)
  }

  return created
}

async function getUniqueSlug(data: ClientFormValues) {
  let slug= data.slug
  let i= 2
  while (true && i < 10) {
    console.log('checking slug', slug);
    
    let exists= await prisma.client.findFirst({
      where: {
        agencyId: data.agencyId,
        slug
      }
    })
    console.log('exists', exists)
    
    if (!exists) {
      break
    }
    slug= `${data.slug}-${i}`
    i++    
  }

  return slug
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
    include: {
      agency: true,
    }
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
      channels: true,
    },
    orderBy: {
      name: 'asc'
    }
  })

  return found as ClientDAO[]
}

export async function getClientsOfCurrentUser() {
  const currentUser= await getCurrentUser()
  if (!currentUser?.id) return []

  return getClientsOfUser(currentUser.id)
}

export async function setName(id: string, name: string) {
  const updated = await prisma.client.update({
    where: {
      id
    },
    data: {
      name
    }
  })
  return updated
}

export async function setDescription(id: string, description: string) {
  const updated = await prisma.client.update({
    where: {
      id
    },
    data: {
      description
    }
  })
  return updated
}

export async function setSlug(id: string, slug: string) {
  const client= await getClientDAO(id)
  const agencyId= client.agencyId
  // check if the slug exists for the agency
  const exists= await prisma.client.findFirst({
    where: {
      agencyId,
      slug
    }
  })

  if (exists) {
    return "El slug ya existe para esta agencia"
  }

  const updated = await prisma.client.update({
    where: {
      id
    },
    data: {
      slug
    }
  })
  if (!updated) return "Error al actualizar el slug"

  return "OK"
}

export async function setImage(id: string, image: string) {
  console.log('setting image', image);
  
  const updated = await prisma.client.update({
    where: {
      id
    },
    data: {
      image
    }
  })
  return updated
}

export async function setBrandVoice(id: string, brandVoice: string) {
  const updated = await prisma.client.update({
    where: {
      id
    },
    data: {
      brandVoice
    }
  })
  return updated
}

export async function setCopyPrompt(id: string, copyPrompt: string) {
  const updated = await prisma.client.update({
    where: {
      id
    },
    data: {
      copyPrompt
    }
  })
  return updated
}

export async function setIncludeBrandVoice(id: string, includeBrandVoice: boolean) {
  const updated = await prisma.client.update({
    where: {
      id
    },
    data: {
      includeBrandVoice
    }
  })
  return updated
}

export async function setIncludeLastCopys(id: string, includeLastCopys: boolean) {
  const updated = await prisma.client.update({
    where: {
      id
    },
    data: {
      includeLastCopys
    }
  })
  return updated
}

export async function getClientOfPublication(publicationId: string) {
  const found = await prisma.client.findFirst({
    where: {
      publications: {
        some: {
          id: publicationId
        }
      }
    },
  })
  
  return found as ClientDAO
}

export async function setDefaultHashtags(id: string, defaultHashtags: string) {
  const updated = await prisma.client.update({
    where: {
      id
    },
    data: {
      defaultHashtags
    }
  })
  return updated
}

export async function setPrompt(clientId: string, prompt: string) {
  const client= await prisma.client.update({
    where: {
      id: clientId
    },
    data: {
      prompt
    },
    include: {
      agency: true
    }
  })

  return client   
}

export async function setLeadPrompt(clientId: string, leadPrompt: string) {
  const client= await prisma.client.update({
    where: {
      id: clientId
    },
    data: {
      leadPrompt
    }
  })

  return client   
}

export async function getSessionTTL(clientId: string) {
  const client = await prisma.client.findUnique({
    where: {
      id: clientId
    },
    select: {
      sessionTTL: true
    }
  })
  if (!client) return null
  
  return client.sessionTTL
}

export async function getChatwootAccountId(clientId: string) {
  const client = await prisma.whatsappInstance.findFirst({
    where: {
      clientId
    },
    select: {
      chatwootAccountId: true
    }
  })

  if (!client) return null

  return client.chatwootAccountId
} 


export async function getClientIdByChatwootAccountId(chatwootAccountId: number) {
  const client= await prisma.whatsappInstance.findFirst({
    where: {
      chatwootAccountId
    },
    select: {
      clientId: true
    }
  })

  if (!client) return null

  return client.clientId
}

export async function setWhatsappInstance(whatsappInstanceData: WhatsappInstanceDAO) {
  const whatsappInstance = await prisma.whatsappInstance.findFirst({
    where: {
      clientId: whatsappInstanceData.clientId
    }
  })

  if (!whatsappInstance) {
    const newWhatsappInstance = await prisma.whatsappInstance.create({
      data: {
        ...whatsappInstanceData,
        clientId: whatsappInstanceData.clientId
      }
    })
    return newWhatsappInstance
  } else {
    const updatedWhatsappInstance = await prisma.whatsappInstance.update({
      where: {
        id: whatsappInstance.id
      },
      data: whatsappInstanceData
    })
    return updatedWhatsappInstance
  }  

}

export async function deleteWhatsappInstance(instanceName: string) {
  const deleted = await prisma.whatsappInstance.delete({
    where: {
      name: instanceName
    }
  })

  return deleted
}

export async function checkNameAvailability(instanceName: string) {
  const exists= await prisma.whatsappInstance.findUnique({
    where: {
      name: instanceName
    }
  })
  return !exists
}

export async function getWhatsappInstance(clientId: string) {
  const client = await prisma.client.findUnique({
    where: {
      id: clientId
    },
    select: {
      whatsappInstances: true
    }
  })
  if (!client) return null
  if (client.whatsappInstances.length === 0) return null

  return client.whatsappInstances[0]
}

export async function setChatwootData(clientId: string, chatwootAccountId: number, chatwootAccessToken: string, chatwootUrl: string) {
  const whatsappInstance = await prisma.whatsappInstance.findFirst({
    where: {
      clientId
    }
  })

  if (!whatsappInstance) {
    throw new Error('Whatsapp instance not found')
  }

  const updatedInstance = await prisma.whatsappInstance.update({
    where: {
      id: whatsappInstance.id
    },
    data: {
      chatwootAccountId,
      chatwootAccessToken,
      chatwootUrl
    }
  })

  return updatedInstance
}

export async function getMessageArrivedDelayByMessageId(messageId: string) {
  const message = await prisma.message.findUnique({
    where: {
      id: messageId
    },
    select: {
      conversation: {
        select: {
          client: {
            select: {
              messageArrivedDelay: true
            }
          }
        }
      }
    }
  })
  if (!message) 
    throw new Error("Message not found or conversation not found or messageArrivedDelay not found")

  return message.conversation?.client?.messageArrivedDelay
}

export async function setIgnoredNumbers(clientId: string, ignoredNumbers: string) {
  const updated = await prisma.client.update({
    where: {
      id: clientId
    },
    data: {
      ignoredNumbers
    }
  })
}