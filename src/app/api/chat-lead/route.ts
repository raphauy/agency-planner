import { getCurrentUser } from '@/lib/utils';
import { getClientDAO } from '@/services/client-services';
import { createConversation, getConversationDAO } from '@/services/conversation-services';
import { getLeadsContext, saveLLMResponse, saveToolCallResponse } from '@/services/function-call-services';
import { createMessage, MessageFormValues } from '@/services/message-services';
import { copyLabTools, leadTools } from '@/services/tools';
import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, conversationId, clientId } = await req.json()

  const client= await getClientDAO(clientId)
  if (!client) return new Response("Client not found", { status: 404 })
  console.log("client", client.name)

  const currentUser= await getCurrentUser()
  if (!currentUser || !currentUser.email) return new Response("No se encontró un usuario logueado", { status: 404 })

  const phone= currentUser.email

  let conversation= await getConversationDAO(conversationId)
  if (!conversation && conversationId === "new") {
    console.log("new conversation")
    
    const created= await createConversation({
      clientId: client.id,      
      phone: phone,
      name: currentUser.name,
      title: "Simulador Lead",
      userId: currentUser.id,
      type: "LEAD",
    })

    conversation= await getConversationDAO(created.id)
    console.log("conversation", conversation)
  }

  if (!conversation) {
    console.log("conversation not found")
    return new Response("Conversation not found", { status: 404 })
  }

  if (!client.prompt) {
    console.log("client prompt not found")
    return new Response("Client prompt not found", { status: 404 })
  }

  // take the last 20 messages
  const last20= messages.slice(-20)

  const lastMessage= last20[last20.length - 1]
  const input= lastMessage.content
  if (lastMessage.role === "user" && input) {
    console.log("input: " + input)
    const messageForm: MessageFormValues= {
      role: "user",
      content: input,
      tokens: 0,
      conversationId: conversation.id,
    }
    await createMessage(messageForm)  
  }
  

  const context= await getLeadsContext(client.id, client.prompt)
  console.log("context", context)

  const result = await streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(last20),
    tools: leadTools,
    system: context,
    onFinish: async ({text, finishReason, usage,}) => {
      console.log("onFinish", text)
      await saveLLMResponse(text, finishReason, usage, conversation.id)
    },
    onStepFinish: async (event) => {
      console.log("onStepFinish");
      await saveToolCallResponse(event, conversation.id);
    },
    maxSteps: 5
  })

  return result.toDataStreamResponse()
}
