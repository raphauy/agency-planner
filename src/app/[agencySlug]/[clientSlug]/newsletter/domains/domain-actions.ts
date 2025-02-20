"use server"
  
import { revalidatePath } from "next/cache"
import { DomainDAO, DomainFormValues, createDomain, updateDomain, getDomainDAO, deleteDomain } from "@/services/domain-services"


export async function getDomainDAOAction(id: string): Promise<DomainDAO | null> {
    return getDomainDAO(id)
}

export async function createOrUpdateDomainAction(id: string | null, data: DomainFormValues): Promise<DomainDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateDomain(id, data)
    } else {
        updated= await createDomain(data)
    }     

    revalidatePath("/newsletter/domains")

    return updated as DomainDAO
}

export async function deleteDomainAction(id: string): Promise<DomainDAO | null> {    
    const deleted= await deleteDomain(id)

    revalidatePath("/newsletter/domains")

    return deleted as DomainDAO
}

