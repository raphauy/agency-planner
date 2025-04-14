"use server"
  
import { getCurrentUser } from "@/lib/utils"
import { createContactEvent, getContactEventsDAO } from "@/services/contact-event-services"
import { ContactDAO, ContactFormValues, createContact, deleteContact, getContactDAO, getContactsByStage, getStageByContactId, getTagsOfContact, assignContactToComercial, setTagsOfContact, updateContact, updateStageContacts } from "@/services/contact-services"
import { getRepoDataCount } from "@/services/repodata-services"
import { getClientTags } from "@/services/repository-services"
import { ContactEventType } from ".prisma/client"
import { revalidatePath } from "next/cache"

export async function getContactDAOAction(id: string): Promise<ContactDAO | null> {
    return getContactDAO(id)
}

export async function createOrUpdateContactAction(id: string | null, data: ContactFormValues): Promise<ContactDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateContact(id, data)
        const user= await getCurrentUser()
        const by= user?.name || user?.email || ""
        if (user) {
          await createContactEvent(ContactEventType.EDITED, undefined, by, id)
        }
      
    } else {
        updated= await createContact(data)
    }     

    revalidatePath("/client/[slug]/crm", "page")

    return updated as ContactDAO
}

export async function deleteContactAction(id: string): Promise<ContactDAO | null> {    
    const deleted= await deleteContact(id)

    revalidatePath("/client/[slug]/crm", "page")

    return deleted as ContactDAO
}

export async function deleteContactBulkAction(ids: string[]) {
    for (const id of ids) {
        await deleteContact(id)
    }
    revalidatePath("/client/[slug]/crm", "page")
}

export async function getContactsByStageAction(stageId: string) {
    return getContactsByStage(stageId)
}

export async function updateStageContactsAction(contacts: ContactDAO[]) {
    const updated= await updateStageContacts(contacts)

    revalidatePath("/client/[slug]/crm", "page")

    return updated
}

export async function getTagsOfContactAction(contactId: string) {
    return getTagsOfContact(contactId)
}

export async function setTagsOfContactAction(contactId: string, tags: string[]) {
    const user= await getCurrentUser()
    const byUser= user?.name || user?.email || undefined
  
    const updated= await setTagsOfContact(contactId, tags, byUser)

    console.log("tags:", tags)
    
    revalidatePath("/client/[slug]/crm", "page")

    return updated
}

export async function getContactEventsAction(contactId: string) {
    return getContactEventsDAO(contactId)
}

export async function getStageByContactIdAction(contactId: string): Promise<string> {
    return getStageByContactId(contactId)
}

export async function getAllTagsAction(clientId: string): Promise<string[]> {
    return getClientTags(clientId)
}

export async function createMovedToStageEventAction(contactId: string, stageName: string) {
    const user= await getCurrentUser()
    const byUser= user?.name || user?.email || undefined
    return createContactEvent(ContactEventType.MOVED_TO_STAGE, stageName, byUser, contactId)
}

export async function getRepoDataCountAction(contactId: string) {
    return getRepoDataCount(contactId)
}

export async function asignarContactoAction(contactId: string, comercialId: string) {
    const resp= await assignContactToComercial(contactId, comercialId)
    revalidatePath("/client/[slug]/crm", "page")
    return resp
}