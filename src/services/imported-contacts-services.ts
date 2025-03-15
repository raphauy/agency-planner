import { prisma } from "@/lib/db"
import { checkValidPhone } from "@/lib/utils"
import { ImportedContactStatus, ImportedContactType, WhatsappInstance } from "@prisma/client"
import * as z from "zod"
import { createContactInChatwoot as createChatwootContact } from "./chatwoot"

export type ImportedContactDAO = {
	id: string
	name: string
	phone: string
	tags: string[]
	stageName: string | undefined
	chatwootContactId: string | undefined
	status: ImportedContactStatus
	error: string | undefined
	type: ImportedContactType
	clientId: string
	createdAt: Date
	updatedAt: Date
}

export const importedContactSchema = z.object({
	name: z.string().min(1, "name is required."),
	phone: z.string().min(1, "phone is required."),
	stageName: z.string().optional(),
  tags: z.string().optional(),
  type: z.nativeEnum(ImportedContactType),
	clientId: z.string().min(1, "clientId is required."),
})

export type ImportedContactFormValues = z.infer<typeof importedContactSchema>


export async function getImportedContactsDAO(clientId: string) {
  const found = await prisma.importedContact.findMany({
    where: {
      clientId
    },
    orderBy: {
      id: 'desc'
    },
  })
  return found as ImportedContactDAO[]
}

export async function getImportedContactDAO(id: string) {
  const found = await prisma.importedContact.findUnique({
    where: {
      id
    },
  })
  return found as ImportedContactDAO
}
    
export async function createImportedContact(data: ImportedContactFormValues) {
  const tags= data.tags ? data.tags.split(",") : []
  const created = await prisma.importedContact.create({
    data: {
      ...data,
      tags: tags
    }
  })
  return created
}

export async function updateImportedContact(id: string, data: ImportedContactFormValues) {
  const tags= data.tags?.split(",") || []
  const updated = await prisma.importedContact.update({
    where: { id },
    data: {
      ...data,
      tags: tags
    }
  })
  return updated
}

export async function deleteImportedContact(id: string) {
  const deleted = await prisma.importedContact.delete({
    where: {
      id
    },
  })
  return deleted
}
    


export async function getFullImportedContactsDAO() {
  const found = await prisma.importedContact.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			client: true,
		}
  })
  return found as ImportedContactDAO[]
}
  
export async function getFullImportedContactDAO(id: string) {
  const found = await prisma.importedContact.findUnique({
    where: {
      id
    },
    include: {
			client: true,
		}
  })
  return found as ImportedContactDAO
}
    

export async function processPendingImportedContacts() {
  const timeStartInMillis= Date.now()
  const maxContacts= 300
  console.log(`Max contactos a procesar: ${maxContacts}`)
  const pendingContacts= await getPendingImportedContactsDAO(maxContacts)
  const totalToProcess= pendingContacts.length
  console.log(`Procesando ${totalToProcess} contactos pendientes...`)
  for (const contact of pendingContacts) {
    const client = contact.client
    // Limpiamos TODOS los caracteres no numéricos excepto el +
    const cleanPhone = contact.phone
        .replace(/[^\d+]/g, '')  // Elimina todo excepto dígitos y +
        .replace(/^\++/, '+')    // Reemplaza múltiples + al inicio con uno solo
        .trim()
    console.log(`cleanPhone después de limpieza: ${cleanPhone}`)
    const phone = cleanPhone.startsWith("+") ? cleanPhone : `+${cleanPhone}`
    console.log(`Teléfono procesado final: ${phone}`)
    const isPhoneValid = checkValidPhone(phone)
    if (!isPhoneValid) {
      console.log(`Número inválido: ${phone} de ${client.name}`)
      await updateError(contact.id, "Número inválido")
    } else {
      console.log(`Número válido: ${phone} de ${client.name}`)
      const whatsappInstance= client.whatsappInstances[0]
      if (!whatsappInstance) {
        console.log(`No se encontró configuración de Whatsapp para ${client.name}`)
        await updateError(contact.id, "No se encontró configuración de Whatsapp")
      } else {
        const chatwootId= await processValidPhone(contact.id, phone, contact.name, whatsappInstance)
        // if (chatwootId) {
        //   console.log(`ChatwootId: ${chatwootId}`)
        //   const contactValues: ContactFormValues= {
        //     chatwootId,
        //     name: contact.name,
        //     phone,
        //     src: contact.type,
        //     clientId: contact.clientId
        //   }
        //   await createContact(contactValues)
        // }
      }
    }
  }

  const toProcessLeft= await getPendingCount()
  const timeEndInMillis= Date.now()
  const timeElapsed= timeEndInMillis - timeStartInMillis
  console.log(`Tiempo de procesamiento en segundos: ${(timeElapsed / 1000).toFixed(2)}`)

  return toProcessLeft
}

async function processValidPhone(importedContactId: string, phone: string, name: string, whatsappInstance: WhatsappInstance) {

  try {
    const contactCreated= await createChatwootContact(Number(whatsappInstance.chatwootAccountId), Number(whatsappInstance.whatsappInboxId), phone, name)
    const chatwootContactId= String(contactCreated.id)
    if (chatwootContactId) {
      console.log(`Contacto creado en Chatwoot: ${chatwootContactId}`)
      await prisma.importedContact.update({
        where: { 
          id: importedContactId, 
          status: ImportedContactStatus.PENDIENTE 
        },
        data: {
          status: ImportedContactStatus.PROCESADO,
          chatwootContactId
        }
      })
      return chatwootContactId
    } else {
      console.log(`Error al crear contacto: ${contactCreated.error}`)
      await updateError(importedContactId, contactCreated.error || "Error al crear contacto")
    }
  } catch (error) {
    console.log(`Error al crear contacto: ${error}`)
    await updateError(importedContactId, "Error inesperado al crear contacto")
  }
  
}

async function updateError(id: string, error: string) {
  await prisma.importedContact.update({
    where: { id, status: ImportedContactStatus.PENDIENTE },
    data: {
      status: ImportedContactStatus.ERROR,
      error: error
    }
  })
}

export async function getPendingCount() {
  const found = await prisma.importedContact.count({
    where: {
      status: ImportedContactStatus.PENDIENTE
    }
  })
  return found
}
export async function getPendingImportedContactsDAO(maxContacts: number) {
  const found = await prisma.importedContact.findMany({
    where: {
      status: ImportedContactStatus.PENDIENTE
    },
    include: {
      client: {
        include: {
          whatsappInstances: true
        }
      }
    },
    take: maxContacts
  })
  return found
}

export async function getImportedContactByChatwootId(chatwootContactId: string) {
  const found = await prisma.importedContact.findFirst({
    where: {
      chatwootContactId
    }
  })
  return found
}

export function fireProcessPendingContactsAPI(): Promise<Response> {
  return fetch(`${process.env.NEXT_PUBLIC_URL}/api/process-pending-contacts`, {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.API_TOKEN}`
    }
  })
}
