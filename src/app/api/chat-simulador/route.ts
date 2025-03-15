import { getCurrentUser } from '@/lib/utils';
import { getClientDAO } from '@/services/client-services';
import { createConversation, getConversationDAO, messageArrived } from '@/services/conversation-services';
import { getDocumentsContext, getGeneralContext, saveLLMResponse, saveToolCallResponse } from '@/services/function-call-services';
import { createMessage, MessageFormValues } from '@/services/message-services';
import { getRepositorysDAO, getToolFromDatabase } from '@/services/repository-services';
import { getStageByChatwootId } from '@/services/stage-services';
import { leadTools } from '@/services/tools';
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { revalidatePath } from 'next/cache';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, conversationId, clientId } = await req.json()

  const client= await getClientDAO(clientId)
  if (!client) return new Response("Client not found", { status: 404 })
  console.log("client", client.name)

  const currentUser= await getCurrentUser()
  if (!currentUser || !currentUser.email || !currentUser.id) return new Response("No se encontró un usuario logueado", { status: 404 })

  const phone= currentUser.email

  const stage= await getStageByChatwootId(phone, clientId)
  if (stage && !stage.isBotEnabled) {
    return new Response("Este usuario está en un estado con el bot deshabilitado", { status: 404 })
  }

  if (!client.prompt) {
    console.log("client prompt not found")
    return new Response("Client prompt not found", { status: 404 })
  }

  // take the last 20 messages
  const last20= messages.slice(-20)

  const lastMessage= last20[last20.length - 1]
  const input= lastMessage.content
  let conversatioinId= ""

  if (lastMessage.role === "user" && input) {
    console.log("input: " + input)
    const userMessage= await messageArrived(phone, input, clientId, "user")
    conversatioinId= userMessage.conversationId
  }

  if (!conversatioinId) {
    console.log("conversation not found")
    return new Response("Conversation not found", { status: 404 })
  }

  const generalContext= await getGeneralContext(conversatioinId)
  const prompt= client.leadPrompt || ""
  const documentsContext= await getDocumentsContext(client.id)
  const context= generalContext + "\n\n" + prompt + "\n\n" + documentsContext
  console.log("context", context)

  const repositories= await getRepositorysDAO(client.id)
  let tools= {}
  for (const repository of repositories) {
    const tool= await getToolFromDatabase(repository.id)
    console.log("Tool of:", repository.name)
    tools= {
      ...tools,
      ...tool
    }
  }
  console.log("tools count:", Object.keys(tools).length)
  const result = await streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(last20),
    tools: {
      ...leadTools,
      ...tools
    },
    system: context,
    onFinish: async ({text, finishReason, usage,}) => {
      console.log("onFinish", text)
      await saveLLMResponse(text, finishReason, usage, conversatioinId)
    },
    onStepFinish: async (event) => {
      console.log("onStepFinish");
      await saveToolCallResponse(event, conversatioinId);
      revalidatePath("/[agencySlug]/[clientSlug]/whatsapp/simulador", "page")
    },
    maxSteps: 5
  })

  return result.toDataStreamResponse()
}
