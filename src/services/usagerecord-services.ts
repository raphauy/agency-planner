import * as z from "zod"
import { prisma } from "@/lib/db"

export type UsageRecordDAO = {
	id: string
	description: string | undefined
	credits: number
	url: string | undefined
	usageTypeId: string
	agencyId: string
	clientId: string | undefined
	createdAt: Date
	updatedAt: Date
}

export const usageRecordSchema = z.object({
	description: z.string().optional(),
	credits: z.number(),
	url: z.string().optional(),
	usageTypeId: z.string().min(1, "usageTypeId is required."),
	agencyId: z.string().min(1, "agencyId is required."),
	clientId: z.string().min(1, "clientId is required."),
})

export type UsageRecordFormValues = z.infer<typeof usageRecordSchema>


export async function getUsageRecordsDAO() {
  const found = await prisma.usageRecord.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as UsageRecordDAO[]
}

export async function getUsageRecordDAO(id: string) {
  const found = await prisma.usageRecord.findUnique({
    where: {
      id
    },
  })
  return found as UsageRecordDAO
}
    
export async function createUsageRecord(data: UsageRecordFormValues) {
  const credits = data.credits ? Number(data.credits) : 0
  const created = await prisma.usageRecord.create({
    data: {
      ...data,
      credits
    }
  })
  return created
}

export async function updateUsageRecord(id: string, data: UsageRecordFormValues) {
  const updated = await prisma.usageRecord.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function updateCredits(id: string, credits: number) {
  const updated = await prisma.usageRecord.update({
    where: {
      id
    },
    data: {
      credits
    }
  })
  return updated
}

export async function deleteUsageRecord(id: string) {
  const deleted = await prisma.usageRecord.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullUsageRecordsDAO() {
  const found = await prisma.usageRecord.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
		}
  })
  return found as UsageRecordDAO[]
}
  
export async function getFullUsageRecordDAO(id: string) {
  const found = await prisma.usageRecord.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as UsageRecordDAO
}
    