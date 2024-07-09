import OpenAI from "openai";
import { ChatCompletionCreateParams, ChatCompletionMessageParam, ChatCompletionSystemMessageParam } from "openai/resources/index.mjs";
import { Client } from "@prisma/client";
import { getDocumentsDAOByClient } from "./document-services";


// export async function completionInit(client: Client, functions: ChatCompletionCreateParams.Function[], messages: ChatCompletionMessageParam[], modelName?: string): Promise<CompletionInitResponse | null> {
  
//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY!,
//   })

//   let completionResponse= null
//   let agentes= false

//   let baseArgs = {
//     model: modelName,
//     temperature: 0.1,
//     messages
//   }  

//   const args = functions.length > 0 ? { ...baseArgs, functions: functions, function_call: "auto" } : baseArgs  

//   const initialResponse = await openai.chat.completions.create(args as any);

//   const usage= initialResponse.usage
//   console.log("\tusage:")
//   let promptTokens= usage ? usage.prompt_tokens : 0
//   let completionTokens= usage ? usage.completion_tokens : 0
//   console.log("\t\tpromptTokens: ", promptTokens)
//   console.log("\t\tcompletionTokens: ", completionTokens)  

//   let wantsToUseFunction = initialResponse.choices[0].finish_reason == "function_call"

//   let assistantResponse: string | null = ""

//   if (wantsToUseFunction) {
//     console.log("\twantsToUseFunction!")

//     const functionCall= initialResponse.choices[0].message.function_call
//     if (!functionCall) throw new Error("No function_call message")

//     const name= functionCall.name
//     let args = JSON.parse(functionCall.arguments || "{}")      

//     const content= await processFunctionCall(client.id, name, args)

//     messages.push(initialResponse.choices[0].message)
//     messages.push({
//       role: "function",
//       name, 
//       content,
//     })
//     agentes= getAgentes(name)

//     const stepResponse = await completionInit(client, functions, messages, modelName)
//     if (!stepResponse) return null

//     return {
//       assistantResponse: stepResponse.assistantResponse,
//       promptTokens: stepResponse.promptTokens + promptTokens,
//       completionTokens: stepResponse.completionTokens + completionTokens,
//       agentes: stepResponse.agentes || agentes
//     }

//   } else {
//     console.log("\tsimple response!")      
//     assistantResponse = initialResponse.choices[0].message.content
//     completionResponse= { assistantResponse, promptTokens, completionTokens, agentes }
//     return completionResponse
//   }
// }


export async function getContext(clientId: string, phone: string, userInput: string, brandVoice?: string) {
  let contextString= "Hablas correctamente el español, incluyendo el uso adecuado de tildes y eñes.\n"

  contextString+= "Cuando el usuario solicita un copy, debes utilizar la tool 'entregarCopys'\n"
  contextString+= "No hace falta explicar que vas a crear dos opciones, simplemente utiliza la función que ésta le mostrará al usuario el resultado.'\n"

  const documents= await getDocumentsDAOByClient(clientId)
  contextString+= "\n**** Documentos ****\n"
  if (documents.length === 0) {
    contextString+= "No hay documentos disponibles.\n"
  } else {
    contextString+= "Documentos que pueden ser relevantes para elaborar una respuesta:\n"
  }
  documents.map((doc) => {
    contextString += `{
documentId: "${doc.id}",
documentName: "${doc.name}",
documentDescription: "${doc.description}",
},
`
  })
  contextString+= "\n********************\n"

  if (brandVoice) {
    contextString+= `Voz de marca para tener en cuenta en los copys: \n`
    contextString+= `${brandVoice}.\n`
  }
  return contextString

}

