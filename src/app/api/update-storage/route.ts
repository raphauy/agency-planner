import { updatePublicationsUsage } from '@/services/cron-service'
import { sendWapMessage } from '@/services/whatsapp-service'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 299

const RCPhone= process.env.RC_PHONE

export async function GET(req: NextRequest) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    const max= parseInt(req.nextUrl.searchParams.get("max") || "10")
    console.log(`Starting updatePublicationsUsage with max: ${max}`)

    const agenciesNames= await updatePublicationsUsage(max)

    const actualHour= new Date().getHours()
    const actualMinute= new Date().getMinutes()
    if (agenciesNames.length > 0) {
        const message= `Agencies updated: ${agenciesNames.join(", ")}`
        console.log(message)
        await sendWapMessage(RCPhone!, message)
    } else if (actualMinute === 0 && (actualHour === 9 || actualHour === 12 || actualHour === 15 || actualHour === 18 || actualHour === 21 || actualHour === 0)) {
        const message= `Ping from Agency Planner`
        console.log(message)
        await sendWapMessage(RCPhone!, message)
    }
    
    return NextResponse.json({ ok: true })
}