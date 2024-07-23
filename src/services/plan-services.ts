import * as z from "zod"
import { prisma } from "@/lib/db"
import { SubscriptionDAO } from "./subscription-services"
import { getSubscriptionsDAO } from "./subscription-services"

export type PlanDAO = {
	id: string
	name: string
	description: string | undefined
	price: number
	currency: string
  features: string
  priceId: string | undefined
	maxClients: number
	maxCredits: number
	maxLLMCredits: number
	frecuency: number
	frecuencyType: string
	billingDay: number
	billingDayProportional: boolean
	mpPreapprovalPlanId: string | undefined
	createdAt: Date
	updatedAt: Date
	canceledAt: Date | undefined
	subscriptions: SubscriptionDAO[]
}

export const planSchema = z.object({
	name: z.string().min(1, "name is required."),
	description: z.string().optional(),
	price: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	currency: z.string().min(1, "currency is required."),
  features: z.string().min(1, "features is required."),
  priceId: z.string().optional(),
	maxClients: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	maxCredits: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	maxLLMCredits: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
})

export type PlanFormValues = z.infer<typeof planSchema>


export async function getPlansDAO() {
  const found = await prisma.plan.findMany({
    where: {
      priceId: {
        not: null
      }
    },
    orderBy: {
      price: 'asc'
    },
    include: {
      subscriptions: true,
    }
  })
  return found as PlanDAO[]
}

export async function getPlanDAO(id: string) {
  const found = await prisma.plan.findUnique({
    where: {
      id
    },
  })
  return found as PlanDAO
}

export async function getPlanDAOByPriceId(priceId: string) {
  const found = await prisma.plan.findUnique({
    where: {
      priceId
    },
  })
  return found as PlanDAO
}

export async function createPlan(data: PlanFormValues) {

  const price= data.price ? Number(data.price) : 0
  const maxClients= data.maxClients ? Number(data.maxClients) : 0
  const maxCredits= data.maxCredits ? Number(data.maxCredits) : 0
  const maxLLMCredits= data.maxLLMCredits ? Number(data.maxLLMCredits) : 0
  const frecuency= 1
  const frecuencyType= "months"
  const billingDay= 1

  

  const created = await prisma.plan.create({
    data: {
      ...data,
      price,
      maxClients,
      maxCredits,
      maxLLMCredits,
      frecuency,
      frecuencyType,
      billingDay,
    }
  })


  return created
}

export async function updatePlan(id: string, data: PlanFormValues) {
  const price= data.price ? Number(data.price) : 0
  const maxClients= data.maxClients ? Number(data.maxClients) : 0
  const maxCredits= data.maxCredits ? Number(data.maxCredits) : 0
  const maxLLMCredits= data.maxLLMCredits ? Number(data.maxLLMCredits) : 0
  const billingDay= 1
  const updated = await prisma.plan.update({
    where: {
      id
    },
    data: {
      ...data,
      price,
      maxClients,
      maxCredits,
      maxLLMCredits,
      billingDay,
    }
  })
  return updated
}

export async function deletePlan(id: string) {
  const deleted = await prisma.plan.delete({
    where: {
      id
    },
  })
  return deleted
}
    
export async function getComplentarySubscriptions(id: string) {
  const found = await prisma.plan.findUnique({
    where: {
      id
    },
    include: {
      subscriptions: true,
    }
  })
  const all= await getSubscriptionsDAO()
  const res= all.filter(aux => {
    return !found?.subscriptions.find(c => c.id === aux.id)
  })
  
  return res
}

export async function setSubscriptions(id: string, subscriptions: SubscriptionDAO[]) {
  const oldSubscriptions= await prisma.plan.findUnique({
    where: {
      id
    },
    include: {
      subscriptions: true,
    }
  })
  .then(res => res?.subscriptions)

  await prisma.plan.update({
    where: {
      id
    },
    data: {
      subscriptions: {
        disconnect: oldSubscriptions
      }
    }
  })

  const updated= await prisma.plan.update({
    where: {
      id
    },
    data: {
      subscriptions: {
        connect: subscriptions.map(c => ({id: c.id}))
      }
    }
  })

  if (!updated) {
    return false
  }

  return true
}



export async function getFullPlansDAO() {
  const found = await prisma.plan.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			subscriptions: true,
		}
  })
  return found as PlanDAO[]
}
  
export async function getFullPlanDAO(id: string) {
  const found = await prisma.plan.findUnique({
    where: {
      id
    },
    include: {
			subscriptions: true,
		}
  })
  return found as PlanDAO
}
    