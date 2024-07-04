import { getClientDAOBySlug } from "@/services/client-services";
import { getCurrentUser } from "@/lib/utils";
import { getContext } from "@/services/function-call-services";
import { createConversation, getConversationDAO } from "@/services/conversation-services";
import { createMessage } from "@/services/message-services";
import { StreamingTextResponse, streamText } from "ai";
import { openai } from '@ai-sdk/openai';

export const maxDuration = 299

export async function POST(req: Request) {

  const { messages: origMessages, conversationId, clientSlug } = await req.json()
  const messages= origMessages.filter((message: any) => message.role !== "system")
  // replace role function by system
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role === "function") {
      messages[i].role = "system"
    }
  }

  const currentUser= await getCurrentUser()
  const phone= currentUser?.email || "web-chat"

  let conversation= await getConversationDAO(conversationId)
  if (!conversation && conversationId === "new") {
    console.log("new conversation")
    
    const client= await getClientDAOBySlug(clientSlug)
    if (!client) return new Response("Client not found", { status: 404 })
    
    const created= await createConversation({
      clientId: client.id,
      phone: phone,
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


  // get rid of messages of type system
  const input= messages[messages.length - 1].content
  console.log("input: " + input)

  const contextString= await getContext(client.id, phone, input)

  const systemMessage= client.prompt + "\n" + contextString
  //messages.unshift(systemMessage)
  //const created= await messageArrived(phone, systemMessage.content, client.id, "system", "")
  const created= await createMessage({
    role: "system",
    content: systemMessage,
    conversationId: conversation.id,
  })

  console.log("messages.count: " + messages.length)

  // const functions= await getFunctionsDefinitions(clientId)

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

  const result= await streamText({
    model: openai("gpt-4o"),
    system: systemMessage,
    messages
  })


  return result.toAIStreamResponse();
}
