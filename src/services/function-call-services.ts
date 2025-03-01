import { DocumentType } from "@prisma/client";
import { StepResult } from "ai";
import { getDocumentsDAOByClient } from "./document-services";
import { createMessage, MessageFormValues } from "./message-services";


export async function getCopyLabContext(clientId: string, phone: string, userInput: string, brandVoice?: string) {
  let contextString= "Hablas correctamente el español, incluyendo el uso adecuado de tildes y eñes.\n"

  contextString+= "Cuando el usuario solicita un copy, debes utilizar la tool 'entregarCopys'\n"
  contextString+= "No hace falta explicar que vas a crear dos opciones, simplemente utiliza la función que ésta le mostrará al usuario el resultado.'\n"

  const documents= await getDocumentsDAOByClient(clientId, DocumentType.COPY_LAB)
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


export async function getLeadsContext(clientId: string, prompt: string) {
  let contextString= ""
  contextString+= prompt

  contextString+= "Hablas correctamente el español, incluyendo el uso adecuado de tildes y eñes.\n"
  contextString+= "Tu respuesta debe estar en formato whatsapp.\n"

  const documents= await getDocumentsDAOByClient(clientId, DocumentType.LEAD)
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

  
  return contextString
}

export async function saveLLMResponse(text: string, finishReason: string, usage: any, conversationId: string) {
 
  if (text) {
    const messageForm: MessageFormValues= {
      role: "assistant",
      content: text,
      tokens: usage.completionTokens + (usage.promptTokens * 3),
      conversationId,
    }        
    await createMessage(messageForm)
  }

  console.log("saveLLMResponse finishReason", finishReason)
  console.log("saveLLMResponse usage", usage)

  return
}

export async function saveToolCallResponse(event: StepResult<any>, conversationId: string) {

  const toolResults= event.toolResults
  if (!toolResults) {
    console.log("saveToolCallResponse toolResults is null")
    return
  }
  console.log("finishReason", event.finishReason)
  console.log("toolResults", toolResults)
  console.log("usage", event.usage)
  
  
  const usage= event.usage

  // Handle tool results
  for (const toolResult of toolResults) {
    const messageForm: MessageFormValues= {
      role: "function",
      content: "",
      name: toolResult.toolName,
      tokens: usage.completionTokens + (usage.promptTokens * 3),
      toolInvocations: JSON.stringify(toolResult),
      conversationId,
    }
    await createMessage(messageForm)

  }      

  return
}
