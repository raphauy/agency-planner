"use server"
  
import { revalidatePath } from "next/cache"
import { UsageTypeDAO, UsageTypeFormValues, createUsageType, updateUsageType, getFullUsageTypeDAO, deleteUsageType } from "@/services/usagetype-services"


export async function getUsageTypeDAOAction(id: string): Promise<UsageTypeDAO | null> {
    return getFullUsageTypeDAO(id)
}

export async function createOrUpdateUsageTypeAction(id: string | null, data: UsageTypeFormValues): Promise<UsageTypeDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateUsageType(id, data)
    } else {
        updated= await createUsageType(data)
    }     

    revalidatePath("/admin/usagetypes")

    return updated as UsageTypeDAO
}

export async function deleteUsageTypeAction(id: string): Promise<UsageTypeDAO | null> {    
    const deleted= await deleteUsageType(id)

    revalidatePath("/admin/usagetypes")

    return deleted as UsageTypeDAO
}

