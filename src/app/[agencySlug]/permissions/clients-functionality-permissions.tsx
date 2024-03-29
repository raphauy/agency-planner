"use client"

import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { ClientDAO } from "@/services/client-services"
import { useEffect, useState } from "react"
import { getClientsDAOByAgencyIdAction, getClientsDAOByAgencySlugAction } from "../clients/client-actions"
import { changeClientFunctionalityPermissionAction } from "./permissions-actions"
import { FunctionalityDAO } from "@/services/functionality-services"
import { useAgencySlug } from "@/app/admin/users/use-roles"
import { Loader } from "lucide-react"

type Props = {
    functionality: FunctionalityDAO
}
export default function ClientsFunctionalityPermissions({ functionality }: Props) {

    const [allClients, setAllClients] = useState<ClientDAO[]>([])
    const [loader, setLoader] = useState(false)
    const [count, setCount] = useState(0)

    const agencySlug= useAgencySlug() as string

    useEffect(() => {
        getClientsDAOByAgencySlugAction(agencySlug)
        .then((clients) => {            
            setAllClients(clients)
        })
        .catch((error) => {
            console.error(error)
        })
    }, [agencySlug, count])

    function handleClientChange(clientId: string, functionalityId: string) {
        setLoader(true)
        changeClientFunctionalityPermissionAction(functionalityId, clientId)
        .then(() => {
            toast({ title: "Cliente modicado"})
            setCount(count + 1)
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
        <div className="space-y-1">
            {allClients.map((client) => (
            <div key={client.id} className="flex items-center gap-2">
                <Switch 
                    checked={client.functionalities.some((f) => f.id === functionality.id)}
                    onCheckedChange={() => handleClientChange(client.id, functionality.id)}
                />
                <p className="font-bold text-base">{client.name}</p>
            </div>
            ))}
        </div>
    )
}
