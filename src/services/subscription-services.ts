import * as z from "zod"
import { prisma } from "@/lib/db"
import { SubscriptionStatus } from "@prisma/client"
import { getPlanDAOByPriceId, PlanDAO } from "./plan-services"
import { AgencyDAO, getAgencyDAO } from "./agency-services"

export type SubscriptionDAO = {
	id: string
  stripeSubscriptionId: string
  stripeCustomerEmail: string
  stripePeriodEnd: Date
  stripePaymentMethod: string | undefined
  stripeNextBilling: Date | undefined
	planName: string
	planDescription: string | undefined
	planPrice: number
	planCurrency: string
	maxClients: number
	maxCredits: number
	maxLLMCredits: number
	status: SubscriptionStatus
	createdAt: Date
	updatedAt: Date
  canceledAt: Date | undefined
	agencyId: string
  agency: AgencyDAO
	planId: string
  plan: PlanDAO
}

export const subscriptionSchema = z.object({
  stripeSubscriptionId: z.string(),
  stripeCustomerEmail: z.string(),
  stripePeriodEnd: z.date(),
  stripePaymentMethod: z.string().optional(),
  stripeNextBilling: z.date().optional(),
	planName: z.string().min(1, "planName is required."),
	planDescription: z.string().optional(),
	planPrice: z.number({required_error: "planPrice is required."}),
	planCurrency: z.string().min(1, "planCurrency is required."),
	maxClients: z.number({required_error: "maxClients is required."}),
	maxCredits: z.number({required_error: "maxCredits is required."}),
	maxLLMCredits: z.number({required_error: "maxLLMCredits is required."}),
  status: z.nativeEnum(SubscriptionStatus),	
	agencyId: z.string().min(1, "agencyId is required."),
	planId: z.string().min(1, "planId is required."),
})

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>

export const subscriptionUpdateSchema = z.object({
  stripePeriodEnd: z.date(),
  status: z.nativeEnum(SubscriptionStatus),	
  canceledAt: z.date().optional(),
  stripePaymentMethod: z.string().optional(),
})

export type SubscriptionUpdateFormValues = z.infer<typeof subscriptionUpdateSchema>

export const shortSubscriptionSchema = z.object({
  stripePeriodEnd: z.date(),
  stripePaymentMethod: z.string().optional(),
	planPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	maxClients: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	maxCredits: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	maxLLMCredits: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	agencyId: z.string().min(1, "agencyId is required."),
	planId: z.string().min(1, "planId is required."),
})

export type ShortSubscriptionFormValues = z.infer<typeof shortSubscriptionSchema>

export async function getSubscriptionsDAO() {
  const found = await prisma.subscription.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as SubscriptionDAO[]
}

export async function getSubscriptionDAO(id: string) {
  const found = await prisma.subscription.findUnique({
    where: {
      id
    },
  })
  return found as SubscriptionDAO
}

export async function getSubscriptionDAOByStripeSubscriptionId(stripeSubscriptionId: string) {
  const found = await prisma.subscription.findFirst({
    where: {
      stripeSubscriptionId
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      plan: true
    }
  })
  return found as SubscriptionDAO
}
    
export async function createSubscription(data: SubscriptionFormValues) {
  const created = await prisma.subscription.create({
    data
  })
  return created
}

export async function createSubscriptionCustom(agencyId: string, priceId: string) {
  const agency= await getAgencyDAO(agencyId)
  if (!agency) throw new Error("Agency not found")
  
  const plan= await getPlanDAOByPriceId(priceId)
  if (!plan) throw new Error("Plan not found")
  
  // perido end is 1 month from now
  const stripePeriodEnd= new Date()
  stripePeriodEnd.setMonth(stripePeriodEnd.getMonth() + 1)
  const created= await prisma.subscription.create({
    data: {
      planId: plan.id,
      agencyId,
      stripeSubscriptionId: "",
      stripeCustomerEmail: "",
      stripePeriodEnd,
      stripePaymentMethod: "",
      planName: plan.name,
      planDescription: plan.description,
      planPrice: plan.price,
      planCurrency: plan.currency,
      maxClients: plan.maxClients,
      maxCredits: plan.maxCredits,
      maxLLMCredits: plan.maxLLMCredits,
      status: "ACTIVE",
    }
  })

  if (!created) throw new Error("Error al crear la subscripcion")

  return created
}

export async function updateShortSubscription(id: string, data: ShortSubscriptionFormValues) {
  const price= data.planPrice ? Number(data.planPrice) : 0
  const maxClients= data.maxClients ? Number(data.maxClients) : 0
  const maxCredits= data.maxCredits ? Number(data.maxCredits) : 0
  const maxLLMCredits= data.maxLLMCredits ? Number(data.maxLLMCredits) : 0
  const updated = await prisma.subscription.update({
    where: {
      id
    },
    data: {
      stripePeriodEnd: data.stripePeriodEnd,
      stripePaymentMethod: data.stripePaymentMethod,
      planPrice: price,
      maxClients,
      maxCredits,
      maxLLMCredits,
    }
  })
  return updated
}

export async function updateSubscription(id: string, data: SubscriptionUpdateFormValues) {
  console.log("updateSubscription", id, data)
  
  const updated = await prisma.subscription.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteSubscription(id: string) {
  const deleted = await prisma.subscription.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullSubscriptionsDAO() {
  const found = await prisma.subscription.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      agency: true,
		}
  })
  return found as SubscriptionDAO[]
}
  
export async function getFullSubscriptionDAO(id: string) {
  const found = await prisma.subscription.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as SubscriptionDAO
}

export async function getBestValidSubscription(agencyId: string) {
  const now= new Date()
  const found = await prisma.subscription.findFirst({
    where: {
      agencyId,
      stripePeriodEnd: {
        gte: now
      },
      status: "ACTIVE"
    },
    orderBy: {
      maxLLMCredits: 'desc',
    },
    include: {
      plan: true
    }
  })
  return found as SubscriptionDAO
}

export async function changePlan(subscriptionId: string, stripeNewSubscriptionId: string, newPriceId: string, stripePeriodEnd: Date, stripePaymentMethod: string) {
  const oldSubscription= await getSubscriptionDAO(subscriptionId)
  if (!oldSubscription) throw new Error("No se encontro la subscripcion")

  const newPlan= await getPlanDAOByPriceId(newPriceId)
  if (!newPlan) throw new Error("No se encontro el plan con priceId " + newPriceId)

  const newSubscription= await createSubscription({
    planId: newPlan.id,
    agencyId: oldSubscription.agencyId,
    stripeSubscriptionId: stripeNewSubscriptionId,
    stripeCustomerEmail: oldSubscription.stripeCustomerEmail,
    stripePeriodEnd,
    stripePaymentMethod,
    planName: newPlan.name,
    planDescription: newPlan.description,
    planPrice: newPlan.price,
    planCurrency: newPlan.currency,
    maxClients: newPlan.maxClients,
    maxCredits: newPlan.maxCredits,
    maxLLMCredits: newPlan.maxLLMCredits,
    status: "ACTIVE",
  })
  if (!newSubscription) throw new Error("Error al crear la nueva subscripcion")

  // new status is UPGRADED or DOWNGRADED in function of the new price
  const newStatus= oldSubscription.planPrice < newPlan.price ? "UPGRADED" : "DOWNGRADED"
  await prisma.subscription.update({
    where: {
      id: oldSubscription.id
    },
    data: {
      status: newStatus,
      stripePeriodEnd: new Date(),
    }
  })

  return newSubscription
}