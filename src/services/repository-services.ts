import { prisma } from "@/lib/db"
import { colorPalette } from "@/lib/utils"
import { FieldType } from "@prisma/client"
import { CoreTool, tool } from "ai"
import * as z from "zod"
import { getWhatsappInstance } from "./client-services"
import { getNextComercialIdToAssign } from "./comercial-services"
import { addTagsToContact, assignContactToComercial, setNewStage } from "./contact-services"
import { getConversationDAO } from "./conversation-services"
import { getDataTags, getFieldsDAO } from "./field-services"
import { sendFCNotifications, sendWebhookNotification } from "./notifications-service"
import { createRepoData, RepoDataFormValues } from "./repodata-services"

export type Property= {
  name: string
  type: "string" | "number" | "boolean" | "array"
  description: string
  items?: {
    type: "string"
    enum: string[]
  }
}

export type Parameters= {
  type: "object"
  properties: Property[]
  required: string[]
}

export type RepositoryDAO = {
	id: string
	name: string
	color: string
	isActive: boolean
	functionName: string
	functionDescription: string
	functionDefinition: string
	executionResponse: string
	webHookUrl: string | undefined
	uiLabel: string
	notifyPhones: string[]
	tags: string[]
	moveToStageId: string | undefined
	assignToComercial: boolean
	createdAt: Date
	updatedAt: Date
	clientId: string
}

export const RepositorySchema = z.object({
	name: z.string().min(1, "Nombre es obligatorio."),
	clientId: z.string().min(1, "clientId es obligatorio."),
})

export type RepositoryFormValues = z.infer<typeof RepositorySchema>


export async function getRepositorysDAO(clientId: string) {
  const found = await prisma.repository.findMany({
    where: {
      clientId
    },
    orderBy: {
      createdAt: 'desc'
    },
  })
  return found as RepositoryDAO[]
}

export async function getRepositoryDAO(id: string) {
  const found = await prisma.repository.findUnique({
    where: {
      id
    },
  })
  return found as RepositoryDAO
}


    
export async function createRepository(name: string, clientId: string) {

  // functionName: clean the spaces and lowercase only the first letter
  let functionName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "")
    .toLowerCase()
    .slice(0, 1) + 
    name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "")
    .slice(1)
  const isAvailable= await nameIsAvailable(functionName, clientId)
  if (!isAvailable) functionName= `${functionName}1`

  const functionDescription= `Esta función se debe utilizar ...
Instrucciones:
- Debes ir preguntando por la información necesaria para llenar cada campo en su orden de aparición
- Cada pregunta debe esperar su respuesta antes de hacer la siguiente pregunta.
- Cuando obtengas toda la información debes invocar la función.`

  const parameters: Parameters= {
    type: "object",
    properties: [],
    required: []
  }
  const color= colorPalette[Math.floor(Math.random() * colorPalette.length)]
  const data= {    
    name,
    color,
    isActive: true,    
    functionName,
    functionDescription,
    clientId
  }

  const created = await prisma.repository.create({
    data
  })

  // Generar la definición de la herramienta para el nuevo repositorio
  try {
    await updateRepositoryToolDefinition(created.id);
  } catch (error) {
    console.error("Error al generar la definición de la herramienta:", error);
    // No lanzamos el error para no interrumpir la creación del repositorio
  }

  return created
}

export async function setName(id: string, name: string) {
  const updated = await prisma.repository.update({
    where: {
      id
    },
    data: {
      name
    }
  })
  return updated
}

export async function setFunctionName(id: string, name: string) {
  const updated = await prisma.repository.update({
    where: {
      id
    },
    data: {
      functionName: name
    }
  })
  await updateRepositoryToolDefinition(id)
  return updated
}

export async function setFunctionDescription(id: string, description: string) {
  const updated = await prisma.repository.update({
    where: {
      id
    },
    data: {
      functionDescription: description
    }
  })
  await updateRepositoryToolDefinition(id)
  return updated
}

export async function setExecutionResponse(id: string, response: string) {
  const updated = await prisma.repository.update({
    where: {
      id
    },
    data: {
      executionResponse: response
    }
  })
  return updated
}

export async function setIsActive(id: string, isActive: boolean) {
  const updated = await prisma.repository.update({
    where: {
      id
    },
    data: {
      isActive
    }
  })
  return updated
}

export async function setWebHookUrl(id: string, webHookUrl: string) {
  const updated = await prisma.repository.update({
    where: {
      id
    },
    data: {
      webHookUrl
    }
  })
  return updated
}

export async function setNotifyPhones(id: string, notifyPhones: string[]) {
  const updated = await prisma.repository.update({
    where: {
      id
    },
    data: {
      notifyPhones
    }
  })
  return updated
}

export async function addTagToRepository(id: string, tag: string) {
  const updated = await prisma.repository.update({
    where: {
      id
    },
    data: {
      tags: {
        push: tag
      }
    }
  })
  return updated
}

export async function removeTagFromRepository(id: string, tag: string) {
  const tags= await prisma.repository.findUnique({
    where: {
      id
    },
    select: {
      tags: true
    }
  })
  const updatedTags= tags ? tags.tags.filter(t => t !== tag) : []
    const updated = await prisma.repository.update({
    where: {
      id
    },
    data: {
      tags: updatedTags
    }
  })
  return updated
}

export async function updateRepository(id: string, data: RepositoryFormValues) {
  // Obtener el repositorio actual para verificar si hay cambios relevantes
  const currentRepository = await getRepositoryDAO(id);
  
  // Actualizar el repositorio
  const updated = await prisma.repository.update({
    where: {
      id
    },
    data
  });
  
  // Verificar si se modificó el nombre o la descripción de la función
  const needsToolUpdate = 
    data.name !== currentRepository.name || // El nombre puede afectar al functionName
    (data as any).functionName !== currentRepository.functionName || // Si se modificó directamente functionName
    (data as any).functionDescription !== currentRepository.functionDescription; // Si se modificó la descripción
  
  // Actualizar la definición de la herramienta si es necesario
  if (needsToolUpdate) {
    await updateRepositoryToolDefinition(id);
  }
  
  return updated;
}

export async function deleteRepository(id: string) {
  const deleted = await prisma.repository.delete({
    where: {
      id
    },
  })
  return deleted
}

export async function nameIsAvailable(name: string, clientId: string) {
  const found = await prisma.repository.findMany({
    where: {
      functionName: name,
      clientId
    },
  })

  return found.length === 0
}

    
// Tipo para la definición serializada de una herramienta
export type SerializedToolDefinition = {
  functionName: string;
  description: string;
  parametersSchema: string; // Schema de Zod serializado
  repositoryId: string;
}

/**
 * Función interna para generar una herramienta CoreTool a partir de un repositorio y sus campos
 * @private
 */
async function _generateCoreTool(repositoryId: string): Promise<Record<string, CoreTool>> {
  const repository = await getRepositoryDAO(repositoryId);
  if (!repository) throw new Error("Repository not found");
  const fields = await getFieldsDAO(repositoryId);

  // Convertir los campos del repositorio a propiedades para la herramienta
  const parameters = z.object({
    ...fields.reduce((acc, field) => {
      // Determinar el tipo de campo para Zod
      let fieldSchema;
      
      switch (field.type) {
        case FieldType.string:
          fieldSchema = z.string();
          break;
        case FieldType.number:
          fieldSchema = z.number();
          break;
        case FieldType.boolean:
          fieldSchema = z.boolean();
          break;
        case FieldType.list:
          // Si es una lista con opciones predefinidas
          if (field.listOptions && field.listOptions.length > 0) {
            fieldSchema = z.enum(field.listOptions as [string, ...string[]]);
          } else {
            fieldSchema = z.array(z.string());
          }
          break;
        default:
          fieldSchema = z.string();
      }
      
      // Añadir descripción al campo
      fieldSchema = fieldSchema.describe(field.description);
      
      // Si el campo es requerido o no
      if (!field.required) {
        fieldSchema = fieldSchema.optional();
      }
      
      return {
        ...acc,
        [field.name]: fieldSchema
      };
    }, {}),
    // Añadir conversationId como campo requerido
    conversationId: z.string().describe("ID de la conversación")
  });

  // Crear la herramienta dinámica
  const dynamicTool = {
    [repository.functionName]: tool({
      description: repository.functionDescription,
      parameters,
      execute: async (args: Record<string, any>) => {
        // Llamar a la función genérica de ejecución con los argumentos
        return await genericExecute({
          ...args,
          repositoryId: repository.id,
          functionName: repository.functionName
        });
      }
    })
  };

  return dynamicTool as Record<string, CoreTool>;
}

/**
 * Serializa la definición de una herramienta para guardarla en la base de datos
 */
export async function serializeToolDefinition(repositoryId: string): Promise<string> {
  const repository = await getRepositoryDAO(repositoryId);
  if (!repository) throw new Error("Repository not found");
  const fields = await getFieldsDAO(repositoryId);
  
  // Crear un objeto que represente la definición de la herramienta
  const toolDefinition: SerializedToolDefinition = {
    functionName: repository.functionName,
    description: repository.functionDescription,
    parametersSchema: JSON.stringify(
      fields.map(field => ({
        name: field.name,
        type: field.type,
        description: field.description,
        required: field.required,
        listOptions: field.listOptions
      }))
    ),
    repositoryId: repository.id
  };
  
  // Serializar la definición completa
  return JSON.stringify(toolDefinition);
}

/**
 * Hidrata (deserializa) una definición de herramienta para convertirla en una CoreTool utilizable
 */
export function hydrateToolDefinition(serializedDefinition: string): Record<string, CoreTool> {
  // Deserializar la definición
  const toolDefinition: SerializedToolDefinition = JSON.parse(serializedDefinition);
  const fields = JSON.parse(toolDefinition.parametersSchema);
  
  // Crear el esquema de parámetros con Zod
  const parameters = z.object({
    ...fields.reduce((acc: Record<string, any>, field: any) => {
      // Determinar el tipo de campo para Zod
      let fieldSchema;
      
      switch (field.type) {
        case FieldType.string:
          fieldSchema = z.string();
          break;
        case FieldType.number:
          fieldSchema = z.number();
          break;
        case FieldType.boolean:
          fieldSchema = z.boolean();
          break;
        case FieldType.list:
          // Si es una lista con opciones predefinidas
          if (field.listOptions && field.listOptions.length > 0) {
            fieldSchema = z.enum(field.listOptions as [string, ...string[]]);
          } else {
            fieldSchema = z.array(z.string());
          }
          break;
        default:
          fieldSchema = z.string();
      }
      
      // Añadir descripción al campo
      fieldSchema = fieldSchema.describe(field.description);
      
      // Si el campo es requerido o no
      if (!field.required) {
        fieldSchema = fieldSchema.optional();
      }
      
      return {
        ...acc,
        [field.name]: fieldSchema
      };
    }, {}),
    // Añadir conversationId como campo requerido
    conversationId: z.string().describe("ID de la conversación")
  });
  
  // Crear la herramienta dinámica
  const dynamicTool = {
    [toolDefinition.functionName]: tool({
      description: toolDefinition.description,
      parameters,
      execute: async (args: Record<string, any>) => {
        // Llamar a la función genérica de ejecución con los argumentos
        return await genericExecute({
          ...args,
          repositoryId: toolDefinition.repositoryId,
          functionName: toolDefinition.functionName
        });
      }
    })
  };
  
  return dynamicTool as Record<string, CoreTool>;
}

/**
 * Actualiza el campo functionDefinition del repositorio con la definición serializada de la herramienta
 */
export async function updateRepositoryToolDefinition(repositoryId: string): Promise<void> {
  console.log("updateRepositoryToolDefinition", repositoryId)
  // Serializar la definición de la herramienta
  const serializedDefinition = await serializeToolDefinition(repositoryId);
  
  // Actualizar el campo functionDefinition del repositorio
  await prisma.repository.update({
    where: {
      id: repositoryId
    },
    data: {
      functionDefinition: serializedDefinition
    }
  });
}

/**
 * Obtiene la herramienta CoreTool desde la definición almacenada en la base de datos.
 * Si no existe una definición almacenada, la genera y la guarda automáticamente.
 * Esta es la función principal que debe utilizarse para obtener herramientas CoreTool.
 */
export async function getToolFromDatabase(repositoryId: string): Promise<Record<string, CoreTool>> {
  const repository = await getRepositoryDAO(repositoryId);
  if (!repository) throw new Error("Repository not found");
  
  try {
    // Si no hay definición almacenada o está vacía, generarla y guardarla
    if (!repository.functionDefinition || repository.functionDefinition === "") {
      // Generar la herramienta
      const tool = await _generateCoreTool(repositoryId);
      
      // Guardar la definición en la base de datos
      await updateRepositoryToolDefinition(repositoryId);
      
      return tool;
    }
    
    // Hidratar la definición almacenada
    return hydrateToolDefinition(repository.functionDefinition);
  } catch (error) {
    console.error("Error al obtener la herramienta:", error);
    
    // En caso de error al hidratar, regenerar la herramienta
    const tool = await _generateCoreTool(repositoryId);
    
    // Intentar actualizar la definición
    try {
      await updateRepositoryToolDefinition(repositoryId);
    } catch (updateError) {
      console.error("Error al actualizar la definición:", updateError);
    }
    
    return tool;
  }
}

// console.log("genericExecute", args)
// const { repositoryId } = args;
// const repository= await getRepositoryDAO(repositoryId)
// if (!repository) {
//   return "Ocurrió un error al ejecutar la función."
// }

// const response= repository.executionResponse
// console.log("response:", response)

// return response

export async function genericExecute(args: any)  {
  const { repositoryId, functionName, conversationId, ...data } = args;
  console.log("defaultFunction")
  console.log("repositoryId: ", repositoryId)
  console.log("functionName: ", functionName)
  console.log("conversationId: ", conversationId)
  console.log("data: ", data)
  console.log("args: ", args)

  try {

    const repo= await getRepositoryDAO(repositoryId)
    if (!repo) {
      return "Hubo un error al procesar esta solicitud"
    }
  
    if (!conversationId)
      return "conversationId es obligatorio"

    const conversation= await getConversationDAO(conversationId)
    if (!conversation)
      return `No se encontró la conversación con id ${conversationId}`
  
    const clientId= conversation.clientId
    const phone= conversation.phone
  
    const repoData: RepoDataFormValues= {
      clientId,
      phone,
      functionName: repo.functionName,
      repoName: repo.name,
      repositoryId: repo.id,
      data,
      conversationId
    }
  
    const created= await createRepoData(repoData)
    if (!created || !created.repositoryId)
      return "Hubo un error al procesar esta solicitud"
  
    if (repo.webHookUrl) {
      try {
        await sendWebhookNotification(repo.webHookUrl, created)
      } catch (error) {
        console.log("Error al enviar notificación a webhook")
      }
    }
    if (repo.notifyPhones.length > 0) {
      try {
        await sendFCNotifications(repo.notifyPhones, created)
      } catch (error) {
        console.log("Error al enviar notificación a whatsapp")
      }
    }

    const whatsappInstance= await getWhatsappInstance(clientId)
    const chatwootAccountId= whatsappInstance?.chatwootAccountId 

    const tags= repo.tags

    const contactId= conversation.contactId
    if (tags && chatwootAccountId && contactId) {
      const repoTags= await getDataTags(repo.id, data as string)
      const allTags= [...tags, ...repoTags]
      console.log("adding tags to contact, tags: ", allTags)
      await addTagsToContact(contactId, allTags, "FC-" + functionName)
    } else {
      console.log("no tags to add to contact")
    }

    const moveToStageId= repo.moveToStageId
    if (moveToStageId && chatwootAccountId && contactId) {
      console.log("setting new stage to contact, by: FC-" + functionName)
      await setNewStage(contactId, moveToStageId, "FC-" + functionName)
    }

    if (repo.assignToComercial && contactId) {
      const comercialId= await getNextComercialIdToAssign(clientId)
      if (comercialId) {
        console.log("assigning contact to comercial")
        await assignContactToComercial(contactId, comercialId)
      } else {
        console.log("no comercial to assign")
      }
    }

    return repo.executionResponse
  } catch (error) {
    console.log(error)
    return "Hubo un error al procesar esta solicitud"        
  }
}

export async function getClientTags(clientId: string){
  const repositories= await prisma.repository.findMany({
    where: {
      clientId
    },
    select: {
      tags: true
    }
  })
  return repositories.flatMap(repo => repo.tags)
}

export async function setMoveToStageIdOfRepository(repositoryId: string, moveToStageId: string) {
  const updated= await prisma.repository.update({
    where: {
      id: repositoryId
    },
    data: {
      moveToStageId
    }
  })
  return updated
}