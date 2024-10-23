"use server"

import { getActiveConversation } from "@/services/conversation-services"

export async function getActiveConversationIdAction(phone: string, clientId: string) {
  const conversation= await getActiveConversation(phone, clientId)
  return conversation?.id
}
