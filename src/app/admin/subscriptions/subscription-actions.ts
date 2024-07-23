"use server"
  
import { SubscriptionDAO, deleteSubscription, getFullSubscriptionDAO } from "@/services/subscription-services"
import { revalidatePath } from "next/cache"


export async function getSubscriptionDAOAction(id: string): Promise<SubscriptionDAO | null> {
    return getFullSubscriptionDAO(id)
}

export async function deleteSubscriptionAction(id: string): Promise<SubscriptionDAO | null> {    
    const deleted= await deleteSubscription(id)

    revalidatePath("/admin/subscriptions")

    return deleted as SubscriptionDAO
}

