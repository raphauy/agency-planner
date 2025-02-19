"use server"
  
import { revalidatePath } from "next/cache"
import { AudienceDAO, AudienceFormValues, createAudience, updateAudience, getAudienceDAO, deleteAudience, addContactsToAudience, CSVContact, getDuplicateEmails, getOtherAudiencesDAO } from "@/services/audience-services"
import { EmailContactDAO, SimpleEmailContactDAO, getAudienceContactsDAO } from "@/services/emailcontact-services"

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

export async function addContactsToAudienceAction(audienceId: string, contacts: CSVContact[]): Promise<number> {
    const ignoredContacts= await addContactsToAudience(audienceId, contacts)
    revalidatePath("/newsletter/audiences")
    return ignoredContacts
}

export async function getDuplicateEmailsAction(audienceId: string, contacts: string[]): Promise<string[]> {
    return getDuplicateEmails(audienceId, contacts)
}

export async function getOtherAudiencesDAOAction(id: string): Promise<AudienceDAO[]>{
    return getOtherAudiencesDAO(id)
}

export async function getAudienceContactsDAOAction(audienceId: string): Promise<SimpleEmailContactDAO[]>{
    return getAudienceContactsDAO(audienceId)
}