import { getPendingInvitationsOfClient } from '@/services/invitation-services'
import { addListeners, getLastPublicationsWithoutListeners, getPublicationsDAO } from '@/services/publication-services'
import { getUsersOfClient } from '@/services/user-services'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 299

export async function GET(req: NextRequest) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    const max= parseInt(req.nextUrl.searchParams.get("max") || "10")
    console.log(`Starting update Publications Listeners with max: ${max}`)

    const publicactions= await getLastPublicationsWithoutListeners(max)
    const count= publicactions.length

    if (count === 0) {
        console.log("No publicactions without listeners")
    }

    for (const publicaction of publicactions) {
        
        const usersOfClient= await getUsersOfClient(publicaction.clientId)
        const pendingInvitations= await getPendingInvitationsOfClient(publicaction.clientId)
        const userIdsPendingInvitations= pendingInvitations.map((i) => i.userId)
        const activeUsers= usersOfClient.filter((user) => !userIdsPendingInvitations.includes(user.id))
        await addListeners(publicaction.id, activeUsers.map((user) => user.id))
        console.log(`added ${activeUsers.length} listeners to ${publicaction.title}, clientName: ${publicaction.client.name}`)

    }

    
    return NextResponse.json({ ok: true, data: { count } })
}