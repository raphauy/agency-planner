import { getDatesFromSearchParams } from "@/lib/utils";
import { getClientDAOBySlugs } from "@/services/client-services";
import { getComercialsDAO } from "@/services/comercial-services";
import { getKanbanStagesDAO } from "@/services/stage-services";
import { notFound } from "next/navigation";
import DatesFilter from "./dates-filter";
import { KanbanComponent } from "./kanban";
import { getClientTags } from "@/services/repository-services";

type Props= {
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
  searchParams: Promise<{
    from: string
    to: string
    last: string
    phone: string
  }>
}

export default async function CRMKanban({ params, searchParams }: Props) {

  const awaitedParams= await params
  const awaitedSearchParams= await searchParams

  const { from, to }= getDatesFromSearchParams(awaitedSearchParams)
  const phone= awaitedSearchParams.phone

  const client = await getClientDAOBySlugs(awaitedParams.agencySlug, awaitedParams.clientSlug)
  if (!client) {
    notFound()
  }
  const stages = await getKanbanStagesDAO(client.id, from, to)
  const allTags = await getClientTags(client.id)
  const baseUrl= `/${awaitedParams.agencySlug}/${awaitedParams.clientSlug}/whatsapp`
  const comercials= await getComercialsDAO(client.id)
  return (
    <div className="ml-1">
      <div className="flex items-center gap-2">
        <p className="font-bold w-20">Fecha:</p>
        <DatesFilter baseUrl={baseUrl} allTags={allTags} />
      </div>

      <KanbanComponent initialStages={stages} clientId={client.id} allTags={allTags} comercials={comercials} phone={phone} />
    </div>
  )
}

