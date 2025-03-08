import { sendTextToConversation, toggleConversationStatus } from "@/services/chatwoot";
import { getClientDAO, getClientIdByChatwootAccountId } from "@/services/client-services";
import { MessageDelayResponse, onMessageReceived, processDelayedMessage } from "@/services/messageDelayService";
import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";


export const maxDuration = 299

export async function POST(request: Request) {

    try {
        const json= await request.json()
        console.log("general api json: ", json)
        if (!json.account || !json.conversation) {
            console.log("error: ", "account or conversation is missing")
            return NextResponse.json({ data: "ACK" }, { status: 200 })
        }
        const accountId= json.account.id
        const conversationId= json.conversation.id
        const contentType= json.content_type
        const content= json.content
        const messageType= json.message_type
        const inboxId= json.inbox.id
        const inboxName= json.inbox.name
        const conversationStatus= json.conversation.status
        const senderName= json.sender.name
        let phone= json.sender.phone_number
        console.log("accountId: ", accountId)
        console.log("conversationId: ", conversationId)
        console.log("contentType: ", contentType)
        console.log("content: ", content)
        console.log("messageType: ", messageType)
        console.log("inboxId: ", inboxId)
        console.log("inboxName: ", inboxName)
        console.log("conversationStatus: ", conversationStatus)
        console.log("senderName: ", senderName)
        console.log("phone: ", phone)

        if (conversationStatus !== "pending") {
            console.log("skipping message because conversationStatus is not pending: ", conversationStatus)
            return NextResponse.json({ data: "ACK" }, { status: 200 })
        }

        if (!accountId || !conversationId || !contentType) {
            console.log("error: ", "accountId, conversationId or contentType is missing")
            return NextResponse.json({ data: "ACK" }, { status: 200 })
        }

        if (messageType !== "incoming") {
            console.log("messageType is not incoming: ", messageType)
            return NextResponse.json({ data: "ACK" }, { status: 200 })
        }

        if (senderName === "EvolutionAPI" || phone === "+123456") {
            console.log("connection API message, not processed")
            return NextResponse.json({ data: "ACK" }, { status: 200 })
        }

        const clientId= await getClientIdByChatwootAccountId(accountId)
        if (!clientId) {
            console.log("error: ", "clientId not found")
            return NextResponse.json({ data: "ACK" }, { status: 200 })
        }

        const client= await getClientDAO(clientId)

        const ignoredNumbers= client.ignoredNumbers
        if (ignoredNumbers && ignoredNumbers.includes(phone)) {
            console.log("[IGNORED] phone is in ignoredNumbers, skipping message")
            if (conversationStatus === "pending") {
                // TODO: change conversation status to open
                await toggleConversationStatus(accountId, conversationId, "open")
            }
            return NextResponse.json({ data: "ACK" }, { status: 200 })
        }

        if (inboxId === 10 && phone !== "+59892265737") {
            console.log("phone is not allowed for this account")
            return NextResponse.json({ data: "ACK" }, { status: 200 })
        }

        if (contentType !== "text" || !content) {
            console.log("error: ", "contentType is not text or content is missing")
            await sendTextToConversation(accountId, conversationId, "Por el momento solo podemos procesar mensajes de texto")
            return NextResponse.json({ data: "ACK" }, { status: 200 })
        }

        if (!phone) {
            phone= json.sender.name
        }

        const delayResponse: MessageDelayResponse= await onMessageReceived(phone, content, clientId, "user", undefined, conversationId)
        
        if (delayResponse.wasCreated ) {
            if (delayResponse.message) {
                waitUntil(processDelayedMessage(delayResponse.message.id, phone))
                
            } else {
                console.log("delayResponse.message wasCreated but is null")
                return NextResponse.json({ error: "there was an error processing the message" }, { status: 502 })
            }
        } else {
            console.log(`message from ${phone} was updated, not processed`)
        }        

    
        return NextResponse.json({ data: "ACK" }, { status: 200 })
    
    } catch (error) {
        console.log("error: ", error)
        return NextResponse.json({ error: "error: " + error}, { status: 502 })                
    }

}

export async function GET(request: Request) {
    const res= "API is working"
    return NextResponse.json( { "data": res }, { status: 200 })
}


function processConnectionUpdate(json: any) {
    console.log("processing connection update")
    console.log("json: ", json)
}