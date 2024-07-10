import * as z from "zod"
import { prisma } from "@/lib/db"

export type UsageTypeDAO = {
	id: string
	name: string
	description: string | undefined
	creditFactor: number
	createdAt: Date
	updatedAt: Date
}

export const usageTypeSchema = z.object({
	name: z.string().min(1, "name is required."),
	description: z.string().optional(),
  creditFactor: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
})

export type UsageTypeFormValues = z.infer<typeof usageTypeSchema>


export async function getUsageTypesDAO() {
  const found = await prisma.usageType.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as UsageTypeDAO[]
}

export async function getUsageTypeDAO(id: string) {
  const found = await prisma.usageType.findUnique({
    where: {
      id
    },
  })
  return found as UsageTypeDAO
}

export async function getUsageTypeDAOByName(name: string) {
  const found = await prisma.usageType.findUnique({
    where: {
      name
    },
  })
  return found as UsageTypeDAO
}
    
export async function createUsageType(data: UsageTypeFormValues) {
  const creditFactor = data.creditFactor ? Number(data.creditFactor) : 0
  const created = await prisma.usageType.create({
    data: {
      ...data,
      creditFactor
    }
  })
  return created
}

export async function updateUsageType(id: string, data: UsageTypeFormValues) {
  const creditFactor = data.creditFactor ? Number(data.creditFactor) : 0
  const updated = await prisma.usageType.update({
    where: {
      id
    },
    data: {
      ...data,
      creditFactor
    }
  })
  return updated
}

export async function deleteUsageType(id: string) {
  const deleted = await prisma.usageType.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullUsageTypesDAO() {
  const found = await prisma.usageType.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
		}
  })
  return found as UsageTypeDAO[]
}
  
export async function getFullUsageTypeDAO(id: string) {
  const found = await prisma.usageType.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as UsageTypeDAO
}
    