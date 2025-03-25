import { getCurrentUser } from "@/lib/utils"
import RepositoriesTabs from "./repo-tabs"
import { notFound } from "next/navigation"
import { getRepositorysDAO } from "@/services/repository-services"
import { getClientIdBySlugs } from "@/services/client-services"

type Props = {
  params: Promise<{
      agencySlug: string
      clientSlug: string
  }>
}

export default async function RepositoryPage(props: Props) {
  const params = await props.params;
  const agencySlug= params.agencySlug as string
  const clientSlug= params.clientSlug
  const basePath= `/${agencySlug}/${clientSlug}/whatsapp`

  const user= await getCurrentUser()
  if (user?.email !== "rapha.uy@rapha.uy" && user?.email !== "gabi@tinta.wine") {
    return <div className="text-center border-dashed border-2 p-4 rounded-md w-full">Solo administradores pueden editar los repositorios</div>
  }

  const clientId= await getClientIdBySlugs(agencySlug, clientSlug)
  if (!clientId) {
    return <div>Cliente no encontrado</div>
  }
  
  const repositories= await getRepositorysDAO(clientId)

  return (
    <div className="w-full ml-4">

      <RepositoriesTabs clientId={clientId} repositories={repositories} basePath={basePath} />

    </div>
  )
}
