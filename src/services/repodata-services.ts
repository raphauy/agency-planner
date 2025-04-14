import { prisma } from "@/lib/db"
import { JsonValue } from ".prisma/client/runtime/library"
import * as z from "zod"
import { getFieldsDAOByRepositoryId } from "./field-services"
import { getClientDAOBySlugs } from "./client-services"

export type RepoDataDAO = {
	id: string
	repoName: string
  phone: string
	functionName: string
	data: String
	repositoryId: string | null
	clientId: string
  conversationId: string
	createdAt: Date
	updatedAt: Date
}

export const repoDataSchema = z.object({
	repoName: z.string().min(1, "repoName is required."),
  phone: z.string().min(1, "phone is required."),
	functionName: z.string().min(1, "functionName is required."),
	data: z.any(),
	repositoryId: z.string().min(1, "repositoryId is required."),
	clientId: z.string().min(1, "clientId is required."),
  conversationId: z.string().min(1, "conversationId is required."),
})

export type RepoDataFormValues = z.infer<typeof repoDataSchema>


export async function getRepoDatasDAO() {
  const found = await prisma.repoData.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as RepoDataDAO[]
}

export async function getRepoDataDAO(id: string) {
  const found = await prisma.repoData.findUnique({
    where: {
      id
    },
  })
  return found as RepoDataDAO
}
    
export async function createRepoData(data: RepoDataFormValues) {
  const sortedData= await sortData(data.repositoryId, data.data)
  
  const repoData = {
    repoName: data.repoName,
    phone: data.phone,
    functionName: data.functionName,
    repositoryId: data.repositoryId,
    clientId: data.clientId,
    conversationId: data.conversationId,
    data: JSON.stringify(sortedData)
  };

  const created = await prisma.repoData.create({
    data: repoData,
    include: {
      client: {
        select: {
          name: true,
          slug: true,
        }
      },
      repository: {
        select: {
          name: true,          
        }
      }
    }
  })
  return created;
}

export async function sortData(repositoryId: string, data: JsonValue): Promise<JsonValue> {
  if (!data) return {}
  const mappedDAta= JSON.parse(JSON.stringify(data))
  const sortedFields= await getFieldsDAOByRepositoryId(repositoryId)
  let res: JsonValue= {}
  for (const field of sortedFields) {
    const key= field.name
    res[field.name]= mappedDAta[key]
  }
  return res
}

export async function updateRepoData(id: string, data: RepoDataFormValues) {
  const updated = await prisma.repoData.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteRepoData(id: string) {
  const deleted = await prisma.repoData.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullRepoDatasDAO(clientId: string) {
  const found = await prisma.repoData.findMany({
    where: {
      clientId
    },
    orderBy: {
      updatedAt: "desc"
    },
    include: {
			repository: true,
			client: true,
		}
  })
  return found as RepoDataDAO[]
}

export async function getFullRepoDatasDAOByContactId(contactId: string) {
  const found = await prisma.repoData.findMany({
    where: {
      conversation: {
        contactId
      }
    }
  })
  return found as RepoDataDAO[]
}
  
export async function getFullRepoDataDAO(id: string) {
  const found = await prisma.repoData.findUnique({
    where: {
      id
    },
    include: {
			repository: true,
			client: true,
		}
  })
  return found as RepoDataDAO
}

export async function getRepoDataDAOByPhone(repositoryId: string, phone: string) {
  const found = await prisma.repoData.findFirst({
    where: {
      repositoryId,
      phone
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      phone: true,
      repoName: true,
      functionName: true,
      createdAt: true,
      data: true,
      client: {
        select: {
          name: true,
        }
      }
    }
  })
  return found
}

export async function getRepoDataCount(contactId: string) {
  const count= await prisma.repoData.count({
    where: {
      conversation: {
        contactId
      }
    }
  })
  return count
}