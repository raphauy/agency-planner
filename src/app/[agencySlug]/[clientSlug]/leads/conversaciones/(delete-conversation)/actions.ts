"use server"
  
import { closeConversation, deleteConversation } from "@/services/conversation-services"
import { revalidatePath } from "next/cache"


export async function deleteConversationAction(id: string): Promise<boolean> {
    const deleted= await deleteConversation(id)

    if (!deleted) return false

    revalidatePath(`/[agencySlug]/[clientSlug]/leads`, "layout")

    return true
}

export async function closeConversationAction(conversationId: string) {
    if (!conversationId) throw new Error("No se puede cerrar una conversación sin mensajes")
    const updated= await closeConversation(conversationId)

    revalidatePath(`/[agencySlug]/[clientSlug]/leads`, "page")

    return updated
}

