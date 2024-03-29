"use server"
  
import { revalidatePath } from "next/cache"
import { FunctionalityDAO, FunctionalityFormValues, createFunctionality, updateFunctionality, deleteFunctionality, getFunctionalityDAO } from "@/services/functionality-services"


export async function getFunctionalityDAOAction(id: string): Promise<FunctionalityDAO | null> {
    return getFunctionalityDAO(id)
}

export async function createOrUpdateFunctionalityAction(id: string | null, data: FunctionalityFormValues): Promise<FunctionalityDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateFunctionality(id, data)
    } else {
        updated= await createFunctionality(data)
    }     

    revalidatePath("/admin/functionalitys")

    return updated as FunctionalityDAO
}

export async function deleteFunctionalityAction(id: string): Promise<FunctionalityDAO | null> {    
    const deleted= await deleteFunctionality(id)

    revalidatePath("/admin/functionalitys")

    return deleted as FunctionalityDAO
}

