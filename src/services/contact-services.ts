import { prisma } from "@/lib/db"
import { ApiError } from "@figuro/chatwoot-sdk"
import { ContactEventType } from "@prisma/client"
import * as z from "zod"
import { assignConversationToAgent, createChatwootConversation, createContactInChatwoot, deleteContactInChatwoot } from "./chatwoot"
import { getChatwootAccountId, getSlugsByClientId, getWhatsappInstance } from "./client-services"
import { getComercialDAO } from "./comercial-services"
import { createContactEvent } from "./contact-event-services"
import { createContactConversation, getLastChatwootConversationId, getLastConversationByContactId, removeContactFromAllConversations, sendMessageToContact } from "./conversation-services"
import { getImportedContactByChatwootId } from "./imported-contacts-services"
import { createDefaultStages, getFirstStageOfClient, getStageByName, StageDAO } from "./stage-services"
import { IndicatorStats } from "@/components/indicator-card"

export type ContactDAO = {
	id: string
	chatwootId: string | undefined | null
	name: string
	phone: string | undefined | null
	imageUrl: string | null
	tags: string[]
	src: string
	order: number
	clientId: string
	stageId: string
	comercialId: string | null
	createdAt: Date
	updatedAt: Date
}

export type ContactDAOWithStage = ContactDAO & {
	stage: StageDAO
}

export const contactSchema = z.object({
	chatwootId: z.string().optional(),
	name: z.string().min(1, "name is required."),
	phone: z.string().optional(),
	imageUrl: z.string().optional(),
	src: z.string().min(1, "src is required."),
	clientId: z.string().min(1, "clientId is required."),
})

export type ContactFormValues = z.infer<typeof contactSchema>


export async function getContactsDAO(clientId: string) {
  const found = await prisma.contact.findMany({
    where: {
      clientId
    },
    orderBy: {
      id: 'asc'
    },
    include: {
			stage: true,
		}
  })
  return found as ContactDAO[]
}

export async function getContactDAO(id: string) {
  const found = await prisma.contact.findUnique({
    where: {
      id
    },
    include: {
			stage: true,
		}
  })
  return found as ContactDAO
}
    
export async function createContact(data: ContactFormValues) {

  // check if contact already exists
  const existingContact= await getContactByChatwootId(data.chatwootId || "", data.clientId)
  if (existingContact) {
    const updated= await updateContact(existingContact.id, data)
    return updated
  }

  console.log("createContact: ", data)

  let firstStage= await getFirstStageOfClient(data.clientId)
  let tags: string[]= []
  const importedContact= await getImportedContactByChatwootId(data.chatwootId || "")
  if (importedContact) {
    const stageName= importedContact.stageName
    const stage= await getStageByName(data.clientId, stageName || "")
    if (stage) {
      firstStage= stage
    }
    tags= importedContact.tags || []
  }
  
  if (!firstStage){
    console.log('No first stage found, creating default stages')
    await createDefaultStages(data.clientId)
    firstStage= await getFirstStageOfClient(data.clientId)
  }

  if (!firstStage) throw new Error('No se encontró el stage inicial. Verifica que existan stages para este cliente')    

  // Verificar que el stage pertenezca al cliente correcto
  const stageExists = await prisma.stage.findFirst({
    where: {
      id: firstStage.id,
      clientId: data.clientId
    }
  })
  
  if (!stageExists) throw new Error('El stage no existe')

  const minOrder = await getMinOrderOfStage(firstStage.id)

  const created = await prisma.contact.create({
    data: {
      ...data,
      stageId: firstStage.id,
      order: minOrder - 1,
      tags
    },
    include: {
			stage: true,
		},
  })
  if (!created) throw new Error('Error creating contact')
  await createContactEvent(ContactEventType.CREATED, undefined, undefined, created.id)

  if (importedContact) {
    const stageName= importedContact.stageName
    const stage= await getStageByName(data.clientId, stageName || "")
    if (stage) {
      await createContactEvent(ContactEventType.MOVED_TO_STAGE, stage.name, "Import-"+importedContact.type, created.id)
    }
    if (tags.length > 0) {
      for (const tag of tags) {
        await createContactEvent(ContactEventType.TAGGED, tag, "Import-"+importedContact.type, created.id)
      }
    }
  }

  return created
}

export async function getOrCreateContact(clientId: string, phone: string, name: string) {
  let contact= await getContactByPhone(phone, clientId)

  if (contact) {
    return contact
  }

  const whatsappInstance= await getWhatsappInstance(clientId)
  if (!whatsappInstance) throw new Error("Whatsapp instance not found")
  if (!whatsappInstance.whatsappInboxId) throw new Error("Whatsapp inbox not found")

  const chatwootContact= await createContactInChatwoot(Number(whatsappInstance.chatwootAccountId), Number(whatsappInstance.whatsappInboxId), phone, name)
  if (!chatwootContact.id) throw new Error("Error al crear el contacto en Chatwoot")
  
  const maxRetries= 5
  let retries= 1
  while (retries <= maxRetries) {
    // sleep 1 second
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("buscando contacto en la base de datos, intento: ", retries)
    contact= await getContactByPhone(phone, clientId)
    if (contact) {
      return contact
    }
    retries++
  }

  throw new Error("No se encontró el contacto en la base de datos con el teléfono " + phone)
}
export async function getMinOrderOfStage(stageId: string) {
  const found = await prisma.contact.findFirst({
    where: {
      stageId
    },  
    orderBy: {
      order: 'asc'
    }
  })
  return found?.order || 0
}
export async function updateContact(id: string, data: ContactFormValues) {
  const updated = await prisma.contact.update({
    where: {
      id
    },
    data,
    include: {
			stage: true,
		},
  })
  if (!updated) throw new Error("Error al actualizar el contacto")

  // find the las conversation of the contact and update the contact name and imageUrl
  const lastConversation= await getLastConversationByContactId(id, data.clientId)
  if (lastConversation) {
    await prisma.conversation.update({
      where: { id: lastConversation.id },
      data: { name: data.name, imageUrl: data.imageUrl }
    })
  }
  
  return updated
}

export async function deleteContact(id: string) {
  const contact = await getContactDAO(id)
  if (!contact) throw new Error("Contact not found")

  const chatwootAccountId = await getChatwootAccountId(contact.clientId)
  if (!chatwootAccountId) throw new Error("Chatwoot account not found")

  const chatwootContactId= contact.chatwootId
  if (chatwootContactId && !isNaN(Number(chatwootContactId))) {
    console.log("deleting contact in chatwoot: ", chatwootContactId)
    // catch  Internal error: ApiError: Contact not found
    try {
      await deleteContactInChatwoot(Number(chatwootAccountId), Number(chatwootContactId))
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        console.log("Contact not found in chatwoot, skipping deletion")
      } else {
        console.error("Error deleting contact in chatwoot: ", error)
        throw error
      }
    }
  }

  await removeContactFromAllConversations(contact.id, contact.clientId)

  const deleted = await prisma.contact.delete({
    where: {
      id
    },
    include: {
			stage: true,
		}
  })
  return deleted
}
    

export async function getFullContactsDAO() {
  const found = await prisma.contact.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			client: true,
			stage: true,
		}
  })
  return found as ContactDAO[]
}
  
export async function getFullContactDAO(id: string) {
  const found = await prisma.contact.findUnique({
    where: {
      id
    },
    include: {
			client: true,
			stage: true,
		}
  })
  return found as ContactDAO
}
    
export async function getContactByChatwootId(chatwootId: string, clientId: string) {
  const found = await prisma.contact.findFirst({
    where: {
      chatwootId,
      clientId
    }
  })
  return found
}

export async function getContactsByStage(stageId: string) {
  const found = await prisma.contact.findMany({
    where: {
      stageId
    }
  })
  return found
}

export async function updateStageContacts(contacts: ContactDAO[]) {
  try {
    // Verificar que todos los stages existan y pertenezcan al cliente correcto
    for (const contact of contacts) {
      const stage = await prisma.stage.findFirst({
        where: {
          id: contact.stageId,
          clientId: contact.clientId
        }
      })
      
      if (!stage) {
        throw new Error(`El stage ${contact.stageId} no existe o no pertenece al cliente del contacto ${contact.id}`)
      }
    }

    const transaction= contacts.map((contact) => 
      prisma.contact.update({
        where: { 
          id: contact.id,
          stage: {
            clientId: contact.clientId
          }
        },
        data: { 
          order: contact.order,
          stageId: contact.stageId
        }
      })
    )
    const updated = await prisma.$transaction(transaction)
    return updated
  } catch (error) {
    console.error(error)
    throw "Error al reordenar los contactos"
  }
}

export async function setNewStage(contactId: string, stageId: string, by: string | undefined) {
  // Verificar que el contacto y stage existan y pertenezcan al mismo cliente
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    include: { client: true }
  })
  
  if (!contact) throw new Error("Contacto no encontrado")

  const stage = await prisma.stage.findFirst({
    where: {
      id: stageId,
      clientId: contact.clientId
    }
  })

  if (!stage) throw new Error("El stage no existe o no pertenece al cliente del contacto")

  // get the first order and then substract one
  const firstOrder= await getMinOrderOfStage(stageId)
  const order= firstOrder - 1
  const updated= await prisma.contact.update({
    where: {
      id: contactId
    },
    data: {
      stageId,
      order
    },
    include: {
      stage: true,
    }
  })
  if (!updated) throw new Error("Error al actualizar el estado del contacto")

  await createContactEvent(ContactEventType.MOVED_TO_STAGE, updated.stage.name, by, contactId)
  return updated
}

export async function getContactByPhone(phone: string, clientId: string) {
  const found = await prisma.contact.findFirst({
    where: {
      phone,
      clientId
    },
    include: {
      stage: true,
    }
  })
  return found
}

export async function getTagsOfContact(contactId: string) {
  const contact= await getContactDAO(contactId)
  return contact?.tags || []
}

export async function setTagsOfContact(contactId: string, tags: string[], by: string | undefined) {
  console.log("setting tags: ", tags)
  const contact= await getContactDAO(contactId)
  const contactTags= contact?.tags || []
  const updated= await prisma.contact.update({
    where: { id: contactId },
    data: { tags }
  })
  if (updated) {
    manageContactEvent(contactId, contactTags, tags, by)
  }
  return updated
}

async function manageContactEvent(contactId: string, contactTags: string[], newTags: string[], by: string | undefined) {
  const addedTags= newTags.filter((tag) => !contactTags.includes(tag))
  const removedTags= contactTags.filter((tag) => !newTags.includes(tag))
  if (addedTags.length > 0) {
    console.log("addedTags: ", addedTags)
    createContactEvent(ContactEventType.TAGGED, addedTags.join(","), by, contactId)
  }
  if (removedTags.length > 0) {
    console.log("removedTags: ", removedTags)
    createContactEvent(ContactEventType.UNTAGGED, removedTags.join(","), by, contactId)
  }
}

export async function addTagsToContact(contactId: string, tags: string[], by: string | undefined) {
  const contact= await getContactDAO(contactId)
  const contactTags= contact?.tags || []
  console.log("contactTags: ", contactTags)
  // add tags if not already in contact tags
  const newTags= tags.filter((tag) => !contactTags.includes(tag))
  console.log("newTags: ", newTags)
  const updated= await prisma.contact.update({
    where: { id: contactId },
    data: { tags: [...contactTags, ...newTags] }
  })
  if (!updated) throw new Error("Error al actualizar las etiquetas del contacto")

  newTags.forEach((tag) => {
    createContactEvent(ContactEventType.TAGGED, tag, by, contactId)
  })

  return updated
}

export async function getStageByContactId(contactId: string) {
  const contact= await prisma.contact.findUnique({
    where: { id: contactId },
    include: { stage: true }
  })
  if (!contact) throw new Error("Contact not found")

  return contact.stage.name
}

export async function getFilteredContacts(clientId: string, from: Date | null, to: Date | null, tags: string[], stageId: string | undefined, comercialId?: string): Promise<ContactDAOWithStage[]> {
  const found = await prisma.contact.findMany({
    where: {
      clientId,
      name: {
        not: 'WRC'
      },
      updatedAt: {
        gte: from || undefined,
        lte: to || undefined
      },
      tags: tags.length > 0 ? {
        hasSome: tags
      } : undefined,
      stageId: stageId,
      comercialId: comercialId
    },
    include: {
      stage: true,
    },
    orderBy: {
      id: "desc"
    }
  })
  return found
}

// esta función se encarga de buscar un contacto por el número de teléfono y el cliente
// si existe el contacto, debe buscar la última conversación del contacto en la base de datos y devolver el chatwootConversationId
// si no encuentra un contacto, lo crea tanto en Chatwoot como en la base de datos, además debe crear una conversación en Chatwoot y una conversación en la base de datos
export async function getLastChatwootConversationIdByPhoneNumber(phone: string, clientId: string) {
  const contact= await getContactByPhone(phone, clientId)
  if (!contact) {
    const whatsappInstance= await getWhatsappInstance(clientId)
    if (!whatsappInstance) throw new Error("Whatsapp instance not found")
    if (!whatsappInstance.whatsappInboxId) throw new Error("Whatsapp inbox not found")
    const name= "Destinatario FC"
    // create contact in chatwoot
    const chatwootContact= await createContactInChatwoot(Number(whatsappInstance.chatwootAccountId), Number(whatsappInstance.whatsappInboxId), phone, name)
    if (!chatwootContact.id) throw new Error("Error al crear el contacto en Chatwoot")

    // Verificar si ya existe un contacto con este chatwootId
    const existingContact = await prisma.contact.findFirst({
      where: {
        chatwootId: String(chatwootContact.id),
        clientId
      }
    })

    let dbContact
    if (existingContact) {
      // Si existe, actualizamos el teléfono si es necesario
      if (existingContact.phone !== phone) {
        dbContact = await prisma.contact.update({
          where: { id: existingContact.id },
          data: { phone }
        })
      } else {
        dbContact = existingContact
      }
    } else {
      // Si no existe, creamos uno nuevo
      const contactValues: ContactFormValues= {
        chatwootId: String(chatwootContact.id),
        name,
        phone,
        src: "destinatario FC",
        clientId
      }
      dbContact = await createContact(contactValues)
    }

    if (!dbContact) throw new Error("Error al gestionar el contacto en la base de datos")

    // create conversation in chatwoot
    const chatwootConversationId= await createChatwootConversation(Number(whatsappInstance.chatwootAccountId), whatsappInstance.whatsappInboxId, chatwootContact.id)
    if (!chatwootConversationId) throw new Error("Error al crear la conversación en Chatwoot")

    // create conversation in database
    const createdConversation= await createContactConversation(clientId, dbContact, chatwootConversationId)
    if (!createdConversation) throw new Error("Error al crear la conversación en la base de datos")

    return chatwootConversationId
  } else {
    // get the last conversation of the contact
    const lastConversation= await getLastConversationByContactId(contact.id, clientId)
    if (!lastConversation) throw new Error("Error al obtener la última conversación del contacto")

    return lastConversation.chatwootConversationId
  }
}

export async function assignContactToComercial(id: string, comercialId: string) {
  const contact= await getContactDAO(id)
  if (!contact) throw new Error("Contacto no encontrado")
  if (contact.comercialId) {
    console.log("contact already has a comercial assigned")
    return contact
  }

  if (contact.src === "simulador"){
    console.log("contact is a simulator, skipping assignment")
    return contact
  }

  const whatsappInstance= await getWhatsappInstance(contact.clientId)
  if (!whatsappInstance) throw new Error("Instancia de WhatsApp no encontrada")

  const lastChatwootConversationId= await getLastChatwootConversationId(contact.id)
  if (!lastChatwootConversationId) throw new Error("Última conversación de Chatwoot no encontrada")

  const comercial= await getComercialDAO(comercialId)
  if (!comercial) throw new Error("Comercial no encontrado")
  const chatwootUserId= comercial.chatwootUserId
  if (!chatwootUserId) throw new Error("Usuario de Chatwoot del comercial no encontrado")
  await assignConversationToAgent(Number(whatsappInstance.chatwootAccountId), Number(lastChatwootConversationId), chatwootUserId)

  const updated= await prisma.contact.update({
    where: { 
      id,
    },
    data: { 
      comercialId 
    }
  })

  // update comercial lastAssignedAt
  await prisma.comercial.update({
    where: { id: comercialId },
    data: { lastAssignedAt: new Date() }
  })

  // check and notify comercial if notifyAssigned is true
  if (comercial.notifyAssigned && comercial.phone) {
    const comercialContact= await getOrCreateContact(comercial.clientId, comercial.phone, comercial.user.name || "Usuario sin nombre")
    if (comercialContact && contact.phone) {
        console.log("contact found: ", comercialContact.name + " " + comercialContact.phone)
        const message= await getMessageToNotifyComercial(contact.phone, comercial.clientId)
        await sendMessageToContact(comercial.clientId, comercialContact, message, [], null, "Contact Assign")
        console.log("message sent to contact: ", comercialContact.name)
    } else {
        console.log("contact not found on notify comercial")
    }
  }
  return updated
}

async function getMessageToNotifyComercial(phone: string, clientId: string) {
  const slugs= await getSlugsByClientId(clientId)
  if (!slugs) throw new Error("Slugs not found")
  const basePath= process.env.NEXTAUTH_URL
  const url= `${basePath}/${slugs.agencySlug}/${slugs.clientSlug}/whatsapp/crm?phone=${phone}`
  return `Se te ha asignado un nuevo contacto: ${url}`
}

