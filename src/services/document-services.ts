import * as z from "zod"
import { prisma } from "@/lib/db"
import { JSONContent } from "novel"
import { colorPalette } from "@/lib/utils"
import { DocumentType } from ".prisma/client"
import { getValue, setValue } from "./config-services"
import { openai } from "@ai-sdk/openai"
import { CoreMessage, generateText } from "ai"

export type DocumentDAO = {
	id: string
	name: string
	description: string | undefined
	jsonContent: JSONContent | undefined
	textContent: string | undefined
	type: DocumentType
  automaticDescription: boolean
	fileSize: number | undefined
	wordsCount: number | undefined
	status: string
  color: string
	createdAt: Date
	updatedAt: Date
	clientId: string
  clientSlug: string
  agencySlug: string
}

export const documentSchema = z.object({
	name: z.string({required_error: "name is required."}),
	description: z.string().optional(),
	type: z.nativeEnum(DocumentType),
  automaticDescription: z.boolean(),
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

export async function getDocumentsDAOByClient(clientId: string, type: DocumentType) {
  const found = await prisma.document.findMany({
    where: {
      clientId,
      type
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
  const color= colorPalette[Math.floor(Math.random() * colorPalette.length)]

  const created = await prisma.document.create({
    data: {      
      ...data,
      color
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

  if (!updated) return null
  if (updated.automaticDescription) {
    console.log("automaticDescription, generating description")    
    const docId= updated.id
    await generateDescription(docId)  
  } else {
    console.log("not automaticDescription, not generating description")
  }

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

export async function updateDescription(id: string, description: string) {
  const updated= await prisma.document.update({
    where: {
      id
    },
    data: {
      description
    }
  })
  return updated
}


export async function generateDescription(id: string, template?: string) {
  console.log("generating description...")

  if (!template) {
    const descriptionTemplate= await getValue("DOCUMENT_DESCRIPTION_PROMPT")    
    if (!descriptionTemplate) {
      const defaultTemplate= `
      Eres un asistente de escritura de IA que genera el índice de un documento.
      El índice debe contener los tópicos del documento en un solo nivel, debe ser solo información principal.
      El índice debe permitir saber de qué trata el documento sin incluir la propia información del documento.
      El índice será utilizado por la IA para saber de qué se trata el documento.
      No hace falta comenzar con "Índice del documento x". Pon directamente el primer punto.
      El índice debe ser resumido, claro y conciso, como máximo 100 palabras. Es importante que maximices tu capacidad de resumir.
      Al final del índice, debes agregar una lista de palabras claves que se relacionan con el documento.
      El nombre del documento es: '{name}' El texto del documento es: '{content}'
      Tu índice es:`
      
      await setValue("DOCUMENT_DESCRIPTION_PROMPT", defaultTemplate)
      template= defaultTemplate
    } else {
      template= descriptionTemplate
    }
  }

  const document= await getFullDocumentDAO(id)
  if (!document) throw new Error("Document not found")

  const name= document.name
  const content= document.textContent

  if (!name || !content) throw new Error("name or content not found")

  const descriptionPrompt= template.replace("{name}", name).replace("{content}", content)
  console.log("descriptionPrompt: ", descriptionPrompt)  

  const messages: CoreMessage[] = [
    {
      role: "system",
      content: descriptionPrompt,
    },
  ]

  const response= await generateText({
    model: openai("gpt-4o"),
    temperature: 0.1,
    messages
  })

  console.log("description:")
  console.log(response.text)

  if (!response.text) return false

  // update the document description
  await updateDescription(id, response.text)

  return true
}
