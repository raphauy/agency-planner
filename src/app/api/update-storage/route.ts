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
    
    return NextResponse.json({ ok: true })
}