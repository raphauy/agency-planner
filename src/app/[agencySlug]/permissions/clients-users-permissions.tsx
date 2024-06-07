"use client"

import { Switch } from "@/components/ui/switch"
import { ClientDAO, getClientsDAOByAgencyId } from "@/services/client-services"
import { useEffect, useState } from "react"
import { getClientsDAOByAgencyIdAction } from "../clients/client-actions"
import { changeClientUserPermissionAction } from "./permissions-actions"
import { toast } from "@/components/ui/use-toast"

type Props = {
    agencyId: string
    userId: string
    userClients: ClientDAO[]
}
export default function ClientsPermissions({ agencyId, userId, userClients }: Props) {

    const [allClients, setAllClients] = useState<ClientDAO[]>([])
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        
        getClientsDAOByAgencyIdAction(agencyId)
        .then((clients) => {
            setAllClients(clients)
        })
        .catch((error) => {
            console.error(error)
        })
    }, [agencyId])

    function handleClientChange(clientId: string) {
        setLoader(true)
        changeClientUserPermissionAction(userId, clientId)
        .then(() => {
            toast({ title: "Cliente modicado"})
        })
        .catch((error) => {
            console.error(error)
            toast({ title: "Error", description: error.message, variant: "destructive" })
        })
        .finally(() => {
            setLoader(false)
        })
    }
    
    return (
        <div className="space-y-1">
            {allClients.map((client) => (
            <div key={client.id} className="flex items-center gap-2">
                <Switch 
                    checked={userClients.some((userClient) => userClient.id === client.id)} 
                    onCheckedChange={() => handleClientChange(client.id)}
                />
                <p className="font-bold text-base">{client.name}</p>
            </div>
            ))}
        </div>
    )
}
