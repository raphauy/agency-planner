import * as z from "zod"
import { prisma } from "@/lib/db"
import { ConversationDAO, updateConversationUsage } from "./conversation-services"
import { CoreAssistantMessage, CoreMessage, CoreSystemMessage, CoreToolMessage, CoreUserMessage, ToolContent } from "ai"

export type MessageDAO = {
	id: string
	role: string
	content: string
  name: string | undefined | null
  toolInvocations: string | undefined | null
  tokens: number
	createdAt: Date
	updatedAt: Date
	conversationId: string
}

export const messageSchema = z.object({
	role: z.string().min(1, "role is required."),
	content: z.string().min(1, "content is required."),
  name: z.string().optional(),
  tokens: z.number().min(1, "tokens is required."),
  toolInvocations: z.string().optional(),
	conversationId: z.string().min(1, "conversationId is required."),
})

export type MessageFormValues = z.infer<typeof messageSchema>


export async function getMessagesDAO() {
  const found = await prisma.message.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as MessageDAO[]
}

export async function getMessageDAO(id: string) {
  const found = await prisma.message.findUnique({
    where: {
      id
    },
  })
  return found as MessageDAO
}
    
export async function createMessage(data: MessageFormValues) {
  const created = await prisma.message.create({
    data
  })
  if (!created) return null

  await updateConversationUsage(data.conversationId, data.tokens)
  
  return created
}

export async function updateMessage(id: string, data: MessageFormValues) {
  const updated = await prisma.message.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteMessage(id: string) {
  const deleted = await prisma.message.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullMessagesDAO() {
  const found = await prisma.message.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			conversation: true,
		}
  })
  return found as MessageDAO[]
}
  
export async function getFullMessageDAO(id: string) {
  const found = await prisma.message.findUnique({
    where: {
      id
    },
    include: {
			conversation: true,
		}
  })
  return found as MessageDAO
}

    
export async function getConversationDbMessages(conversationId: string, take: number = 20): Promise<CoreMessage[]> {
  const found = await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: 'asc'
    },
    take
  })
  const res: CoreMessage[] = []
  for (const message of found) {
    const role= message.role
    if (role === "user") {
      const coreUserMessage: CoreUserMessage = {        
        role: "user",
        content: message.content
      }
      res.push(coreUserMessage)
    } else if (role === "assistant") { 
      const coreAssistantMessage: CoreAssistantMessage = {
        role: "assistant",
        content: message.content
      }
      res.push(coreAssistantMessage)
    } else if (role === "tool" || role === "data" || role === "function") {
      const name= message.name || ""
      if (name !== "obtenerDocumento") {
        const coreToolMessage: CoreSystemMessage= {
          role: "system",
          content: message.content,        
        }
        res.push(coreToolMessage)  
      }
    }
  }
  return res
}
