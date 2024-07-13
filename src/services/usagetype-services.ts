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
    



export type ClientUsage = {
  clientId: string
  clientName: string
  totalCredits: number
  storageCredits: number
  llmCredits: number
}

export type AgencyUsage = {
  agencyId: string
  agencyName: string
  totalCredits: number
  storageCredits: number
  llmCredits: number
  clientUsages: ClientUsage[]
}

export async function getUsageByAgency(agencyId: string, dateFrom: Date, dateTo: Date): Promise<AgencyUsage> {
  // Obtener la agencia
  const agency = await prisma.agency.findUnique({
    where: { id: agencyId },
    select: { name: true }
  })

  if (!agency) {
    throw new Error(`Agency with id ${agencyId} not found`)
  }

  // Obtener los créditos agrupados por tipo de uso a nivel de agencia
  const agencyUsageAggregations = await prisma.usageRecord.groupBy({
    by: ['usageTypeId'],
    where: {
      agencyId,
      createdAt: {
        gte: dateFrom,
        lte: dateTo
      }
    },
    _sum: {
      credits: true
    }
  })

  // Obtener los créditos agrupados por cliente y por tipo de uso
  const clientUsageAggregations = await prisma.usageRecord.groupBy({
    by: ['clientId', 'usageTypeId'],
    where: {
      agencyId,
      createdAt: {
        gte: dateFrom,
        lte: dateTo
      }
    },
    _sum: {
      credits: true
    }
  })

  // Obtener los nombres de los clientes y tipos de uso
  const clientIds = clientUsageAggregations.map(aggregation => aggregation.clientId).filter(id => id !== null)
  const clients = await prisma.client.findMany({
    where: {
      id: {
        in: clientIds as string[]
      }
    },
    select: {
      id: true,
      name: true
    }
  })

  const usageTypeIds = agencyUsageAggregations.map(aggregation => aggregation.usageTypeId)
  const usageTypes = await prisma.usageType.findMany({
    where: {
      id: {
        in: usageTypeIds
      }
    },
    select: {
      id: true,
      name: true
    }
  })

  // Calcular los créditos a nivel de agencia
  let totalAgencyCredits = 0
  let totalAgencyStorageCredits = 0
  let totalAgencyLlmCredits = 0

  agencyUsageAggregations.forEach(aggregation => {
    const usageType = usageTypes.find(type => type.id === aggregation.usageTypeId)
    if (usageType) {
      totalAgencyCredits += aggregation._sum.credits || 0
      if (usageType.name === 'Storage') {
        totalAgencyStorageCredits += aggregation._sum.credits || 0
      } else if (usageType.name === 'LLM') {
        totalAgencyLlmCredits += aggregation._sum.credits || 0
      }
    }
  })

  // Agrupar los créditos por cliente y por tipo de uso
  const clientUsagesMap: { [key: string]: ClientUsage } = {}

  clientUsageAggregations.forEach(aggregation => {
    const clientId = aggregation.clientId as string
    const usageType = usageTypes.find(type => type.id === aggregation.usageTypeId)

    if (usageType) {
      if (!clientUsagesMap[clientId]) {
        const client = clients.find(c => c.id === clientId)
        clientUsagesMap[clientId] = {
          clientId,
          clientName: client ? client.name : 'Unknown Client',
          totalCredits: 0,
          storageCredits: 0,
          llmCredits: 0
        }
      }

      const clientUsage = clientUsagesMap[clientId]
      clientUsage.totalCredits += aggregation._sum.credits || 0

      if (usageType.name === 'Storage') {
        clientUsage.storageCredits += aggregation._sum.credits || 0
      } else if (usageType.name === 'LLM') {
        clientUsage.llmCredits += aggregation._sum.credits || 0
      }
    }
  })

  const clientUsages = Object.values(clientUsagesMap)

  // Devolver el resultado
  return {
    agencyId,
    agencyName: agency.name,
    totalCredits: totalAgencyCredits,
    storageCredits: totalAgencyStorageCredits,
    llmCredits: totalAgencyLlmCredits,
    clientUsages
  }
}

export async function geTotaltUsage(dateFrom: Date, dateTo: Date) {
  console.log("geTotaltUsage", dateFrom, dateTo)
  
  const res: AgencyUsage[] = []

  const agencies = await prisma.agency.findMany({
    select: {
      id: true
    }
  })

  for (const agency of agencies) {
    const agencyUsage = await getUsageByAgency(agency.id, dateFrom, dateTo)
    res.push(agencyUsage)
  }

  return res
}