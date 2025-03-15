"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StageDAO } from "@/services/stage-services"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type Props= {
  baseUrl: string
  allStages: StageDAO[]
}

export default function StageSelector({ baseUrl, allStages }: Props) {
    const [stageId, setStageId]= useState<string>("")

    const searchParams= useSearchParams()
    const router= useRouter()

    useEffect(() => {
        const stageId= searchParams.get("stageId")
        if (stageId) {
            setStageId(stageId)
        }
    }, [searchParams])

    function updateStage(stageId: string) {
        setStageId(stageId)
        const allParams = searchParams.toString()
        // Remove stage params along with the leading ampersand if necessary
        let newParams= allParams.replace(/([&]?)(stageId)=[^&]+/g, "")
        newParams= newParams.startsWith("&") ? newParams.slice(1) : newParams
        const restOfTheParams= newParams ? `&${newParams}` : ""
        const stageParam= stageId ? `stageId=${stageId}` : ""
        const newUrl= `${baseUrl}?${stageParam}${restOfTheParams}`
        router.push(newUrl)
    }


    return (
        <div className="flex items-center gap-2 w-full">
            <Select value={stageId} onValueChange={updateStage} >
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" >
                        {stageId ? <Badge variant="stage">{allStages.find((s) => s.id === stageId)?.name}</Badge> : "Filtrar por estado"}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {allStages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}><Badge variant="stage">{stage.name}</Badge></SelectItem>
                    ))}
                </SelectContent>
            </Select>        
            {stageId && <Button variant="outline" onClick={() => updateStage("")}>
                <X />
            </Button>}
        </div>
    )
}