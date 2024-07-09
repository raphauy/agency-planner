import { getCurrentUser } from "@/lib/utils";
import { getClientDAOBySlug } from "@/services/client-services";
import { createConversation, getConversationDAO } from "@/services/conversation-services";
import { getContext } from "@/services/function-call-services";
import { MessageFormValues, createMessage } from "@/services/message-services";
import { DocumentResult, tools } from "@/services/tools";
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from "ai";

export const maxDuration = 299

export async function POST(req: Request) {

  const { messages, conversationId, clientSlug } = await req.json()

  const currentUser= await getCurrentUser()
  if (!currentUser || !currentUser.email) return new Response("No se encontró un usuario logueado", { status: 404 })

  const phone= currentUser.email

  let conversation= await getConversationDAO(conversationId)
  if (!conversation && conversationId === "new") {
    console.log("new conversation")
    
    const client= await getClientDAOBySlug(clientSlug)
    if (!client) return new Response("Client not found", { status: 404 })

    const created= await createConversation({
      clientId: client.id,      
      phone: phone,
      name: currentUser.name,
      title: "Nueva conversación",
      userId: currentUser.id,
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


  const lastMessage= messages[messages.length - 1]
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
  const contextString= await getContext(client.id, phone, input, brandVoice)

  const systemMessage= client.prompt + "\n" + contextString
  console.log("systemMessage", systemMessage)
  

  console.log("messages.count: " + messages.length)
  console.log("messages", JSON.stringify(messages, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      return value;
    }
    return value;
  }, 2));
  
  const result= await streamText({
    model: openai("gpt-4o"),
    system: systemMessage,
    messages: convertToCoreMessages(messages),
    tools,
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
      
      // if (finishReason === "tool-calls" && toolCalls) {
      //   // Handle tool calls
      //   for (const toolCall of toolCalls) {
      //     if (toolCall.toolName === "entregarCopys") {
      //       const messageForm: MessageFormValues= {
      //         role: "function",
      //         content: JSON.stringify(toolCall.args),
      //         name: toolCall.toolName,
      //         tokens: usage.completionTokens + (usage.promptTokens * 3),
      //         conversationId: conversation.id,
      //       }
      //       await createMessage(messageForm)
      //     }
      //   }
      // }
      
      if (!toolResults) return

      // Handle tool results
      for (const toolResult of toolResults) {
        // if (toolResult.toolName === "obtenerDocumento") {
        //   const document: DocumentResult= toolResult.result as DocumentResult
        //   const messageForm: MessageFormValues= {
        //     role: "function",
        //     content: document.documentName,
        //     name: toolResult.toolName,
        //     tokens: usage.completionTokens + (usage.promptTokens * 3),
        //     toolInvocations: JSON.stringify(toolResult),
        //     conversationId: conversation.id,
        //   }
        //   await createMessage(messageForm)
        // }
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

      

      return;
    }
  })



  return result.toAIStreamResponse();


  // functions.forEach((functionDefinition) => {
  //   console.log("functionDefinition: " + functionDefinition.name);
  // })

  // const openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY!,
  // })
  
  // Inicializa el objeto de argumentos con propiedades comunes
  let baseArgs = {
    model: "gpt-4o",
    temperature: 0,
    stream: true,
  };
  let promptTokens= 0
  let completionTokens= 0

  // @ts-ignore
  baseArgs = { ...baseArgs, messages: messages }

  // Si el array de functions tiene al menos un elemento, añade el parámetro functions
//  const args = functions.length > 0 ? { ...baseArgs, functions: functions, function_call: "auto" } : baseArgs;
  const args= baseArgs

  // Ahora args contiene el parámetro functions solo si el array no estaba vacío
  //const initialResponse = await openai.chat.completions.create(args as any);

//   const stream = OpenAIStream(initialResponse, {
//     experimental_onFunctionCall: async (
//       { name, arguments: args,  },
//       createFunctionCallMessages,
//     ) => {
// //      const result = await runFunction(name, args, clientId);
//       const result = await processFunctionCall(clientId, name, args);
//       const newMessages = createFunctionCallMessages(result);

//       let baseArgs = {
//         model: model.name,
//         stream: true,
//       };
    
//       // @ts-ignore
//       baseArgs = { ...baseArgs, messages: [...messages, ...newMessages] };
//       const recursiveArgs = functions.length > 0 ? { ...baseArgs, functions: functions, function_call: "auto" } : baseArgs;

//       return openai.chat.completions.create(recursiveArgs as any);

//     },
//     onStart: async () => {
//       console.log("start")
//       const text= messages[messages.length - 1].content
//       console.log("text: " + text)
      
//       const messageStored= await messageArrived(phone, text, client.id, "user", "")
//       if (messageStored) console.log("user message stored")

//     },
//     onCompletion: async (completion) => {
//       console.log("completion: ", completion)

//       const partialPromptToken = openaiTokenCounter.chat(messages, "gpt-4") + 1
//       console.log(`\tPartial prompt token count: ${partialPromptToken}`)      
//       promptTokens += partialPromptToken

//       const completionMessages = [
//         { role: "assistant", content: completion },
//       ]
//       const partialCompletionTokens = openaiTokenCounter.chat(completionMessages, "gpt-4")
//       console.log(`\tPartial completion token count: ${partialCompletionTokens}`)
//       completionTokens += partialCompletionTokens

//       if (!completion.includes("function_call")) {
//         console.log(`Prompt token count: ${promptTokens}`)
//         console.log(`Completion token count: ${completionTokens}`)
//         const messageStored= await messageArrived(phone, completion, client.id, "assistant", "", promptTokens, completionTokens)
//         if (messageStored) console.log("assistant message stored")
//       } else {
//         // console.log("function call")
//         // const completionObj= JSON.parse(completion)
//         // const { name, arguments: args }= completionObj.function_call
// //        const text= `Llamando a la función ${name} con los argumentos: ${args}`
//         // const text= `Función invocada.`
//         // const messageStored= await messageArrived(phone, text, client.id, "function", "", 0, 0)
//         // if (messageStored) console.log("function message stored")
//       }
//     },
//   });

}
