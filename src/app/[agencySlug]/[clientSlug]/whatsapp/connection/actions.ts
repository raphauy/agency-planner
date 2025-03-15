"use server"

import { getInboxId } from "@/services/chatwoot"
import { deleteWhatsappInstance, getClientDAOBySlugs, getWhatsappInstance, setChatwootData, setWhatsappInboxId, setWhatsappInstance } from "@/services/client-services"
import { connectInstance, connectionState, createInstanceBasic, deleteInstance, disableChatwoot, enableChatwoot, logoutInstance, restartInstance } from "@/services/wrc-sdk"
import { ChatwootParams, WhatsappInstanceDAO } from "@/services/wrc-sdk-types"
import { revalidatePath } from "next/cache"

export async function createInstanceAction(agencySlug: string, clientSlug: string, chatwootAccountId: number) {
    const client= await getClientDAOBySlugs(agencySlug, clientSlug)    
    if (!client) {
        throw new Error('Client not found')
    }
    const instanceName= agencySlug + "-" + clientSlug
    const response = await createInstanceBasic(instanceName)
    const instanceData: WhatsappInstanceDAO = {
        name: response.instance.instanceName,
        externalId: response.instance.instanceId,
        number: null,
        whatsappInboxId: null,
        chatwootUrl: null,
        chatwootAccountId: null,
        chatwootAccessToken: null,
        clientId: client.id,
    }
    const instance = await setWhatsappInstance(instanceData)
    await enableChatwootAction(client.id, instance.name, chatwootAccountId)

    revalidatePath("[agencySlug]/[clientSlug]/whatsapp/connection","page")
    return instance
}

async function enableChatwootAction(clientId: string, instanceName: string, chatwootAccountId: number) {
    const url= process.env.CHATWOOT_URL
    const token= process.env.CHATWOOT_ACCESS_TOKEN
    if (!url || !token) {
        throw new Error('CHATWOOT_URL or CHATWOOT_ACCESS_TOKEN is not set')
    }
    const whatsappInstance = await getWhatsappInstance(clientId)
    if (!whatsappInstance) {
        throw new Error('Whatsapp instance not found')
    }

    const params: ChatwootParams = {
        enabled: true,
        accountId: String(chatwootAccountId),
        token,
        url,
        signMsg: false,
        reopenConversation: false,
        conversationPending: true,        
        nameInbox: "whatsapp",
        importContacts: false,        
        importMessages: false,
        daysLimitImportMessages: 7,
        signDelimiter: '\n',
        autoCreate: true,
        organization: 'WRC',
        logo: '',
    }

    await enableChatwoot(instanceName, params)

    const whatsappInboxId = await getInboxId(chatwootAccountId, "whatsapp")

    const chatwootUpdated= await setChatwootData(clientId, chatwootAccountId, token, url, String(whatsappInboxId))

    return chatwootUpdated
}

export async function getConnectionStatusAction(instanceName: string) {
    const status = await connectionState(instanceName)
    return status
}

export async function connectInstanceAction(instanceName: string) {
    const instance = await connectInstance(instanceName)
    revalidatePath("[agencySlug]/[clientSlug]/whatsapp/connection","page")
    return instance
}

export async function logoutInstanceAction(instanceName: string) {
    const instance = await logoutInstance(instanceName)
    revalidatePath("[agencySlug]/[clientSlug]/whatsapp/connection","page")
    return instance
}

export async function deleteInstanceAction(instanceName: string) {
    const instance = await deleteInstance(instanceName)
    if (instance) {
        await deleteWhatsappInstance(instanceName)
    }
    revalidatePath("[agencySlug]/[clientSlug]/whatsapp/connection","page")
    return instance
}

export async function restartInstanceAction(instanceName: string) {
    const instance = await restartInstance(instanceName)
    revalidatePath("[agencySlug]/[clientSlug]/whatsapp/connection","page")
    return instance
}


export async function disableChatwootAction(instanceName: string) {
    const result = await disableChatwoot(instanceName)
    return result
}

export async function setWhatsappInboxIdAction(clientId: string, whatsappInboxId: string) {
    const client = await setWhatsappInboxId(clientId, whatsappInboxId)
    revalidatePath("[agencySlug]/[clientSlug]/whatsapp/connection","page")
    return client
}