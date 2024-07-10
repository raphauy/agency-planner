"use server"
  
import { revalidatePath } from "next/cache"
import { UsageRecordDAO, UsageRecordFormValues, createUsageRecord, updateUsageRecord, getFullUsageRecordDAO, deleteUsageRecord } from "@/services/usagerecord-services"


export async function getUsageRecordDAOAction(id: string): Promise<UsageRecordDAO | null> {
    return getFullUsageRecordDAO(id)
}

export async function createOrUpdateUsageRecordAction(id: string | null, data: UsageRecordFormValues): Promise<UsageRecordDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateUsageRecord(id, data)
    } else {
        updated= await createUsageRecord(data)
    }     

    revalidatePath("/admin/usagerecords")

    return updated as UsageRecordDAO
}

export async function deleteUsageRecordAction(id: string): Promise<UsageRecordDAO | null> {    
    const deleted= await deleteUsageRecord(id)

    revalidatePath("/admin/usagerecords")

    return deleted as UsageRecordDAO
}

