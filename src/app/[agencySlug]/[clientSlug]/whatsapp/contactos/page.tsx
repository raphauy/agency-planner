import { getDatesFromSearchParams } from "@/lib/utils"
import { getClientDAOBySlugs } from "@/services/client-services"
import { getActiveComercialsDAO } from "@/services/comercial-services"
import { getFilteredContacts } from "@/services/contact-services"
import { getClientTags } from "@/services/repository-services"
import { getStagesDAO } from "@/services/stage-services"
import { notFound } from "next/navigation"
import DatesFilter from "../kanban/dates-filter"
import ComercialSelector from "./comercial-selector"
import { columns } from "./contact-columns"
import { BulkDeleteContactDialog } from "./contact-dialogs"
import { DataTable } from "./contact-table"
import StageSelector from "./stage-selector"
import TagSelector from "./tag-selector"

type Props= {
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
  searchParams: Promise<{
    from: string
    to: string
    last: string
    tags: string
    stageId: string
    comercialId: string
  }>
}

export default async function ContactsPage({ params, searchParams }: Props) {
  const { agencySlug, clientSlug }= await params
  const awaitedSearchParams= await searchParams
  console.log("searchParams: ", awaitedSearchParams)
  const client= await getClientDAOBySlugs(agencySlug, clientSlug)
  if (!client) return notFound()

  // dates
  const { from, to }= getDatesFromSearchParams(awaitedSearchParams)

  // tags
  const tags = typeof awaitedSearchParams.tags === 'string' 
    ? awaitedSearchParams.tags.split(",") 
    : []

  // stages
  const stageId= awaitedSearchParams.stageId ?? undefined
  const allStages= await getStagesDAO(client.id)

  // comercials
  const comercialId = awaitedSearchParams.comercialId ?? undefined
  const comercials = await getActiveComercialsDAO(client.id)

  const allTags= await getClientTags(client.id)

  const contacts= await getFilteredContacts(client.id, from, to, tags, stageId, comercialId)

  const baseUrl= `/${agencySlug}/${clientSlug}/whatsapp/contactos`

  return (
    <div className="p-4">
      <div className="space-y-4">
        <p className="text-2xl font-bold text-center">Contactos</p>
        <div className="flex items-center gap-2">
          <p className="font-bold w-20">Fecha:</p>
          <DatesFilter baseUrl={baseUrl} allTags={allTags} />
        </div>
        <div className="flex items-center gap-2 max-w-[820px] w-full">
          <p className="font-bold w-24">Estado:</p>
          <StageSelector baseUrl={baseUrl} allStages={allStages} />
        </div>
        {comercials.length > 0 && (
          <div className="flex items-center gap-2 max-w-[820px] w-full">
            <p className="font-bold w-24">Comercial:</p>
            <ComercialSelector baseUrl={baseUrl} comercials={comercials} />
          </div>
        )}
        <div className="flex items-center gap-2 max-w-[820px] w-full">
          <p className="font-bold w-24">Etiquetas:</p>
          <TagSelector actualTags={tags} allTags={allTags} baseUrl={baseUrl} />
        </div>
        <DataTable columns={columns} data={contacts} subject="Contacto" fieldToFilter="name"/>
      </div>

      <div className="flex justify-end mt-4">
        <BulkDeleteContactDialog ids={contacts.map(contact => contact.id)} />
      </div>

    </div>
  )
}