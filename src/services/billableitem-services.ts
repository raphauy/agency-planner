import * as z from "zod"
import { prisma } from "@/lib/db"
import { BillingTypeDAO } from "./billingtype-services"
import { AgencyDAO } from "./agency-services"

type SimpleName = {
  name: string
}

export type BillableItemDAO = {
	id: string
	description: string | undefined
	quantity: number
	unitPrice: number
	url: string | undefined
	tokenType: string | undefined
	billingType: SimpleName
	billingTypeId: string
  agency: SimpleName
	agencyId: string
  clientId?: string
  client?: SimpleName
	createdAt: Date
	updatedAt: Date
}

export const billableItemSchema = z.object({
	description: z.string().optional(),
	quantity: z.number({required_error: "quantity is required."}),
	unitPrice: z.number({required_error: "unitPrice is required."}),
	url: z.string().optional(),
	tokenType: z.string().optional(),
	billingTypeId: z.string({required_error: "billingTypeId is required."}),
	agencyId: z.string({required_error: "agencyId is required."}),
  clientId: z.string({required_error: "clientId is required."}),
})

export type BillableItemFormValues = z.infer<typeof billableItemSchema>


export async function getBillableItemsDAO(take: number): Promise<BillableItemDAO[]> {
  const found = await prisma.billableItem.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      agency: {
        select: {
          name: true
        }
      },
      client: {
        select: {
          name: true
        }
      },
      billingType: {
        select: {
          name: true
        }
      }
    },
    take
  })
  return found as BillableItemDAO[]
}

export async function getBillableItemDAO(id: string) {
  const found = await prisma.billableItem.findUnique({
    where: {
      id
    },
  })
  return found as BillableItemDAO
}
    
export async function createBillableItem(data: BillableItemFormValues) {
  const created = await prisma.billableItem.create({
    data
  })
  return created
}

export async function updateBillableItem(id: string, data: BillableItemFormValues) {
  const updated = await prisma.billableItem.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteBillableItem(id: string) {
  const deleted = await prisma.billableItem.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullBillableItemsDAO() {
  const found = await prisma.billableItem.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			billingType: true,
			agency: true,
      client: true
		}
  })
  return found as BillableItemDAO[]
}
  
export async function getFullBillableItemDAO(id: string) {
  const found = await prisma.billableItem.findUnique({
    where: {
      id
    },
    include: {
			billingType: true,
			agency: true,
      client: true
		}
  })
  return found as BillableItemDAO
}
    