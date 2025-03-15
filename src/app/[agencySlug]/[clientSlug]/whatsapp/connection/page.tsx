import { getClientDAOBySlugs, getWhatsappInstance } from "@/services/client-services"
import { fetchInstance } from "@/services/wrc-sdk"
import { ConnectionDetails } from "./connection-details"
import CreateInstanceButton from "./create-instance-button"

type Props = {
    params: Promise<{
        agencySlug: string
        clientSlug: string
    }>
}
export default async function WhatsappPage({ params }: Props) {
    const { agencySlug, clientSlug } = await params
    const client= await getClientDAOBySlugs(agencySlug, clientSlug)
    if (!client) return <div>Cliente no encontrado: {clientSlug}</div>

    const whatsappInstance= await getWhatsappInstance(client.id)    
    if (!whatsappInstance) {      
        return (
            <CreateInstanceButton />
        )
    }

    const wrcInstance = await fetchInstance(whatsappInstance.name)
    if (!wrcInstance) return <div>No se pudo obtener la instancia {whatsappInstance.name} en WRC</div>

    return (
        <div className="mt-10">
            <ConnectionDetails instance={wrcInstance} clientId={client.id} chatwootAccountId={whatsappInstance.chatwootAccountId?.toString()} whatsappInboxId={whatsappInstance.whatsappInboxId}/>
        </div>
    )

}