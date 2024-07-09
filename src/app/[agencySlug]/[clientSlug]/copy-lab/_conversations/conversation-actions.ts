"use server"
  
import { revalidatePath } from "next/cache"
import { ConversationDAO, ConversationFormValues, createConversation, updateConversation, getFullConversationDAO, deleteConversation, setTitle, getTotalTokens } from "@/services/conversation-services"

import { getComplentaryMessages, setMessages} from "@/services/conversation-services"
import { MessageDAO } from "@/services/message-services"
    

export async function getConversationDAOAction(id: string): Promise<ConversationDAO | null> {
    return getFullConversationDAO(id)
}

export async function createOrUpdateConversationAction(id: string | null, data: ConversationFormValues): Promise<ConversationDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateConversation(id, data)
    } else {
        updated= await createConversation(data)
    }     

    revalidatePath("/copy-lab/conversations")

    return updated as ConversationDAO
}

export async function setTitleAction(id: string, title: string): Promise<boolean> {
    const updated= await setTitle(id, title)

    revalidatePath("/[agencySlug]/[clientSlug]/copy-lab", 'page')

    if (!updated) return false
    
    return true
}

export async function deleteConversationAction(id: string): Promise<ConversationDAO | null> {    
    const deleted= await deleteConversation(id)

    revalidatePath("/copy-lab/conversations")

    return deleted as ConversationDAO
}
    
export async function getComplentaryMessagesAction(id: string): Promise<MessageDAO[]> {
    const complementary= await getComplentaryMessages(id)

    return complementary as MessageDAO[]
}

export async function setMessagesAction(id: string, messages: MessageDAO[]): Promise<boolean> {
    const res= setMessages(id, messages)

    revalidatePath("/admin/conversations")

    return res
}


export async function getTotalTokensActions(conversationId: string) {
    const totalTokens= await getTotalTokens(conversationId)

    return totalTokens
}