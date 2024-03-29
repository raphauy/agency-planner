"use server"
  
import { revalidatePath } from "next/cache"

import { getCurrentAgencySlug } from "@/lib/utils"
import { changeClientUserPermission } from "@/services/user-services"
import { changeClientFunctionalityPermission } from "@/services/functionality-services"
    

export async function changeClientUserPermissionAction(userId: string, clientId: string) {
    const res= await changeClientUserPermission(userId, clientId)

    const agencySlug= await getCurrentAgencySlug()
    revalidatePath(`/${agencySlug}/permissions`)

    return res
}

export async function changeClientFunctionalityPermissionAction(functionalityId: string, clientId: string) {
    const res= await changeClientFunctionalityPermission(functionalityId, clientId)

    const agencySlug= await getCurrentAgencySlug()
    revalidatePath(`/${agencySlug}/permissions`)

    return res
}