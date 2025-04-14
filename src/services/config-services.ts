import * as z from "zod"
import { prisma } from "@/lib/db"

export type ConfigDAO = {
  id:  string
	name:  string
	value?:  string
	createdAt:  Date
	updatedAt:  Date
}

export const configFormSchema = z.object({
	name: z.string({required_error: "Name is required."}),
	value: z.string().optional(),
})
export type ConfigFormValues = z.infer<typeof configFormSchema>

export async function getConfigsDAO() {
  const found = await prisma.config.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  const filtered= found.filter((config) => (config.name !== "PROMPT"))

  return filtered as ConfigDAO[]
}
  
export async function getConfigDAO(id: string) {
  const found = await prisma.config.findUnique({
    where: {
      id
    },
  })
  return found as ConfigDAO
}

export async function getValue(name: string) {
  const found = await prisma.config.findUnique({
    where: {
      name
    },
  })
  return found?.value
}

export async function setValue(name: string, value: string) {
  const found = await prisma.config.findUnique({
    where: {
      name
    },
  })
  if (found) {
    const updated = await prisma.config.update({
      where: {
        id: found.id
      },
      data: {
        value
      }
    })
    return updated
  } else {
    const created = await prisma.config.create({
      data: {
        name,
        value
      }
    })
    return created
  }
}

export async function createConfig(data: ConfigFormValues) {
  const created = await prisma.config.create({
    data
  })
  return created
}

export async function updateConfig(id: string, data: ConfigFormValues) {
  const updated = await prisma.config.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteConfig(id: string) {

  const deleted = await prisma.config.delete({
    where: {
      id
    },
  })
  return deleted
}
    