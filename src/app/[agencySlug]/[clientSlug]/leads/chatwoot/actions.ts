"use server"

import { checkNameAvailability, deleteWhatsappInstance, getClientDAO, getWhatsappInstance, setChatwootData, setWhatsappInstance } from "@/services/client-services"
import { connectInstance, connectionState, createInstanceBasic, deleteInstance, logoutInstance, restartInstance, enableChatwoot, disableChatwoot } from "@/services/wrc-sdk"
import { ChatwootParams, WhatsappInstanceDAO } from "@/services/wrc-sdk-types"
import { revalidatePath } from "next/cache"

export async function createInstanceAction(clientId: string) {
    const client= await getClientDAO(clientId)
    if (!client) {
        throw new Error('Client not found')
    }
    let instanceName= client.slug
    let nameAvailable= await checkNameAvailability(instanceName)
    if (!nameAvailable) {
        const agencySlug= client.agency.slug
        instanceName= agencySlug + "-" + instanceName
        nameAvailable= await checkNameAvailability(instanceName)
    }
    if (!nameAvailable) {
        throw new Error('Name already in use')
    }
    const response = await createInstanceBasic(instanceName)
    const instanceData: WhatsappInstanceDAO = {
        name: response.instance.instanceName,
        externalId: response.instance.instanceId,
        number: null,
        chatwootUrl: null,
        chatwootAccountId: null,
        chatwootAccessToken: null,
        clientId: client.id,
    }
    const instance = await setWhatsappInstance(instanceData)
    revalidatePath('[agencySlug]/[clientSlug]/leads', "page")
    return instance
}

export async function getConnectionStatusAction(instanceName: string) {
    const status = await connectionState(instanceName)
    return status
}

export async function connectInstanceAction(instanceName: string) {
    const instance = await connectInstance(instanceName)
    revalidatePath('[agencySlug]/[clientSlug]/leads', "page")
    return instance
}

export async function logoutInstanceAction(instanceName: string) {
    const instance = await logoutInstance(instanceName)
    revalidatePath('[agencySlug]/[clientSlug]/leads', "page")
    return instance
}

export async function deleteInstanceAction(instanceName: string) {
    const instance = await deleteInstance(instanceName)
    if (instance) {
        await deleteWhatsappInstance(instanceName)
    }
    revalidatePath('[agencySlug]/[clientSlug]/leads', "page")
    return instance
}

export async function restartInstanceAction(instanceName: string) {
    const instance = await restartInstance(instanceName)
    revalidatePath('[agencySlug]/[clientSlug]/leads', "page")
    return instance
}

export async function enableChatwootAction(clientId: string, instanceName: string, chatwootAccountId: number, signMsg: boolean) {
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
        signMsg,
        reopenConversation: false,
        conversationPending: true,
        nameInbox: "WhatsApp",
        importContacts: false,        
        importMessages: false,
        daysLimitImportMessages: 7,
        signDelimiter: '\n',
        autoCreate: true,
        organization: 'WRC',
        logo: '',
    }

    await enableChatwoot(instanceName, params)

    const chatwootUpdated= await setChatwootData(clientId, chatwootAccountId, token, url)

    revalidatePath('/admin/config')

    return chatwootUpdated
}

export async function disableChatwootAction(instanceName: string) {
    const result = await disableChatwoot(instanceName)
    return result
}

