"use server"
  
import { revalidatePath } from "next/cache"
import { PublicationDAO, PublicationFormValues, createPublication, updatePublication, getFullPublicationDAO, deletePublication, updatePublicationStatus, addListener, removeListener } from "@/services/publication-services"
import { PublicationStatus } from "@prisma/client"


export async function getPostDAOAction(id: string): Promise<PublicationDAO | null> {
    return getFullPublicationDAO(id)
}

export async function createOrUpdatePostAction(id: string | null, data: PublicationFormValues): Promise<PublicationDAO | null> {       
    let updated= null
    if (id) {
        updated= await updatePublication(id, data)
    } else {
        updated= await createPublication(data)
    }     

    revalidatePath("/[agencySlug]/[clientSlug]", "page")

    return updated as PublicationDAO
}

export async function deletePostAction(id: string): Promise<PublicationDAO | null> {    
    const deleted= await deletePublication(id)

    revalidatePath("/[agencySlug]/[clientSlug]", "page")

    return deleted as PublicationDAO
}

export async function updatePublicationStatusAction(id: string, status: PublicationStatus): Promise<boolean>{  
    const updated= await updatePublicationStatus(id, status)
    
    revalidatePath("/[agencySlug]/[clientSlug]", "page")

    return updated
}

export async function addListenerAction(publicationId: string, userId: string): Promise<boolean> {
    const updated= await addListener(publicationId, userId)

    if (!updated) return false

    revalidatePath("/[agencySlug]/[clientSlug]", "page")

    return true
}

export async function removeListenerAction(publicationId: string, userId: string): Promise<boolean> {
    const updated= await removeListener(publicationId, userId)

    if (!updated) return false

    revalidatePath("/[agencySlug]/[clientSlug]", "page")

    return true
}