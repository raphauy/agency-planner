"use server"
  
import { revalidatePath } from "next/cache"
import { BillableItemDAO, BillableItemFormValues, createBillableItem, updateBillableItem, getFullBillableItemDAO, deleteBillableItem } from "@/services/billableitem-services"


export async function getBillableItemDAOAction(id: string): Promise<BillableItemDAO | null> {
    return getFullBillableItemDAO(id)
}

export async function createOrUpdateBillableItemAction(id: string | null, data: BillableItemFormValues): Promise<BillableItemDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateBillableItem(id, data)
    } else {
        updated= await createBillableItem(data)
    }     

    revalidatePath("/admin/billableitems")

    return updated as BillableItemDAO
}

export async function deleteBillableItemAction(id: string): Promise<BillableItemDAO | null> {    
    const deleted= await deleteBillableItem(id)

    revalidatePath("/admin/billableitems")

    return deleted as BillableItemDAO
}

