import * as z from "zod"
import { prisma } from "@/lib/db"
import { MessageDAO } from "./message-services"
import { ClientDAO, getClientDAO, getSessionTTL } from "./client-services"
import { getMessagesDAO } from "./message-services"
import { UserDAO } from "./user-services"
import { createUsageRecord, UsageRecordDAO, UsageRecordFormValues } from "./usagerecord-services"
import { getUsageTypeDAOByName } from "./usagetype-services"
import { DocumentType } from "@prisma/client"

export type ConversationDAO = {
	id: string
	phone: string
  name: string
  title: string
  closed: boolean
  type: DocumentType
	createdAt: Date
	updatedAt: Date
	messages: MessageDAO[]
	client: ClientDAO
	clientId: string
  user: UserDAO | null
  userId: string | null
  usageRecordId: string
}

export const conversationSchema = z.object({
	phone: z.string().min(1, "phone is required."),
  name: z.string().optional().nullable(),
  title: z.string().min(1, "title is required."),
	clientId: z.string().min(1, "clientId is required."),
  userId: z.string().min(1, "userId is required."),
  type: z.nativeEnum(DocumentType),
})

export type ConversationFormValues = z.infer<typeof conversationSchema>

export const titleSchema = z.object({
  title: z.string().min(1, "es necesario un título."),
})

export type TitleFormValues = z.infer<typeof titleSchema>

export async function getConversationsDAO() {
  const found = await prisma.conversation.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as ConversationDAO[]
}

export async function getConversationDAO(id: string) {

  const found = await prisma.conversation.findUnique({
    where: {
      id
    },
    include: {
      client: true,
      messages: true,
    }
  })
  return found as ConversationDAO
}
    
export async function createConversation(data: ConversationFormValues) {
  const llmUsageType= await getUsageTypeDAOByName("LLM")
  if (!llmUsageType) throw new Error("No se encontró UsageType LLM")

  const client= await getClientDAO(data.clientId)
  if (!client) throw new Error("No se encontró Cliente")

  const llmUsage: UsageRecordFormValues= {
    agencyId: client.agencyId,
    clientId: client.id,
    usageTypeId: llmUsageType.id,
    credits: 0,
    description: "Créditos para Copy Lab"    
  }
  const createdUsage= await createUsageRecord(llmUsage)
  
  const created = await prisma.conversation.create({
    data: {
      ...data,
      usageRecordId: createdUsage.id
    },
    include: {
      client: true,
      messages: true,
    }
  })
  // update URL of the llmUsage
  const updatedUsage= await prisma.usageRecord.update({
    where: {
      id: createdUsage.id
    },
    data: {
      url: `/${client.agency.slug}/${client.slug}/copy-lab/${created.id}`
    }
  })
  return created
}

export async function updateConversation(id: string, data: ConversationFormValues) {
  const updated = await prisma.conversation.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteConversation(id: string) {
  const deleted = await prisma.conversation.delete({
    where: {
      id
    },
  })
  return deleted
}
    
export async function getComplentaryMessages(id: string) {
  const found = await prisma.conversation.findUnique({
    where: {
      id
    },
    include: {
      messages: true,
    }
  })
  const all= await getMessagesDAO()
  const res= all.filter(aux => {
    return !found?.messages.find(c => c.id === aux.id)
  })
  
  return res
}

export async function setMessages(id: string, messages: MessageDAO[]) {
  const oldMessages= await prisma.conversation.findUnique({
    where: {
      id
    },
    include: {
      messages: true,
    }
  })
  .then(res => res?.messages)

  await prisma.conversation.update({
    where: {
      id
    },
    data: {
      messages: {
        disconnect: oldMessages
      }
    }
  })

  const updated= await prisma.conversation.update({
    where: {
      id
    },
    data: {
      messages: {
        connect: messages.map(c => ({id: c.id}))
      }
    }
  })

  if (!updated) {
    return false
  }

  return true
}



export async function getFullConversationsDAO() {
  const found = await prisma.conversation.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			messages: true,
			client: true,
      user: true
		}
  })
  return found as ConversationDAO[]
}
  
export async function getFullConversationDAO(id: string) {
  const found = await prisma.conversation.findUnique({
    where: {
      id
    },    
    include: {
			messages: {
        orderBy: {
          createdAt: 'asc'
        }
      },
			client: true,
      user: true,      
		},    
  })
  return found as ConversationDAO
}

export async function getFullConversationsBySlugs(agencySlug: string, clientSlug: string, type: DocumentType) {
  const found = await prisma.conversation.findMany({
    where: {
      client: {
        slug: clientSlug,
        agency: {
          slug: agencySlug
        }
      },      
      type
    },
    include: {
			client: true,
      user: true
		},
    orderBy: {
      createdAt: 'desc'
    }
  })
  return found as ConversationDAO[]
}

export async function setTitle(id: string, title: string) {
  const updated = await prisma.conversation.update({
    where: {
      id
    },
    data: {
      title
    }
  })
  return updated
}

export async function getTotalTokens(conversationId: string) {
  const found = await prisma.conversation.findUnique({
    where: {
      id: conversationId
    },
    include: {
      messages: true
    }
  })
  if (!found) return 0

  const messages= found.messages
  const totalTokens= messages.reduce((acc, message) => acc + message.tokens, 0)

  return totalTokens
}

export async function updateConversationUsage(id: string, tokens: number) {
  const conversation= await prisma.conversation.findUnique({
    where: {
      id
    },
    include: {
      usageRecord: {
        include: {          
          usageType: true
        }
      }
    }
  })
  if (!conversation) throw new Error("No se encontró conversación")

  const credits= tokens * conversation.usageRecord.usageType.creditFactor

  console.log("tokens", tokens)
  console.log("previous credits", conversation.usageRecord.credits)
  console.log("new credits", credits)

  const updatedUsage= await prisma.usageRecord.update({
    where: {
      id: conversation.usageRecordId
    },
    data: {
      credits: conversation.usageRecord.credits + credits
    }
  })
  return updatedUsage
}

export async function closeConversation(conversationId: string) {
  const updated= await prisma.conversation.update({
    where: {
      id: conversationId
    },
    data: {
      closed: true
    },
    include: {
      client: true
    }
  })

  return updated
}


// an active conversation is one that has a message in the last x minutes
export async function getActiveConversation(phone: string, clientId: string) {

  let sessionTimeInMinutes= await getSessionTTL(clientId) || 10
    
  const found = await prisma.conversation.findFirst({
    where: {
      phone,
      clientId,
      closed: false,
      messages: {
        some: {
          createdAt: {
            gte: new Date(Date.now() - sessionTimeInMinutes * 60 * 1000)
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      client: true
    }
  })

  return found;
}

export async function getActiveMessages(phone: string, clientId: string) {

  const activeConversation= await getActiveConversation(phone, clientId)
  if (!activeConversation) return null

  const messages= await prisma.message.findMany({
    where: {
      conversationId: activeConversation.id
    },
    orderBy: {
      createdAt: 'asc',
    }
  })

  return messages
}
