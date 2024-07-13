import { getClientDAOBySlug } from '@/services/client-services'
import { updatePublicationsUsage } from '@/services/cron-service'
import { getUsageByAgency } from '@/services/usagetype-services'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 59

export async function GET(req: NextRequest) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    const max= parseInt(req.nextUrl.searchParams.get("max") || "10")
    console.log(`Starting updatePublicationsUsage with max: ${max}`)

    await updatePublicationsUsage(max)

    // const clientId= "cly7oklva000411bdufo8x6c1"
    // const usage= await getUsageByClient(clientId, new Date(2024, 6, 1), new Date())
    // console.log(usage)

    const agencyId= "cluo7yx6d00016ocxpkq0eeak"
    const usage= await getUsageByAgency(agencyId, new Date(2024, 6, 1), new Date())
    console.log(usage)

    return NextResponse.json({ ok: true })
}