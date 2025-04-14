"use server"
  
import { revalidatePath } from "next/cache"
import { DocumentDAO, DocumentFormValues, createDocument, updateDocument, getFullDocumentDAO, deleteDocument, updateContent, generateDescription } from "@/services/document-services"
import { JSONContent } from "novel"
import { setValue } from "@/services/config-services"


export async function getDocumentDAOAction(id: string): Promise<DocumentDAO | null> {
    return getFullDocumentDAO(id)
}

export async function createOrUpdateDocumentAction(id: string | null, data: DocumentFormValues) {       
    let updated= null
    if (id) {
        updated= await updateDocument(id, data)
    } else {
        updated= await createDocument(data)
    }     
    if (!updated) return null

    revalidatePath(`${updated.client.agency.slug}/${updated.client.slug}/copy-lab/documents`, 'page')

    return updated
}

export async function deleteDocumentAction(id: string) {    
    const deleted= await deleteDocument(id)

    revalidatePath(`${deleted.client.agency.slug}/${deleted.client.slug}/copy-lab/documents`, 'page')

    return deleted
}

export async function updateContentAction(id: string, textContent: string, jsonContent: string)  {
    
    const updated= await updateContent(id, textContent, jsonContent)

    revalidatePath(`${updated.client.agency.slug}/${updated.client.slug}/copy-lab/documents`, 'page')
  
    return updated
}

export async function generateDescriptionAction(id: string, template?: string): Promise<boolean> {
    
    const res= await generateDescription(id, template)

    revalidatePath("/[agencySlug]/[clientSlug]/documentos", 'page')
  
    return res
}

export async function updateTemplateAction(id: string, template: string): Promise<boolean> {
    const res= await setValue(id, template)

    revalidatePath("/[agencySlug]/[clientSlug]/documentos/[documentId]", 'page')
    if (!res) return false

    return true
}