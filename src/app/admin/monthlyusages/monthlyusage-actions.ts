"use server"
  
import { revalidatePath } from "next/cache"
import { MonthlyUsageDAO, MonthlyUsageFormValues, createMonthlyUsage, updateMonthlyUsage, getFullMonthlyUsageDAO, deleteMonthlyUsage } from "@/services/monthlyusage-services"


export async function getMonthlyUsageDAOAction(id: string): Promise<MonthlyUsageDAO | null> {
    return getFullMonthlyUsageDAO(id)
}

export async function createOrUpdateMonthlyUsageAction(id: string | null, data: MonthlyUsageFormValues): Promise<MonthlyUsageDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateMonthlyUsage(id, data)
    } else {
        updated= await createMonthlyUsage(data)
    }     

    revalidatePath("/admin/monthlyUsages")

    return updated as MonthlyUsageDAO
}

export async function deleteMonthlyUsageAction(id: string): Promise<MonthlyUsageDAO | null> {    
    const deleted= await deleteMonthlyUsage(id)

    revalidatePath("/admin/monthlyUsages")

    return deleted as MonthlyUsageDAO
}

