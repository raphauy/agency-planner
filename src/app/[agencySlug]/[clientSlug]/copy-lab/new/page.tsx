import { getCurrentUser } from "@/lib/utils"
import { getClientDAOBySlug } from "@/services/client-services"
import { ConversationFormValues, createConversation } from "@/services/conversation-services"
import { redirect } from "next/navigation"

type Props= {
    params: {
        agencySlug: string
        clientSlug: string
    }
}
export default async function NewConversationPage({ params }: Props) {
    const agencySlug= params.agencySlug
    const clientSlug= params.clientSlug
    const client= await getClientDAOBySlug(clientSlug)
    if (!client) return <div>Client not found</div>

    const currentUser= await getCurrentUser()
    if (!currentUser) return <div>No se encontró el usuario logueado</div>

    if (!currentUser.email) return <div>No se encontró el email del usuario logueado</div>

    const conversationFormValues: ConversationFormValues = {
        phone: currentUser.email,
        clientId: client.id
    }

    const created= await createConversation(conversationFormValues)

    redirect(`/${agencySlug}/${clientSlug}/copy-lab/${created.id}`)
    
  return (<div />)
}