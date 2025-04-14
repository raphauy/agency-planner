"use server"

import { getActiveConversation, getConversationDAO, getFullConversationsBySlugs, getLastConversation } from "@/services/conversation-services"
import { DocumentType } from ".prisma/client"

export async function getActiveConversationIdAction(phone: string, clientId: string) {
  const conversation= await getActiveConversation(phone, clientId)
  return conversation?.id
}

export async function getFullConversationDAOBySlugsAction(agencySlug: string, clientSlug: string) {
  const conversation= await getFullConversationsBySlugs(agencySlug, clientSlug, DocumentType.LEAD)
  return conversation
}

export async function getLastConversationAction(agencySlug: string, clientSlug: string, type: DocumentType) {
  return getLastConversation(agencySlug, clientSlug, type)
}

export async function getConversationDAOAction(id: string) {
  return getConversationDAO(id)
}

export async function getFullConversationsBySlugsAction(agencySlug: string, clientSlug: string) {
  return getFullConversationsBySlugs(agencySlug, clientSlug, DocumentType.LEAD)
}