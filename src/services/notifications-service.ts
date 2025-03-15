import axios from "axios";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { sendTextToConversation } from "./chatwoot";
import { getChatwootAccountId } from "./client-services";
import { getLastChatwootConversationIdByPhoneNumber } from "./contact-services";
import { RepoDataDAO } from "./repodata-services";

type RepoDataEntryResponse = {
    id: string,
    phone: string,
    functionName: string,
    clientId: string,
    clientName: string,
    clientSlug: string,
    conversationId: string,
    date: string,
    data: String,
}

type RepoDataWithClientName = RepoDataDAO & {
    client: {
        name: string,
        slug: string
    }
}

export function getProcessedRepoData(repoData: RepoDataWithClientName): Record<string, any> {
    const parsedData = JSON.parse(repoData.data as string);

    const jsonReplaced = Object.keys(parsedData).reduce((acc, key) => {
      acc[key] = parsedData[key] === true ? "SI" : parsedData[key] === false ? "NO" : parsedData[key];
      return acc;
    }, {} as Record<string, any>);

    return jsonReplaced
}

export async function sendWebhookNotification(webhookUrl: string, repoData: RepoDataWithClientName) {
    const jsonReplaced = getProcessedRepoData(repoData)

    const data: RepoDataEntryResponse = {
        id: repoData.id,
        phone: repoData.phone,
        functionName: repoData.functionName,
        clientId: repoData.clientId,
        clientName: repoData.client.name,
        clientSlug: repoData.client.slug,
        conversationId: repoData.conversationId,
        date: format(repoData.createdAt, "yyyy-MM-dd HH:mm", { locale: es }),
        data: JSON.stringify(jsonReplaced),
    }

    const init= new Date().getTime()
    try {
        // const response = await axios.post(webhookUrl, data, {
        const response = await axios.post(webhookUrl, data, {
                headers: {
                'Content-Type': 'application/json',
            },
            timeout: 20000, // 20 segundos
        })
        const elapsedTime = new Date().getTime() - init
        console.log(`Request took ${elapsedTime} milliseconds`)

        if (response.status !== 200) {
            console.error(`Failed to send webhook notification to ${webhookUrl} `, response.status, response.statusText)
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
            console.error('Request timed out');
        } else {
            const statusCode = (error as any).response?.status
            // if error es 400 log only the message
            if (statusCode === 400) {
                console.error('Failed to send webhook notification:', (error as any).response?.data?.message)
            } else {
                console.error('Failed to send webhook notification:', error)
            }
        }
    }
}

export async function sendFCNotifications(notifyPhones: string[], repoData: RepoDataWithClientName) {
    const jsonReplaced = getProcessedRepoData(repoData)
    console.log("jsonReplaced", jsonReplaced)

    const phone= repoData.phone
    const functionName= repoData.functionName
    const timezone= "America/Montevideo"
    const date= formatInTimeZone(repoData.createdAt, timezone, "yyyy-MM-dd HH:mm", { locale: es })

    // an special field is name, if it is not present, use the client name
    const name= jsonReplaced.nombre || undefined

    // create a text message to send to the users, use de FC name and the data
    let textMessage= `
**${functionName}**
${name ? `\n**Nombre:** ${name}` : ""}
**Teléfono:** ${phone}
**Fecha:** ${date}
---------------------------------
**Datos:**
`
    for (const key in jsonReplaced) {
        if (key !== "nombre") {
            textMessage+= `    **-${key}:** ${jsonReplaced[key]}
`
        }
    }

    console.log("message to send:")
    console.log(textMessage)

    const chatwootAccountId= await getChatwootAccountId(repoData.clientId)
    if (!chatwootAccountId) throw new Error("Chatwoot account not found for client " + repoData.clientId)

    // iterate over the notifyPhones array and send the message to each phone
    for (const destinationPhone of notifyPhones) {
        const chatwootConversationId= await getLastChatwootConversationIdByPhoneNumber(destinationPhone, repoData.clientId)
        if (!chatwootConversationId) {
            // log and continue
            console.log(`Chatwoot conversation not found for phone ${destinationPhone}`)
            continue
        } else {
            await sendTextToConversation(Number(chatwootAccountId), chatwootConversationId, textMessage)
            console.log(`Message sent to ${destinationPhone}`)
        }
    }
}


// export async function sendEventNotifications(notifyPhones: string[], repoData: RepoDataWithClientNameAndBooking) {
//     const jsonReplaced = getProcessedRepoData(repoData)
//     console.log("jsonReplaced", jsonReplaced)

//     const phone= repoData.phone
//     const functionName= repoData.functionName
//     const timezone= "America/Montevideo"
//     const date= formatInTimeZone(repoData.createdAt, timezone, "yyyy-MM-dd HH:mm", { locale: es })

//     // an special field is name, if it is not present, use the client name
//     const name= jsonReplaced.nombre || undefined

//     const booking= repoData.booking
//     if (!booking) throw new Error("Booking not found")

//     const bookingStart= format(booking.start, "yyyy-MM-dd HH:mm", { locale: es })
//     const bookingEnd= format(booking.end, "yyyy-MM-dd HH:mm", { locale: es })
//     const seats= booking.seats
//     const price= booking.price
//     const status= booking.status

//     // create a text message to send to the users, use de FC name and the data
//     let textMessage= `
// **Reserva para ${functionName}**
// ---------------------------------
// ${name ? `**Nombre:** ${name}` : ""}
// **Teléfono:** ${phone}
// **Fecha:** ${date}
// ---------------------------------
// **Reserva:**
//     - **Fecha:** ${bookingStart} - ${bookingEnd}
//     - **Cupos:** ${seats}
//     - **Estado:** ${status}
// ---------------------------------
// **Datos:**
// `
//     for (const key in jsonReplaced) {
//         if (key !== "nombre") {
//             textMessage+= `    **-${key}:** ${jsonReplaced[key]}
// `
//         }
//     }

//     console.log("message to send:")
//     console.log(textMessage)

//     const chatwootAccountId= await getChatwootAccountId(repoData.clientId)
//     if (!chatwootAccountId) throw new Error("Chatwoot account not found for client " + repoData.clientId)

//     // iterate over the notifyPhones array and send the message to each phone
//     for (const destinationPhone of notifyPhones) {
//         const chatwootConversationId= await getLastChatwootConversationIdByPhoneNumber(destinationPhone, repoData.clientId)
//         if (!chatwootConversationId) {
//             // log and continue
//             console.log(`Chatwoot conversation not found for phone ${destinationPhone}`)
//             continue
//         } else {
//             await sendTextToConversation(Number(chatwootAccountId), chatwootConversationId, textMessage)
//             console.log(`Message sent to ${destinationPhone}`)
//         }
//     }
// }
