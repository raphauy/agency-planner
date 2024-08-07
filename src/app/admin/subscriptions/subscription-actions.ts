"use server"
  
import { ShortSubscriptionFormValues, SubscriptionDAO, deleteSubscription, getFullSubscriptionDAO, updateShortSubscription } from "@/services/subscription-services"
import { revalidatePath } from "next/cache"


export async function getSubscriptionDAOAction(id: string): Promise<SubscriptionDAO | null> {
    return getFullSubscriptionDAO(id)
}

export async function deleteSubscriptionAction(id: string): Promise<SubscriptionDAO | null> {    
    const deleted= await deleteSubscription(id)

    revalidatePath("/admin/subscriptions")

    return deleted as SubscriptionDAO
}

export async function updateShortSubscriptionAction(id: string, data: ShortSubscriptionFormValues): Promise<SubscriptionDAO | null> {    
    const updated= await updateShortSubscription(id, data)

    revalidatePath("/admin/subscriptions")

    return updated as SubscriptionDAO
}