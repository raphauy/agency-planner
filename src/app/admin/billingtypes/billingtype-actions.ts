"use server"
  
import { revalidatePath } from "next/cache"
import { BillingTypeDAO, BillingTypeFormValues, createBillingType, updateBillingType, getFullBillingTypeDAO, deleteBillingType } from "@/services/billingtype-services"


export async function getBillingTypeDAOAction(id: string): Promise<BillingTypeDAO | null> {
    return getFullBillingTypeDAO(id)
}

export async function createOrUpdateBillingTypeAction(id: string | null, data: BillingTypeFormValues): Promise<BillingTypeDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateBillingType(id, data)
    } else {
        updated= await createBillingType(data)
    }     

    revalidatePath("/admin/billingtypes")

    return updated as BillingTypeDAO
}

export async function deleteBillingTypeAction(id: string): Promise<BillingTypeDAO | null> {    
    const deleted= await deleteBillingType(id)

    revalidatePath("/admin/billingtypes")

    return deleted as BillingTypeDAO
}

