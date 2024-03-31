"use server"
  
import { revalidatePath } from "next/cache"

import { getCurrentAgencySlug } from "@/lib/utils"
import { changeClientUserPermission } from "@/services/user-services"
import { changeClientChannelPermission } from "@/services/channel-services"
    

export async function changeClientUserPermissionAction(userId: string, clientId: string) {
    const res= await changeClientUserPermission(userId, clientId)

    const agencySlug= await getCurrentAgencySlug()
    revalidatePath(`/${agencySlug}/permissions`)

    return res
}

export async function changeClientChannelPermissionAction(channelId: string, clientId: string) {
    const res= await changeClientChannelPermission(channelId, clientId)

    const agencySlug= await getCurrentAgencySlug()
    revalidatePath(`/${agencySlug}/permissions`)

    return res
}