"use server"
  
import { revalidatePath } from "next/cache"
import { ComercialDAO, ComercialFormValues, createComercial, updateComercial, getComercialDAO, deleteComercial, toggleComercialStatus, getComercialsDAO, getActiveComercialsDAO } from "@/services/comercial-services"


export async function getComercialDAOAction(id: string): Promise<ComercialDAO | null> {
    return getComercialDAO(id)
}

export async function getActiveComercialsDAOAction(clientId: string): Promise<ComercialDAO[]> {
    return getActiveComercialsDAO(clientId)
}

export async function createOrUpdateComercialAction(id: string | null, data: ComercialFormValues): Promise<ComercialDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateComercial(id, data)
    } else {
        updated= await createComercial(data)
    }     

    revalidatePath("/crm/comercials")

    return updated as ComercialDAO
}

export async function deleteComercialAction(id: string): Promise<ComercialDAO | null> {    
    const deleted= await deleteComercial(id)

    revalidatePath("/crm/comercials")

    return deleted as ComercialDAO
}

export async function toggleComercialStatusAction(id: string): Promise<boolean> {
    const updated= await toggleComercialStatus(id)
    revalidatePath("/crm/comercials")
    return updated
}