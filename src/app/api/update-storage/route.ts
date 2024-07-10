import { getClientDAOBySlug } from '@/services/client-services'
import { updatePublicationsUsage } from '@/services/cron-service'
import { NextResponse } from 'next/server'

export const maxDuration = 59

export async function GET(req: Request) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    const client= await getClientDAOBySlug("vinos-del-mundo")
    if (!client) {
        console.log("client not found")
        return
    }
    console.log(client?.name)

    await updatePublicationsUsage(client.id)

    return NextResponse.json({ ok: true })
}