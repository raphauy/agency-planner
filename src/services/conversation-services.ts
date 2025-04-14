import { prisma } from "@/lib/db"
import { DocumentType } from ".prisma/client"
import * as z from "zod"
import { ClientDAO, getChatwootAccountId, getClientDAO, getSessionTTL, getWhatsappInstance } from "./client-services"
import { getConversationDbMessages, getMessagesDAO, MessageDAO } from "./message-services"
import { createUsageRecord, UsageRecordFormValues } from "./usagerecord-services"
import { getUsageTypeDAOByName } from "./usagetype-services"
import { UserDAO } from "./user-services"
import { getContactContext, getDocumentsContext, getGeneralContext, saveLLMResponse, saveToolCallResponse } from "./function-call-services"
import { convertToCoreMessages, generateText, Message } from "ai"
import { openai } from "@ai-sdk/openai"
import { leadTools } from "./tools"
import { createChatwootConversation, sendTextToConversation } from "./chatwoot"
import { ContactFormValues, createContact, getContactByChatwootId, getContactDAO, setNewStage } from "./contact-services"
import { addTagsToContact, ContactDAO } from "./contact-services"
import { getUserByEmail } from "./login-services"
import { getRepositorysDAO, getToolFromDatabase } from "./repository-services"

export type ConversationDAO = {
	id: string
	phone: string
  name: string | null
  imageUrl: string | null
  title: string
  context: string
  closed: boolean
  type: DocumentType
  chatwootConversationId: number | null
	createdAt: Date
	updatedAt: Date
  lastMessageAt: Date
	messages: MessageDAO[]
	client: ClientDAO
	clientId: string
  user: UserDAO | null
  userId: string | null
  usageRecordId: string
  contactId: string | null
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
      messages: {
        orderBy: {
          createdAt: 'asc'
        }
      }
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

export async function createContactConversation(clientId: string, contact: ContactDAO, chatwootConversationId: number) {
  const client= await getClientDAO(clientId)
  if (!client) throw new Error("No se encontró Cliente")

  const llmUsageType= await getUsageTypeDAOByName("LLM")
  if (!llmUsageType) throw new Error("No se encontró UsageType LLM")
  
  const llmUsage: UsageRecordFormValues= {
    agencyId: client.agencyId,
    clientId: client.id,
    usageTypeId: llmUsageType.id,
    credits: 0,
    description: "Créditos para Conversación de Contacto"    
  }
  const createdUsage= await createUsageRecord(llmUsage)

  const created= await prisma.conversation.create({
    data: {
      phone: contact.phone || "",
      name: contact.name || "",
      imageUrl: contact.imageUrl || "",
      title: "Contacto",
      type: DocumentType.LEAD,
      usageRecordId: createdUsage.id,
      clientId,
      contactId: contact.id,
      chatwootConversationId: chatwootConversationId
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

async function updateContext(conversationId: string, context: string) {
  await prisma.conversation.update({
      where: { id: conversationId },
      data: { context }
  })
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
    },
    take: 100
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
  // update conversation lastMessageAt
  await prisma.conversation.update({
    where: {
      id: conversation.id
    },
    data: { lastMessageAt: new Date() }
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
    
  // Buscamos una conversación activa basándonos en lastMessageAt
  const found = await prisma.conversation.findFirst({
    where: {
      phone,
      clientId,
      closed: false,
      lastMessageAt: {
        gte: new Date(Date.now() - sessionTimeInMinutes * 60 * 1000)
      }
    },
    orderBy: {
      lastMessageAt: 'desc', // Ordenamos por la última interacción de mensaje
    },
    include: {
      client: true
    }
  });

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

export async function getConversationMessages(conversationId: string, take: number = 20) {
  const messages= await prisma.message.findMany({
    where: {
      conversationId
    },
    orderBy: {
      createdAt: 'asc',
    },
    take
  })

  return messages
}

export async function getLastConversation(agencySlug: string, clientSlug: string, type: DocumentType) {
    
  const found = await prisma.conversation.findFirst({
    where: {
      type,
      client: {
        slug: clientSlug,
        agency: {
          slug: agencySlug
        }
      }
    },
    orderBy: {
      lastMessageAt: 'desc',
    },
    include: {
      client: true,
      messages: {
        orderBy: {
          createdAt: 'asc'
        }
      },
    }
  })

  return found as ConversationDAO
}

// find an active conversation or create a new one to connect the messages
export async function messageArrived(phone: string, text: string, clientId: string, role: string, tokens?: number, chatwootConversationId?: number, chatwootContactId?: number) {

  if (!clientId) throw new Error("clientId is required")

  console.log("phone: ", phone)
  console.log("clientId: ", clientId)  

  let activeConversation= null

  if (chatwootConversationId) {
    activeConversation= await getActiveConversationByChatwootConversationId(Number(chatwootConversationId), clientId)
  } else {
    activeConversation= await getActiveConversation(phone, clientId)
  }


  if (activeConversation) {
    const message= await createMessage(activeConversation.id, role, text, tokens)
    return message    
  } else {
    // sleep 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("chatwootContactId on create conversation: ", chatwootContactId)
    let contact= await getContactByChatwootId(String(chatwootContactId), clientId)

    let chatwootId= String(chatwootContactId)
    if (!contact) {
      const isSimulator= phone && phone.includes("@")
      let src= isSimulator ? "simulador" : phone ? "whatsapp" : "chatwoot"
      
      let name= phone
      if (isSimulator) {
        const user= await getUserByEmail(phone)
        if (user) {
          name= user.name || phone
        }
        chatwootId= phone
      }

      if (chatwootId) {
        const contactValues: ContactFormValues= {
          name,
          phone,
          src,
          clientId,
          chatwootId
        }
        console.log("creating contact from messageArrived")
        try {
          contact= await createContact(contactValues)
        } catch (error) {
          console.log("error creating contact from messageArrived, probably already exists")
          contact= await getContactByChatwootId(chatwootId, clientId)
        }
      }
    }
    const llmUsageType= await getUsageTypeDAOByName("LLM")
    if (!llmUsageType) throw new Error("No se encontró UsageType LLM")
  
    const client= await getClientDAO(clientId)
    if (!client) throw new Error("No se encontró Cliente")
  
    const llmUsage: UsageRecordFormValues= {
      agencyId: client.agencyId,
      clientId: client.id,
      usageTypeId: llmUsageType.id,
      credits: 0,
      description: "Créditos de Conversación"    
    }
    const createdUsage= await createUsageRecord(llmUsage)
  
    const created= await prisma.conversation.create({
      data: {
        title: "Lead",
        type: DocumentType.LEAD,        
        phone,
        clientId,
        usageRecordId: createdUsage.id,
        chatwootConversationId,
        contactId: chatwootId ? contact?.id : undefined
      }
    })
    const message= await createMessage(created.id, role, text, tokens)
    return message   
  }
}

async function createMessage(conversationId: string, role: string, content: string, tokens?: number) {
  // Usamos una transacción para garantizar que ambas operaciones se completen juntas
  return await prisma.$transaction(async (tx) => {
    // Crear el mensaje
    const message = await tx.message.create({
      data: {
        role,
        content,
        conversationId,      
        tokens,
      }
    });

    // Actualizar lastMessageAt en la conversación
    await tx.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date()
      }
    });

    return message;
  });
}

export async function processMessage(id: string) {
  const message= await prisma.message.findUnique({
    where: {
      id
    },
    include: {
      conversation: {
        include: {
          // messages: {
          //   orderBy: {
          //     createdAt: 'asc',
          //   },
          // },
          client: true,
          contact: {
            include: {
              stage: true
            }
          }
        }
      }
    }
  })
  if (!message) throw new Error("Message not found")

  const conversation= message.conversation

  const stage= conversation.contact?.stage
  if (stage && !stage.isBotEnabled) {
    console.log("stage is not bot enabled, skipping")
    return
  }

  const client= conversation.client

  if (!client.leadPrompt) throw new Error("Client prompt not found")

  const generalContext= await getGeneralContext(conversation.id)
  const prompt= client.leadPrompt || ""
  const contactContext= await getContactContext(conversation.phone, client.id)
  const documentsContext= await getDocumentsContext(client.id)
  const context= generalContext + "\n\n" + prompt + "\n\n" + contactContext + documentsContext
  console.log("context", context)

  const repositories= await getRepositorysDAO(client.id)
  let tools= {}
  for (const repository of repositories) {
    const tool= await getToolFromDatabase(repository.id)
    console.log("Tool of:", repository.name)
    tools= {
      ...tools,
      ...tool
    }
  }
  console.log("tools count:", Object.keys(tools).length)
  
  const dbMessages= await getConversationDbMessages(conversation.id)

  console.log("messages.count: " + dbMessages.length)
  console.log(dbMessages)
  
  const result= await generateText({
    model: openai('gpt-4o'),
    messages: dbMessages,
    tools: {
      ...leadTools,
      ...tools
    },
    system: context,
    onStepFinish: async (event) => {
      console.log("onStepFinish");
      await saveToolCallResponse(event, conversation.id);
    },
    maxSteps: 5
  })

  const usage= result.usage
  const text= result.text

  await saveLLMResponse(text, result.finishReason, usage, conversation.id)

  const chatwootAccountId= await getChatwootAccountId(client.id)
  if (!chatwootAccountId) throw new Error("Chatwoot accountId not found")
  if (!conversation.chatwootConversationId) throw new Error("Chatwoot conversationId not found")
  await sendTextToConversation(chatwootAccountId, conversation.chatwootConversationId, text)


}

export async function getLastConversationByContactId(contactId: string, clientId: string) {
  const found= await prisma.conversation.findFirst({
    where: {
      contactId,
      clientId
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return found
}


export async function sendMessageToContact(clientId: string, contact: ContactDAO, message: string, tags: string[], moveToStageId: string | null, by: string) {
  const phone= contact.phone
  if (!phone) throw new Error("Contacto no tiene teléfono")

  console.log("phone: ", phone)
  const chatwootAccountId= await getChatwootAccountId(clientId)
  if (!chatwootAccountId) throw new Error("Chatwoot account not found")
  console.log("chatwootAccountId: ", chatwootAccountId)

  let chatwootConversationId= undefined
  let conversation= await getLastConversationByContactId(contact.id, clientId)
  if (!conversation) {
    console.log("no conversation found, creating new one on chatwoot")
    const whatsappInstance= await getWhatsappInstance(clientId)
    if (!whatsappInstance) throw new Error("Whatsapp instance not found")
    if (!whatsappInstance.whatsappInboxId) throw new Error("Whatsapp inbox not found")
    if (!contact.chatwootId) throw new Error("Chatwoot contact not found")
    chatwootConversationId= await createChatwootConversation(Number(chatwootAccountId), whatsappInstance.whatsappInboxId, contact.chatwootId)
    if (!chatwootConversationId) throw new Error("Chatwoot conversation not found")
  } else {
    console.log("conversation found, using it")
    chatwootConversationId= conversation.chatwootConversationId
  }

  console.log("chatwootConversationId: ", chatwootConversationId)
  const assistantMessage= "Información del sistema: Se le ha enviado al usuario el siguiente mensaje:\n\n" + message
  const messageCreated= await messageArrived(phone, assistantMessage, clientId, "assistant", undefined, chatwootConversationId || undefined, Number(contact.chatwootId))
    
  if (!chatwootConversationId) throw new Error("Chatwoot conversation not found")

  await sendTextToConversation(Number(chatwootAccountId), chatwootConversationId, message)

  if (tags.length > 0) {
    await addTagsToContact(contact.id, tags, by)
  }

  if (moveToStageId) {
    console.log("setting new stage to contact, by: " + by)
    await setNewStage(contact.id, moveToStageId, by)
  }

  return messageCreated.conversationId
}

export async function removeContactFromAllConversations(contactId: string, clientId: string) {
  await prisma.conversation.updateMany({
    where: {
      contactId,
      clientId
    },
    data: {
      contactId: null,
      chatwootConversationId: null
    }
  })
}

export async function getLastChatwootConversationId(contactId: string) {
  const conversation= await prisma.conversation.findFirst({
    where: {
      contactId,
      chatwootConversationId: {
        not: null
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return conversation?.chatwootConversationId
}

export async function getActiveConversationByChatwootConversationId(chatwootConversationId: number, clientId: string) {
  // 24 hours
  let sessionTimeInMinutes= 1440
    
  const found = await prisma.conversation.findFirst({
    where: {
      chatwootConversationId,
      clientId,        
      closed: false,
      lastMessageAt: {
        gte: new Date(Date.now() - sessionTimeInMinutes * 60 * 1000)
      }
    },
    orderBy: {
      lastMessageAt: 'desc', // Ordenamos por la última interacción
    },
    include: {
      client: true,
      contact: {
        include: {
          stage: true
        }
      }
    }
  });

  return found;
}

export type ConversationShortDAO = {
  id: string
  lastMessageAt: Date
  phone: string
  name: string
  imageUrl: string
}

export async function getConversationsShortOfClient(clientId: string): Promise<ConversationShortDAO[]> {
  const found = await prisma.conversation.findMany({
    where: {
      clientId
    },
    orderBy: {
      lastMessageAt: 'desc',
    },
    select: {
      id: true,
      lastMessageAt: true,
      phone: true,
      name: true,
      imageUrl: true,
    },
    take: 500
  })

  return found as ConversationShortDAO[]
}
