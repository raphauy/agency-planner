"use client"

import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

type Props= {
    clientId: string
    checked: boolean
    description: string
    info: string
    switchUpdate: (id: string, value: boolean) => Promise<boolean>
}
export default function SwitchBox({ clientId, checked, description, info, switchUpdate }: Props) {
    return (
        <div className="mt-5 flex items-center gap-3">
            <Switch checked={checked} onCheckedChange={() => switchUpdate(clientId, !checked)} />
            <p>{description}</p>
            <Tooltip >
                <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-md p-4">
                    {info}
                </TooltipContent>
            </Tooltip>
        </div>
    )
}
