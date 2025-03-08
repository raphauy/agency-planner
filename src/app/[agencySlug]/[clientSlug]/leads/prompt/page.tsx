import { getClientDAOBySlugs } from "@/services/client-services"
import PromptVersionManager from "./prompt-version-manager"
import { getPromptVersionsDAO } from "@/services/prompt-version-services"

type Props= {
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
}
export default async function PromptPage(props: Props) {
  const params = await props.params;
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
