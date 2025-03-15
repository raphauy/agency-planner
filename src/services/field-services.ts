import * as z from "zod"
import { prisma } from "@/lib/db"
import { RepositoryDAO } from "./repository-services"
import { FieldType } from "@prisma/client"
import { updateRepositoryToolDefinition } from "./repository-services"
import { JsonValue } from "@prisma/client/runtime/library"

export type FieldDAO = {
	id: string
	name: string
	type: FieldType
	description: string
	required: boolean
	order: number
	etiquetar: boolean
	listOptions: String[]
	repositoryId: string | undefined | null
	createdAt: Date
	updatedAt: Date
}

export const repoFieldSchema = z.object({
	name: z.string().min(1, "name is required."),
	type: z.nativeEnum(FieldType),
	description: z.string().min(1, "description is required."),
	required: z.boolean().default(false),
  etiquetar: z.boolean().default(false),
  listOptions: z.array(z.string()).default([]),
	repositoryId: z.string().optional(),
})

export type FieldFormValues = z.infer<typeof repoFieldSchema>

export async function getFieldsDAO(repositoryId: string) {
  const found = await prisma.field.findMany({
    where: {
      repositoryId
    },
    orderBy: {
      order: 'asc'
    },
  })
  return found as FieldDAO[]
}

export async function getFieldDAO(id: string) {
  const found = await prisma.field.findUnique({
    where: {
      id
    },
  })
  return found as FieldDAO
}


    
export async function createField(data: FieldFormValues) {
  // Crear el campo
  const created = await prisma.field.create({
    data
  })

  // Actualizar la definición de la herramienta si el campo pertenece a un repositorio
  if (data.repositoryId) {
    await updateRepositoryToolDefinition(data.repositoryId);
  }

  return created
}

export async function updateField(id: string, data: FieldFormValues) {
  // Actualizar el campo
  const updated = await prisma.field.update({
    where: {
      id
    },
    data
  })

  // Actualizar la definición de la herramienta si el campo pertenece a un repositorio
  if (data.repositoryId) {
    await updateRepositoryToolDefinition(data.repositoryId);
  }

  return updated
}

export async function deleteField(id: string) {
  // Primero obtener el campo para saber a qué repositorio pertenece
  const field = await getFieldDAO(id);
  const repositoryId = field?.repositoryId;

  // Eliminar el campo
  const deleted = await prisma.field.delete({
    where: {
      id
    },
  })

  // Actualizar la definición de la herramienta si el campo pertenecía a un repositorio
  if (repositoryId) {
    await updateRepositoryToolDefinition(repositoryId);
  }

  return deleted
}
    
export async function updateRepoFieldsOrder(fields: FieldDAO[]): Promise<string> {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    await prisma.field.update({
      where: {
        id: field.id,
      },
      data: {
        order: i,
      },
    })
  }

  const repositoryId= fields[0].repositoryId
  if (!repositoryId) {
    throw new Error("Repository ID is required")
  }

  await updateRepositoryToolDefinition(repositoryId)

  return repositoryId
}

export async function getFieldsDAOByRepositoryId(repositoryId: string) {
  const found = await prisma.field.findMany({
    where: {
      repositoryId
    },
    orderBy: {
      order: "asc"
    },
  })
  return found as FieldDAO[]
}

export async function getDataTags(repositoryId: string, data: string | JsonValue) {
  const fields = await prisma.field.findMany({
    where: {
      repositoryId
    }
  })

  return getTagsFromData(fields, data)
}

// export async function getEventDataTags(eventId: string, data: string | JsonValue) {
//   const fields = await prisma.field.findMany({
//     where: {
//       eventId
//     }
//   })

//   return getTagsFromData(fields, data)
// }

function getTagsFromData(fields: FieldDAO[], data: string | JsonValue) {
  const tags: string[] = []
  const jsonData = typeof data === 'string' ? JSON.parse(data) : data
  for (const field of fields) {
    if (field.etiquetar && jsonData[field.name]) {
      if (field.type === "list") {
        const values = Array.isArray(jsonData[field.name]) 
          ? jsonData[field.name] 
          : jsonData[field.name].split(",")
        tags.push(...values)
      } else {
        tags.push(jsonData[field.name])
      }
    }
  }
  return tags
}
