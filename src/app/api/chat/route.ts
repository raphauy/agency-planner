import { getCurrentUser } from "@/lib/utils";
import { getClientDAOBySlugs } from "@/services/client-services";
import { createConversation, getConversationDAO } from "@/services/conversation-services";
import { getCopyLabContext } from "@/services/function-call-services";
import { MessageFormValues, createMessage } from "@/services/message-services";
import { copyLabTools } from "@/services/tools";
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from "ai";

export const maxDuration = 299

export async function POST(req: Request) {

  const { messages, conversationId, agencySlug, clientSlug, prompt } = await req.json()

  const currentUser= await getCurrentUser()
  if (!currentUser || !currentUser.email) return new Response("No se encontró un usuario logueado", { status: 404 })

  const phone= currentUser.email

  let conversation= await getConversationDAO(conversationId)
  if (!conversation && conversationId === "new") {
    console.log("new conversation")
    
    const client= await getClientDAOBySlugs(agencySlug, clientSlug)
    if (!client) return new Response("Client not found", { status: 404 })

    const created= await createConversation({
      clientId: client.id,      
      phone: phone,
      name: currentUser.name,
      title: "Nueva conversación",
      userId: currentUser.id,
      type: "COPY_LAB",
    })

    conversation= await getConversationDAO(created.id)
    console.log("conversation", conversation)
  }

  if (!conversation) {
    return new Response("Conversation not found", { status: 404 })
  }
  const client= conversation.client

  if (!client.prompt) {
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

  const brandVoice= client.includeBrandVoice ? client.brandVoice : undefined
  const contextString= await getCopyLabContext(client.id, phone, input, brandVoice)

  const systemMessage= client.prompt + "\n" + contextString
  console.log("systemMessage", systemMessage)
  

  console.log("messages.count: " + last20.length)
  console.log("messages", JSON.stringify(last20, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      return value;
    }
    return value;
  }, 2));
  
  const result= await streamText({
    model: openai("gpt-4o-2024-08-06"),
    system: systemMessage,
    messages: convertToCoreMessages(last20),
    tools: copyLabTools,
    onFinish: async ({text, toolCalls, toolResults, finishReason, usage,}) => {
      console.log("onFinish")
      console.log("text", text)
      
      if (text) {
        const messageForm: MessageFormValues= {
          role: "assistant",
          content: text,
          tokens: usage.completionTokens + (usage.promptTokens * 3),
          conversationId: conversation.id,
        }        
        await createMessage(messageForm)
      }

      console.log("finishReason", finishReason)
      console.log("toolCalls", toolCalls)
      console.log("usage", usage)
      console.log("toolResults", toolResults)
      
      
      if (!toolResults) return

      // Handle tool results
      for (const toolResult of toolResults) {
        const messageForm: MessageFormValues= {
          role: "assistant",
          content: "",
          name: toolResult.toolName,
          tokens: usage.completionTokens + (usage.promptTokens * 3),
          toolInvocations: JSON.stringify([toolResult]),
          conversationId: conversation.id,
        }
        await createMessage(messageForm)

      }      

      return
    }
  })

  return result.toAIStreamResponse();

}
