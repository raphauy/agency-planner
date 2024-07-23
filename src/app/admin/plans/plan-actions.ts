"use server"
  
import { revalidatePath } from "next/cache"
import { PlanDAO, PlanFormValues, createPlan, updatePlan, getFullPlanDAO, deletePlan } from "@/services/plan-services"

import { getComplentarySubscriptions, setSubscriptions} from "@/services/plan-services"
import { SubscriptionDAO } from "@/services/subscription-services"
    

export async function getPlanDAOAction(id: string): Promise<PlanDAO | null> {
    return getFullPlanDAO(id)
}

export async function createOrUpdatePlanAction(id: string | null, data: PlanFormValues): Promise<PlanDAO | null> {       
    let updated= null
    if (id) {
        updated= await updatePlan(id, data)
    } else {
        updated= await createPlan(data)
    }     

    revalidatePath("/admin/plans")

    return updated as PlanDAO
}

export async function deletePlanAction(id: string): Promise<PlanDAO | null> {    
    const deleted= await deletePlan(id)

    revalidatePath("/admin/plans")

    return deleted as PlanDAO
}
    
export async function getComplentarySubscriptionsAction(id: string): Promise<SubscriptionDAO[]> {
    const complementary= await getComplentarySubscriptions(id)

    return complementary as SubscriptionDAO[]
}

export async function setSubscriptionsAction(id: string, subscriptions: SubscriptionDAO[]): Promise<boolean> {
    const res= setSubscriptions(id, subscriptions)

    revalidatePath("/admin/plans")

    return res
}


