import * as z from "zod"
import { prisma } from "@/lib/db"

export type PromptVersionDAO = {
	id: string
	content: string
	timestamp: Date
	user: string
  clientId: string
}

export const promptVersionSchema = z.object({
	content: z.string().min(1, "content is required."),
	user: z.string().min(1, "user is required."),
  clientId: z.string().min(1, "clientId is required."),
})

export type PromptVersionFormValues = z.infer<typeof promptVersionSchema>


export async function getPromptVersionsDAO(clientId: string) {
  const found = await prisma.promptVersion.findMany({
    where: {
      clientId
    },
    orderBy: {
      timestamp: 'desc'
    },
  })
  return found as PromptVersionDAO[]
}

export async function getPromptVersionDAO(id: string) {
  const found = await prisma.promptVersion.findUnique({
    where: {
      id
    },
  })
  return found as PromptVersionDAO
}
    
export async function createPromptVersion(data: PromptVersionFormValues) {
  // TODO: implement createPromptVersion
  const created = await prisma.promptVersion.create({
    data
  })
  return created
}

export async function updatePromptVersion(id: string, data: PromptVersionFormValues) {
  const updated = await prisma.promptVersion.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deletePromptVersion(id: string) {
  const deleted = await prisma.promptVersion.delete({
    where: {
      id
    },
  })
  return deleted
}

