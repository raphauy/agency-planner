import * as z from "zod"
import { prisma } from "@/lib/db"

export type UsageRecordDAO = {
	id: string
	description: string | undefined
  imagesCount: number | undefined
  videosCount: number | undefined
  storageMB: number | undefined
	credits: number
	url: string | undefined
	usageTypeId: string
	agencyId: string
	clientId: string | undefined
	createdAt: Date
	updatedAt: Date
}

export const usageRecordSchema = z.object({
  createdAt: z.date().optional(),
	description: z.string().optional(),
  imagesCount: z.number().optional(),
  videosCount: z.number().optional(),
  storageMB: z.number().optional(),
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
  const created = await prisma.usageRecord.create({
    data
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

type ClientUsage = {
  clientId: string;
  year: number;
  month: number;
  imagesCount: number;
  videosCount: number;
  storageMB: number;
  storageCredits: number;
  llmCredits: number;
};

export async function getClientUsage(clientId: string, year: number, month: number): Promise<ClientUsage | null> {
  console.log("getClientUsage", clientId, year, month)
  
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  // Obtener los usageTypeId correspondientes a "Storage" y "LLM"
  const storageUsageType = await prisma.usageType.findUnique({ where: { name: 'Storage' } });
  const llmUsageType = await prisma.usageType.findUnique({ where: { name: 'LLM' } });

  if (!storageUsageType || !llmUsageType) {
    throw new Error("Usage types not found");
  }

  // Consulta de agrupación para "Storage"
  const storageRecords = await prisma.usageRecord.groupBy({
    by: ['clientId'],
    where: {
      clientId: clientId,
      usageTypeId: storageUsageType.id,
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    _sum: {
      imagesCount: true,
      videosCount: true,
      storageMB: true,
      credits: true,
    },
  });

  // Consulta de agrupación para "LLM"
  const llmRecords = await prisma.usageRecord.groupBy({
    by: ['clientId'],
    where: {
      clientId: clientId,
      usageTypeId: llmUsageType.id,
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    _sum: {
      imagesCount: true,
      videosCount: true,
      storageMB: true,
      credits: true,
    },
  });

  if (storageRecords.length === 0 && llmRecords.length === 0) {
    return null;
  }

  const storageData = storageRecords[0]?._sum || { imagesCount: 0, videosCount: 0, storageMB: 0, credits: 0 };
  const llmData = llmRecords[0]?._sum || { imagesCount: 0, videosCount: 0, storageMB: 0, credits: 0 };

  return {
    clientId: clientId,
    year: year,
    month: month,
    imagesCount: storageData.imagesCount || 0,
    videosCount: storageData.videosCount || 0,
    storageMB: storageData.storageMB || 0,
    storageCredits: storageData.credits || 0,
    llmCredits: llmData.credits || 0,
  };
}
