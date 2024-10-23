import { getClientDAOBySlugs } from "@/services/client-services"
import PromptVersionManager from "./prompt-version-manager"
import { getPromptVersionsDAO } from "@/services/prompt-version-services"

type Props= {
  params: {
    agencySlug: string
    clientSlug: string
  }
}
export default async function PromptPage({ params }: Props) {
    const agencySlug= params.agencySlug
    const clientSlug= params.clientSlug
        
    const client= await getClientDAOBySlugs(agencySlug, clientSlug)
    if (!client) {
      return <div>Cliente no encontrado</div>
    }

    const versions= await getPromptVersionsDAO(client.id)

    return (
      <PromptVersionManager clientId={client.id} prompt={client.leadPrompt || ""} versions={versions} timezone={"America/Montevideo"}/>
    )
}
