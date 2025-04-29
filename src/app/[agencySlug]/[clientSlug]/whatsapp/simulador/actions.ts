"use server"

import { getActiveMessages, getConversationMessages } from "@/services/conversation-services"
import { MessageDAO } from "@/services/message-services"

export async function getConversationMessagesAction(conversationId: string): Promise<MessageDAO[]> {
    const take= 100
    const messages= await getConversationMessages(conversationId, take)
    return messages
}