"use server"
  
import { revalidatePath } from "next/cache"
import { AudienceDAO, AudienceFormValues, createAudience, updateAudience, getAudienceDAO, deleteAudience } from "@/services/audience-services"


export async function getAudienceDAOAction(id: string): Promise<AudienceDAO | null> {
    return getAudienceDAO(id)
}

export async function createOrUpdateAudienceAction(id: string | null, data: AudienceFormValues): Promise<AudienceDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateAudience(id, data)
    } else {
        updated= await createAudience(data)
    }     

    revalidatePath("/newsletter/audiences")

    return updated as AudienceDAO
}

export async function deleteAudienceAction(id: string): Promise<AudienceDAO | null> {    
    const deleted= await deleteAudience(id)

    revalidatePath("/newsletter/audiences")

    return deleted as AudienceDAO
}

