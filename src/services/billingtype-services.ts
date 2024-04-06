import * as z from "zod"
import { prisma } from "@/lib/db"

export type BillingTypeDAO = {
	id: string
	name: string
	description: string | undefined
	createdAt: Date
	updatedAt: Date
}

export const billingTypeSchema = z.object({
	name: z.string({required_error: "name is required."}),
	description: z.string().optional(),
})

export type BillingTypeFormValues = z.infer<typeof billingTypeSchema>


export async function getBillingTypesDAO() {
  const found = await prisma.billingType.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as BillingTypeDAO[]
}

export async function getBillingTypeDAO(id: string) {
  const found = await prisma.billingType.findUnique({
    where: {
      id
    },
  })
  return found as BillingTypeDAO
}

export async function getBillingTypeDAOByName(name: string) {
  const found = await prisma.billingType.findFirst({
    where: {
      name
    },
  })
  return found as BillingTypeDAO

}
    
export async function createBillingType(data: BillingTypeFormValues) {
  // TODO: implement createBillingType
  const created = await prisma.billingType.create({
    data
  })
  return created
}

export async function updateBillingType(id: string, data: BillingTypeFormValues) {
  const updated = await prisma.billingType.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteBillingType(id: string) {
  const deleted = await prisma.billingType.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullBillingTypesDAO() {
  const found = await prisma.billingType.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
		}
  })
  return found as BillingTypeDAO[]
}
  
export async function getFullBillingTypeDAO(id: string) {
  const found = await prisma.billingType.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as BillingTypeDAO
}
    