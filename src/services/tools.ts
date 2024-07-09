import { tool } from 'ai';
import { z } from 'zod';
import { getDocumentDAO } from './document-services';

export const tools= {
    obtenerDocumento: tool({
        description: 'Devuelve la información completa de un documento a partir de su id. Los documentos pueden utilizarse para responder a las peticiones del usuario.".',
        parameters: z.object({
            documentId: z.string().describe('El identificador del documento'),
        }),
        execute: async ({ documentId }) => {
          const document= await obtenerDocumento(documentId)
          return document
        },
    }),
    entregarCopys: tool({
        description: 'Si el usuario solicita un copy, debes generar dos opciones de respuesta.',
        parameters: z.object({
            copy1: z.string().describe('El primer copy'),
            copy2: z.string().describe('El segundo copy'),
        }),
        execute: async ({ copy1, copy2 }) => {          
          return "Copys guardados y ya presentados al usuario. Dile exactamente esto al usuario: 'Aquí arriba tienes dos opciones de copys.'"
        },
    }),

}

export type DocumentResult= {
    documentId: string
    documentName: string
    documentDescription: string | null
    content: string | null
}

export async function obtenerDocumento(id: string) {
    const document= await getDocumentDAO(id)
    if (!document) return "Document not found"
    console.log(`\tgetDocument: doc: ${document.name}`)
  
    const res: DocumentResult= {
        documentId: document.id,
        documentName: document.name,
        documentDescription: document.description ?? null,
        content: document.textContent ?? null,
    }
    return res
  }
  