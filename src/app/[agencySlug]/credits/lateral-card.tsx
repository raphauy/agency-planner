"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type Props= {
    id: string
    name: string
    credits: number
    maxCredits: number
}
export default function LateralCard({ id, name, credits, maxCredits }: Props) {
    const searchParams= useSearchParams()
    const [selected, setSelected]= useState(false)

    useEffect(() => {
        const c= searchParams.get("c")
        
        if (!c && id === "agency") {
            setSelected(true)
        } else if (c === id) {
            setSelected(true)
        } else {
            setSelected(false)
        }
    }, [searchParams, id])

    const y= searchParams.get("y")
    const m= searchParams.get("m")
    let otherParams= ""
    if (y) {
        otherParams+= `&y=${y}`
    }
    if (m) {
        otherParams+= `&m=${m}`
    }    

    const creditsPercentage= credits / maxCredits * 100
    return (
        <Link href={`credits?c=${id}${otherParams}`} prefetch={false}>
            <div className={cn("p-4 border rounded-lg shadow-md bg-background", selected && "border-blue-500 bg-sky-50")}>
                <div className="flex justify-between items-center">
                    <div className="text-lg font-bold truncate">{name}</div>
                    <div className="text-sm text-muted-foreground">Créditos</div>
                </div>
                <div className="mt-2 text-3xl font-bold">{creditsPercentage.toFixed(1)}%</div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                        <div>{credits.toFixed(0)}</div>
                        <div>{maxCredits.toFixed(0)}</div>
                    </div>
                <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${creditsPercentage}%` }} />
                    </div>
                </div>
            </div>
        </Link>

    )
}