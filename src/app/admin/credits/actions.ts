"use server"

import { AgencyUsage, geTotaltUsage } from "@/services/usagetype-services"



  
export async function getUsageAction(from: Date, to: Date): Promise<AgencyUsage[]> {
    const data= await geTotaltUsage(from, to)

    return data
}