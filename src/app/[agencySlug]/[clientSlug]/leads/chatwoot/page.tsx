import { getClientDAOBySlugs, getWhatsappInstance } from "@/services/client-services"
import { notFound } from "next/navigation"
import CreateInstanceButton from "./create-instance-button"
import { fetchInstance } from "@/services/wrc-sdk"
import { ConnectionDetails } from "./connection-details"

type Props= {
    params: {
        agencySlug: string
        clientSlug: string
    }
}
export default async function ChatwootPage({ params }: Props) {
    const { agencySlug, clientSlug } = params
    const client= await getClientDAOBySlugs(agencySlug, clientSlug)
    if (!client) {
        notFound()
    }
    const instance = await getWhatsappInstance(client.id)
    if (!instance) {
      const instanceName = client.slug
    
      return <div className="flex items-center justify-center w-full mt-10 border rounded-md border-dashed h-40">
        <CreateInstanceButton clientId={client.id} />
      </div>
    } else {
      const wrcInstance = await fetchInstance(instance.name)
      if (!wrcInstance) {
        return <div>No instance found</div>
      } else {
        return (
          <ConnectionDetails instance={wrcInstance} clientId={client.id} chatwootAccountId={instance.chatwootAccountId}/>
        )
      }
    }  

    return (
        <div></div>
    )
}