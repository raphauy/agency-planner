import * as z from "zod"
import { prisma } from "@/lib/db"
import { MessageDAO } from "./message-services"
import { ClientDAO } from "./client-services"
import { getMessagesDAO } from "./message-services"

export type ConversationDAO = {
	id: string
	phone: string
	createdAt: Date
	updatedAt: Date
	messages: MessageDAO[]
	client: ClientDAO
	clientId: string
}

export const conversationSchema = z.object({
	phone: z.string().min(1, "phone is required."),
	clientId: z.string().min(1, "clientId is required."),
})

export type ConversationFormValues = z.infer<typeof conversationSchema>


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
  // TODO: implement createConversation
  const created = await prisma.conversation.create({
    data,
    include: {
      client: true,
      messages: true,
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
			messages: true,
			client: true,
		}
  })
  return found as ConversationDAO
}
    