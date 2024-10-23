import { getCurrentUser } from "@/lib/utils"
import { getClientDAOBySlugs } from "@/services/client-services"
import { createConversation, getFullConversationDAO } from "@/services/conversation-services"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ChatComponent } from "../chat-component"

type Props = {
    params: {
        agencySlug: string
        clientSlug: string
        conversationId: string
    },
}
export default async function SimulatorPage({ params }: Props) {
    const agencySlug= params.agencySlug as string
    const clientSlug= params.clientSlug as string
    const conversationId= params.conversationId as string    

    if (!conversationId) return <div>ConversationId not found</div>

    const conversation= await getFullConversationDAO(conversationId)
    if (!conversation) {
        const currentUser= await getCurrentUser()
        if (!currentUser || !currentUser.email) return <div>No se encontró el usuario logueado</div>
        const now= new Date()
        const dayOfWeek= format(now, "eeee", { locale: es })
        const client= await getClientDAOBySlugs(agencySlug, clientSlug)
        if (!client) return <div>Client not found</div>
        const created= await createConversation({
            clientId: client.id,      
            phone: currentUser.email,
            name: currentUser.name,
            title: dayOfWeek,
            userId: currentUser.id,
            type: "COPY_LAB",
        })
        revalidatePath(`/${agencySlug}/${clientSlug}/copy-lab/${created.id}`)

        redirect(`/${agencySlug}/${clientSlug}/copy-lab/${created.id}`)
    }
  
    return (
        <div className="flex flex-col items-center w-full h-full">
          <ChatComponent agencySlug={agencySlug} clientSlug={clientSlug} conversation={conversation} />
        </div>
    )
}
