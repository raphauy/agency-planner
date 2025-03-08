import { getClientDAOBySlugs } from "@/services/client-services"
import { updatePromptAction } from "./actions"
import { PromptForm } from "./prompt-form"

type Props= {
    params: Promise<{
        agencySlug: string
        clientSlug: string
    }>
}  
export default async function PromptPage(props: Props) {
    const params = await props.params;
    const agencySlug= params.agencySlug as string
    const clientSlug= params.clientSlug as string

    const client= await getClientDAOBySlugs(agencySlug, clientSlug)
    if (!client) {
      return <div>Cliente no encontrado</div>
    }

    return (
        <div className="container mt-10 space-y-5">
            <div 
                className="w-full p-4 border rounded-lg">
                <p className="text-2xl font-bold">{client.name}</p>
                <PromptForm id={client.id} update={updatePromptAction} prompt={client.prompt || ""} />
            </div>
            
        </div>
    )
}
