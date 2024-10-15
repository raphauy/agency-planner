"use client"

import { useAgencySlug } from "@/app/admin/users/use-roles"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { ChannelDAO } from "@/services/channel-services"
import { ClientDAO } from "@/services/client-services"
import { useEffect, useState } from "react"
import { changeClientChannelPermissionAction } from "../../permissions/permissions-actions"
import { ChannelStatus } from "@prisma/client"
import { Loader } from "lucide-react"

type Props = {
    channel: ChannelDAO
    clientId: string
    isEnabled: boolean
}
export default function ToggleChannel({ channel, clientId, isEnabled }: Props) {

    const [loader, setLoader] = useState(false)

    function handleClientChange(clientId: string, functionalityId: string) {
        setLoader(true)
        changeClientChannelPermissionAction(channel.id, clientId)
        .then(() => {
            toast({ title: "Cliente asignado al canal"})
        })
        .catch((error) => {
            console.error(error)
            toast({ title: "Error", description: error.message })
        })
        .finally(() => {
            setLoader(false)
        })
    }

    return (
        <div className="flex items-center gap-2 mt-6">
            <p className="font-bold text-base w-32">{channel.name}</p>
            <div className="w-16 flex justify-end">
                {
                    loader ? (
                        <Loader className="animate-spin" />
                    ) : (
                        <Switch
                        disabled={channel.status === ChannelStatus.INACTIVE}
                        checked={isEnabled}
                        onCheckedChange={() => handleClientChange(clientId, channel.id)}
                        />
                    )
                }
            </div>
            {
                channel.status === ChannelStatus.INACTIVE && (
                    <p className="text-sm text-gray-500">
                        Este canal aún no está disponible
                    </p>
                )
            }

        </div>
    )
}
