"use server"
  
import { revalidatePath } from "next/cache"
import { PublicationDAO, createCalendarNote, getPublicationDAO, deletePublication, updateCalendarNote } from "@/services/publication-services"
import { getClientDAOBySlugs } from "@/services/client-services"

export type CalendarNoteData = {
    title: string;
    date: Date;
}

export type CalendarNoteUpdateData = {
    id: string;
    title: string;
}

export async function createCalendarNoteAction(data: CalendarNoteData, agencySlug: string, clientSlug: string): Promise<PublicationDAO | null> {
    const created = await createCalendarNote(
        data.title,
        agencySlug,
        clientSlug,
        data.date
    )
    
    revalidatePath("/[agencySlug]/[clientSlug]", "page")
    
    return created as PublicationDAO
}

export async function getClientAction(agencySlug: string, clientSlug: string) {
    const client = await getClientDAOBySlugs(agencySlug, clientSlug)
    
    return client
}

export async function getCalendarNoteAction(id: string): Promise<PublicationDAO | null> {
    return getPublicationDAO(id)
}

export async function updateCalendarNoteAction(data: CalendarNoteUpdateData): Promise<PublicationDAO | null> {
    const updated = await updateCalendarNote(data.id, data.title)
    
    revalidatePath("/[agencySlug]/[clientSlug]", "page")
    
    if (updated) {
        // Convertir null a undefined para el campo images
        return {
            ...updated,
            images: updated.images === null ? undefined : updated.images
        } as PublicationDAO
    }
    
    return null
}

export async function deleteCalendarNoteAction(id: string): Promise<PublicationDAO | null> {
    // Primero obtenemos la publicación completa
    const publication = await getPublicationDAO(id);
    if (!publication) return null;
    
    // Luego eliminamos
    await deletePublication(id)
    
    revalidatePath("/[agencySlug]/[clientSlug]", "page")
    
    return publication
} 