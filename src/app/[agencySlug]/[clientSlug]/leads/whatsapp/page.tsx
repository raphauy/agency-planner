import { getClientDAOBySlugs, getWhatsappInstance } from "@/services/client-services"
import { notFound } from "next/navigation"
import { fetchInstance } from "@/services/wrc-sdk"
import Link from "next/link"
import { WhatsappDetails } from "./whatsapp-details"
import { Button } from "@/components/ui/button"

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

  let message
  const instance = await getWhatsappInstance(client.id)
  if (!instance) {
    message = "No hay instancia WRC, debe crearla en el menú Chatwoot"
  } else {
    const wrcInstance = await fetchInstance(instance.name)
    if (!wrcInstance) {
      message = "Instancia WRC no encontrada"
    } else {
      if (!instance.chatwootAccountId) {
        message = "No hay cuenta de Chatwoot asociada, debe crearla en el menú Chatwoot"
      } else {
        return (
          <WhatsappDetails instance={wrcInstance} clientId={client.id} chatwootAccountId={instance.chatwootAccountId}/>
      )
      }
    }
  }  

  return (
    <div className="flex flex-col space-y-4 items-center justify-center w-full mt-10 border rounded-md border-dashed h-40">
      <p>{message}</p>
      <Link href={`/${agencySlug}/${clientSlug}/leads/chatwoot`} prefetch={false}>
        <Button>Ir a Chatwoot</Button>
      </Link>
    </div>
  )
}