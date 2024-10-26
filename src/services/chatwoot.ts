import axios from 'axios'
import ChatwootClient from "@figuro/chatwoot-sdk"
import { getChatwootAccountId, getClientDAO } from './client-services'

export async function sendTextToConversation(accountId: number, conversationId: number, message: string) {
    const chatwootUrl= process.env.CHATWOOT_URL!
    const chatwootToken= process.env.CHATWOOT_AGENT_BOT_ACCESS_TOKEN!
    console.log("chatwootUrl:", chatwootUrl)
    console.log("chatwootToken:", chatwootToken)
    if (!chatwootUrl || !chatwootToken) {
        console.error("CHATWOOT_URL or CHATWOOT_AGENT_BOT_ACCESS_TOKEN is not set")
        return
    }

    const client = new ChatwootClient({
        config: {
            basePath: chatwootUrl,
            with_credentials: true,
            credentials: "include",
            token: chatwootToken
        }
    });

    await client.messages.create({
        accountId: accountId,
        conversationId: conversationId,
        data: {
            content: message
        }
    })
}

export async function addLabelToConversation(accountId: number, conversationId: number, labels: string[]) {
    const chatwootUrl= process.env.CHATWOOT_URL!
    const chatwootToken= process.env.CHATWOOT_ACCESS_TOKEN!
    console.log("chatwootUrl:", chatwootUrl)
    console.log("chatwootToken:", chatwootToken)
    if (!chatwootUrl || !chatwootToken) {
        console.error("CHATWOOT_URL or CHATWOOT_ACCESS_TOKEN is not set")
        return
    }

    const client = new ChatwootClient({
        config: {
            basePath: chatwootUrl,
            with_credentials: true,
            credentials: "include",
            token: chatwootToken
        }
    });

    console.log("labels:", labels)

    const addTagResponse = await client.conversationLabels.add({
        accountId,
        conversationId,
        data: {
            labels: labels
        }
    })
    
    console.log("Etiqueta añadida:", addTagResponse)
}

export async function addLabelToConversationByPhone(accountId: number, phone: string, labels: string[]) {
    const chatwootUrl= process.env.CHATWOOT_URL!
//    const chatwootToken= process.env.CHATWOOT_ACCESS_TOKEN!
    const chatwootToken = process.env.CHATWOOT_AGENT_BOT_ACCESS_TOKEN!
    console.log("chatwootUrl:", chatwootUrl)
    console.log("chatwootToken:", chatwootToken)
    if (!chatwootUrl || !chatwootToken) {
        console.error("CHATWOOT_URL or CHATWOOT_AGENT_BOT_ACCESS_TOKEN is not set")
        return
    }

    const client = new ChatwootClient({
        config: {
            basePath: chatwootUrl,
            with_credentials: true,
            credentials: "include",
            token: chatwootToken
        }
    });

    const contacts = await client.contacts.search({
        accountId: accountId,
        q: phone
    })

    const contactId = contacts.payload?.[0]?.id
    console.log("contactId:", contactId)
    if (!contactId) {
        console.error("Contact ID not found for phone number:", phone)
        return
    }

    const conversations = await client.contacts.listConversations({
        accountId: accountId,
        id: contactId
    })

    //console.log("conversations:", conversations)

    // @ts-ignore
    const conversationId = conversations.payload[0]?.id
    console.log("conversationId:", conversationId)

        const addTagResponse = await client.conversationLabels.add({
            accountId: accountId,
            conversationId: conversationId,
            data: {
                labels: labels
            }
        })
    
    console.log("Etiqueta añadida:", addTagResponse)



}

export async function createAgentBotToClient(clientId: string) {
    const client = await getClientDAO(clientId)
    if (!client) {
        console.error("Client not found")
        return
    }

    const chatwootAccountId = await getChatwootAccountId(client.id)
    if (!chatwootAccountId) {
        console.error("Chatwoot account ID not found")
        return
    }

    const chatwootUrl = process.env.CHATWOOT_URL!
    const chatwootToken = process.env.CHATWOOT_PLATFORM_APP_API_KEY!
    console.log("chatwootToken:", chatwootToken)
    const baseUrl = process.env.NEXTAUTH_URL


    if (!chatwootUrl || !chatwootToken) {
        console.error("CHATWOOT_URL or CHATWOOT_PLATFORM_APP_API_KEY is not set")
        return
    }

    try {
        const response = await axios.post(`${chatwootUrl}/platform/api/v1/agent_bots`,
            {
                name: `${client.name} Bot`,
                description: `Bot for ${client.name}`,
                account_id: chatwootAccountId,
                outgoing_url: `${baseUrl}/api/chatwoot`
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api_access_token': chatwootToken
                }
            }
        )

        console.log('Agent bot created successfully:', response.data)
    } catch (error: unknown) {
        console.error('Error creating agent bot:', error)
        if (error instanceof Error) {
            console.error('Error creating agent bot:', error.message);
        } else if (axios.isAxiosError(error) && error.response) {
            console.error('Error creating agent bot:', error.response.data);
        } else {
            console.error('Error creating agent bot:', String(error));
        }
    }
}

export async function removeAgentBotFromClient(botId: string) {

    const chatwootUrl = process.env.CHATWOOT_URL!
    const chatwootToken = process.env.CHATWOOT_PLATFORM_APP_API_KEY!
    console.log("chatwootUrl:", chatwootUrl)
    console.log("chatwootToken:", chatwootToken)
    if (!chatwootUrl || !chatwootToken) {
        console.error("CHATWOOT_URL or CHATWOOT_ACCESS_TOKEN is not set")
        return
    }

    try {
        const response = await axios.delete(`${chatwootUrl}/platform/api/v1/agent_bots/${botId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api_access_token': chatwootToken
                }
            }
        )
        console.log('Agent bot removed successfully:', response.data)
    } catch (error: unknown) {
        console.error('Error removing agent bot:', error)
    }
}


function getChatwootConfig(chatwootToken: string | undefined) {
    if (!chatwootToken) {
        console.error("CHATWOOT_ACCESS_TOKEN is not set")
        throw new Error("CHATWOOT_ACCESS_TOKEN is not set")
    }
    const chatwootUrl = process.env.CHATWOOT_URL!
    
    console.log("chatwootUrl:", chatwootUrl)
    console.log("chatwootToken:", chatwootToken)
    if (!chatwootUrl) {
        console.error("CHATWOOT_URL is not set")
        throw new Error("CHATWOOT_URL is not set")
    }

    return { chatwootUrl, chatwootToken }
}

async function getChatwootClient(token: string | undefined) {
    if (!token) {
        console.error("CHATWOOT_ACCESS_TOKEN is not set")
        throw new Error("CHATWOOT_ACCESS_TOKEN is not set")
    }
    const chatwootUrl = process.env.CHATWOOT_URL!
    
    console.log("chatwootUrl:", chatwootUrl)
    console.log("chatwootToken:", token)
    if (!chatwootUrl || !token) {
        console.error("CHATWOOT_URL or CHATWOOT_ACCESS_TOKEN is not set")
        throw new Error("CHATWOOT_URL or CHATWOOT_ACCESS_TOKEN is not set")
    }

    const client = new ChatwootClient({
        config: {
            basePath: chatwootUrl,
            with_credentials: true,
            credentials: "include",
            token
        }
    })
    if (!client) {
        console.error("Chatwoot client not found")
        throw new Error("Problem creating chatwoot client")
    }
    return client
}

export async function toggleConversationStatus(accountId: number, conversationId: number, status: "open" | "resolved" | "pending") {
    const chatwootUrl = process.env.CHATWOOT_URL!
    const chatwootToken= process.env.CHATWOOT_AGENT_BOT_ACCESS_TOKEN!
    console.log("chatwootUrl:", chatwootUrl)
    console.log("chatwootToken:", chatwootToken)
    if (!chatwootUrl || !chatwootToken) {
        console.error("CHATWOOT_URL or CHATWOOT_AGENT_BOT_ACCESS_TOKEN is not set")
        return
    }

    const client = await getChatwootClient(chatwootToken)

    await client.conversations.toggleStatus({
        accountId: accountId,
        conversationId: conversationId,
        data: {
            status: status
        }
    })

    console.log("Conversation status updated to:", status)
}

