import { ChatwootUserDAO, getChatwootUsers, getComercialsDAO } from "@/services/comercial-services"
import { BriefcaseBusiness } from "lucide-react"
import { ComercialDialog } from "./comercial-dialogs"
import ComercialList from "./comercial-list"
import { getClientDAOBySlugs, getWhatsappInstance } from "@/services/client-services"
import { getNonComercialUsersDAO, UserDAO } from "@/services/user-services"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Props = {
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
}

export default async function ComercialPage({ params }: Props) {
  
  const { agencySlug, clientSlug }= await params

  const client= await getClientDAOBySlugs(agencySlug, clientSlug)
  if (!client) {
    return <div>Client not found</div>
  }
  const data= await getComercialsDAO(client.id)

  const users= await getNonComercialUsersDAO(client.id)
  const whatsappInstance= await getWhatsappInstance(client.id)
  if (!whatsappInstance) {
    return (
      <div className="mx-auto border-dashed border-2 rounded-lg p-12 text-center bg-muted">
        No hay instancia de WhatsApp configurada. Puedes configurarla en 
        <Link href={`/${agencySlug}/${clientSlug}/whatsapp/connection`}>
          <Button variant="link">Settings - ConectorQR</Button>
        </Link>
      </div>
    )
  }
  const allChhatwootUsers= await getChatwootUsers(Number(whatsappInstance?.chatwootAccountId))
  // filter bot user
  const chatwootUsers= allChhatwootUsers.filter(user => !data.some(comercial => comercial.chatwootUserId === user.id) && user.name !== "Automatización")

  if (data.length === 0) {
    return <div className="mx-10">{getEmptyComercialsComponent(client.id, users, chatwootUsers)}</div>
  }

  return (
    <div className="w-full max-w-lg mx-auto">

      <p className="text-3xl font-bold my-2 text-center">Comerciales</p>

      <ComercialList comercials={data} />

      <div className="flex justify-end mx-auto my-2">
        <ComercialDialog clientId={client.id} users={users} chatwootUsers={chatwootUsers} />
      </div>

    </div>
  )
}
  
function getEmptyComercialsComponent(clientId: string, users: UserDAO[], chatwootUsers: ChatwootUserDAO[]) {
  return (
    <div className="w-full max-w-5xl mx-auto py-12">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-muted">
        <div className="mb-6 flex justify-center">
          <BriefcaseBusiness className="h-16 w-16 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Aún no tienes comerciales
        </h3>
        <p className="text-gray-500 mb-6">
          Comienza agregando tu primer comercial
        </p>
        <ComercialDialog clientId={clientId} users={users} chatwootUsers={chatwootUsers} />
      </div>
    </div>
  )
}
