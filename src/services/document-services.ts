import * as z from "zod"
import { prisma } from "@/lib/db"
import { JSONContent } from "novel"

export type DocumentDAO = {
	id: string
	name: string
	description: string | undefined
	jsonContent: JSONContent | undefined
	textContent: string | undefined
	type: string
	fileSize: number | undefined
	wordsCount: number | undefined
	status: string
	createdAt: Date
	updatedAt: Date
	clientId: string
  clientSlug: string
  agencySlug: string
}

export const documentSchema = z.object({
	name: z.string({required_error: "name is required."}),
	description: z.string().optional(),
	jsonContent: z.string().optional(),
	textContent: z.string().optional(),
	fileSize: z.number().optional(),
	wordsCount: z.number().optional(),
	clientId: z.string({required_error: "clientId is required."}),
})

export type DocumentFormValues = z.infer<typeof documentSchema>


export async function getDocumentsDAO() {
  const found = await prisma.document.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      client: {
        include: {
          agency: {
            select: {
              slug: true
            }
          }
        }
      }
    }
  })
  const res= found.map((doc) => {
    return {
      ...doc,
      jsonContent: undefined,
      textContent: undefined,
      clientSlug: doc.client.slug,
      agencySlug: doc.client.agency.slug,
    }
  })

  return res as DocumentDAO[]
}

export async function getDocumentsDAOByClient(clientId: string) {
  const found = await prisma.document.findMany({
    where: {
      clientId
    },
    orderBy: {
      createdAt: 'asc'
    },
    include: {
      client: {
        include: {
          agency: {
            select: {
              slug: true
            }
          }
        }
      },
    }
  })
  const res= found.map((doc) => {
    return {
      ...doc,
      jsonContent: undefined,
      textContent: undefined,
      clientSlug: doc.client.slug,
      agencySlug: doc.client.agency.slug,
    }
  })

  return res as DocumentDAO[]
}

export async function getDocumentsByClient(clientId: string) {
  const found = await prisma.document.findMany({
    where: {
      clientId
    },
    include: {
      client: {
        include: {
          agency: {
            select: {
              slug: true
            }
          }
        }
      }
    }
  })
  return found

}

export async function getDocumentsCount() {
  const count = await prisma.document.count()
  return count
}

export async function getDocumentDAO(id: string) {
  const found = await prisma.document.findUnique({
    where: {
      id
    },
    include: {
      client: {
        include: {
          agency: {
            select: {
              slug: true
            }
          }
        } 
      }
    }
  })
  if (!found) return null

  const res= {
    ...found,
    clientSlug: found.client.slug,
    agencySlug: found.client.agency.slug,
    jsonContent: found.jsonContent ? JSON.parse(found.jsonContent) : undefined,
  }

  return res as DocumentDAO
}
    
export async function createDocument(data: DocumentFormValues) {
  const created = await prisma.document.create({
    data,
    include: {
      client: {
        include: {
          agency: {
            select: {
              slug: true
            }
          }
        }
      }
    }
  })

  return created
}

export async function updateDocument(id: string, data: DocumentFormValues) {
  const updated = await prisma.document.update({
    where: {
      id
    },
    data,
    include: {
      client: {
        include: {
          agency: {
            select: {
              slug: true
            }
          }
        }
      }
    }
  })
  return updated
}

export async function deleteDocument(id: string) {
  const deleted = await prisma.document.delete({
    where: {
      id
    },
    include: {
      client: {
        include: {
          agency: {
            select: {
              slug: true
            }
          }
        },
      }
    }
  })
  return deleted
}


export async function getFullDocumentDAO(id: string) {
  const found = await prisma.document.findUnique({
    where: {
      id
    },
    include: {
      client: {
        include: {
          agency: {
            select: {
              slug: true
            }
          }
        } 
      }
		}
  })
  if (!found) return null
  const res= {
    ...found,
    clientSlug: found.client.slug,
    agencySlug: found.client.agency.slug,
    jsonContent: found.jsonContent ? JSON.parse(found.jsonContent) : undefined,
  }
  return res as DocumentDAO
}
    

export async function updateContent(id: string, textContent: string, jsonContent: string) {
  console.log("jsonContent", jsonContent)
  
  const wordsCount= textContent.split(" ").length
  const updated = await prisma.document.update({
    where: {
      id
    },
    data: {
      textContent,
      jsonContent,
      wordsCount
    },
    include: {
      client: {
        include: {
          agency: {
            select: {
              slug: true
            }
          }
        },
      } 
    },

  })

  return updated
}