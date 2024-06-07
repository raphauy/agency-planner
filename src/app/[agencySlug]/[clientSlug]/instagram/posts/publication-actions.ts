"use server"
  
import { revalidatePath } from "next/cache"
import { PublicationDAO, PublicationFormValues, createPublication, updatePublication, getFullPublicationDAO, deletePublication } from "@/services/publication-services"


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

    revalidatePath("/[clientSlug]/publications")

    return updated as PublicationDAO
}

export async function deletePostAction(id: string): Promise<PublicationDAO | null> {    
    const deleted= await deletePublication(id)

    revalidatePath("/[clientSlug]/publications")

    return deleted as PublicationDAO
}

