import * as z from "zod"
import { prisma } from "@/lib/db"
import { clientSchema } from "./client-services"
import { getAgencyDAO } from "./agency-services"
import { getBestValidSubscription } from "./subscription-services"

export type MonthlyUsageDAO = {
	id: string
	month: number
	year: number
	storageCredits: number
	publicationsCount: number
	imagesCount: number
	videosCount: number
	storageMB: number
	llmCredits: number
	conversationsCount: number
	monthLabel: string
	agencyName: string
	clientName: string
	clientId: string
	agencyId: string
	createdAt: Date
	updatedAt: Date
}

export const monthlyUsageSchema = z.object({
	month: z.number({required_error: "month is required."}),
	year: z.number({required_error: "year is required."}),
	storageCredits: z.number({required_error: "storageCredits is required."}),
	publicationsCount: z.number({required_error: "publicationsCount is required."}),
	imagesCount: z.number({required_error: "imagesCount is required."}),
	videosCount: z.number({required_error: "videosCount is required."}),
	storageMB: z.number({required_error: "storageMB is required."}),
	llmCredits: z.number({required_error: "llmCredits is required."}),
	conversationsCount: z.number({required_error: "conversationsCount is required."}),
	monthLabel: z.string().min(1, "monthLabel is required."),
	agencyName: z.string().min(1, "agencyName is required."),
	clientName: z.string().min(1, "clientName is required."),
	clientId: z.string().min(1, "clientId is required."),
	agencyId: z.string().min(1, "agencyId is required."),	
})

export type MonthlyUsageFormValues = z.infer<typeof monthlyUsageSchema>

export async function getMonthlyUsagesDAO() {
  const found = await prisma.monthlyUsage.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as MonthlyUsageDAO[]
}

export async function getMonthlyUsageDAO(id: string) {
  const found = await prisma.monthlyUsage.findUnique({
    where: {
      id
    },
  })
  return found as MonthlyUsageDAO
}
    
export async function createMonthlyUsage(data: MonthlyUsageFormValues) {
  // TODO: implement createMonthlyUsage
  const created = await prisma.monthlyUsage.create({
    data
  })
  return created
}

export async function updateMonthlyUsage(id: string, data: MonthlyUsageFormValues) {
  const updated = await prisma.monthlyUsage.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteMonthlyUsage(id: string) {
  const deleted = await prisma.monthlyUsage.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullMonthlyUsagesDAO() {
  const found = await prisma.monthlyUsage.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
		}
  })
  return found as MonthlyUsageDAO[]
}
  
export async function getFullMonthlyUsageDAO(id: string) {
  const found = await prisma.monthlyUsage.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as MonthlyUsageDAO
}

export type AgencyMonthlyInfo= {
  agencyId: string
  agencyName: string
  agencyMaxCredits: number
  month: number
  year: number
  storageCredits: number
  publicationsCount: number
  imagesCount: number
  videosCount: number
  storageMB: number
  llmCredits: number
  conversationsCount: number
  clientMonthlyUsages: MonthlyUsageDAO[]
}
export async function getMonthlyUsagesDAOByAgency(agencyId: string, year: number, month: number): Promise<AgencyMonthlyInfo> {
  month= month + 1
  const agency= await getAgencyDAO(agencyId)
  const bestValidSubscription= await getBestValidSubscription(agencyId)
  const agencyMaxCredits= bestValidSubscription.maxCredits

  const found = await prisma.monthlyUsage.findMany({
    where: {
      agencyId,
      year,
      month
    },
    include: {
      client: true,
      agency: true,
		}
  })
  // sort by total credits (storage + llm)
  const clientMonthlyUsages= found.sort((a, b) => (b.storageCredits + b.llmCredits) - (a.storageCredits + a.llmCredits))

  const storageCredits= clientMonthlyUsages.reduce((acc, usage) => acc + usage.storageCredits, 0)
  const llmCredits= clientMonthlyUsages.reduce((acc, usage) => acc + usage.llmCredits, 0)
  const publicationsCount= clientMonthlyUsages.reduce((acc, usage) => acc + usage.publicationsCount, 0)
  const imagesCount= clientMonthlyUsages.reduce((acc, usage) => acc + usage.imagesCount, 0)
  const videosCount= clientMonthlyUsages.reduce((acc, usage) => acc + usage.videosCount, 0)
  const conversationsCount= clientMonthlyUsages.reduce((acc, usage) => acc + usage.conversationsCount, 0)
  const storageMB= clientMonthlyUsages.reduce((acc, usage) => acc + usage.storageMB, 0)

  const res: AgencyMonthlyInfo= {
    agencyId,
    agencyName: agency.name,
    agencyMaxCredits,
    month,
    year,
    storageCredits,
    publicationsCount,
    imagesCount,
    videosCount,
    storageMB,
    llmCredits,
    conversationsCount,
    clientMonthlyUsages
  }

  return res  
}
