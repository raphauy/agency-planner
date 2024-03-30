"use server"
  
import { revalidatePath } from "next/cache"
import { PilarDAO, PilarFormValues, createPilar, updatePilar, getFullPilarDAO, deletePilar } from "@/services/pilar-services"


export async function getPilarDAOAction(id: string): Promise<PilarDAO | null> {
    return getFullPilarDAO(id)
}

export async function createOrUpdatePilarAction(id: string | null, data: PilarFormValues): Promise<PilarDAO | null> {       
    let updated= null
    if (id) {
        updated= await updatePilar(id, data)
    } else {
        updated= await createPilar(data)
    }     

    revalidatePath("/[clientSlug]/pilars")

    return updated as PilarDAO
}

export async function deletePilarAction(id: string): Promise<PilarDAO | null> {    
    const deleted= await deletePilar(id)

    revalidatePath("/[clientSlug]/pilars")

    return deleted as PilarDAO
}

