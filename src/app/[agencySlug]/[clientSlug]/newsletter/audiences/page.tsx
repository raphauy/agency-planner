import { getAudiencesDAO } from "@/services/audience-services"
import { AudienceDialog } from "./audience-dialogs"
import { DataTable } from "./audience-table"
import { columns } from "./audience-columns"
import { getClientIdBySlugs } from "@/services/client-services"

type Props= {
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
}
export default async function AudiencePage(props: Props) {
  const params = await props.params;
  const clientId= await getClientIdBySlugs(params.agencySlug, params.clientSlug)
  if (!clientId)
    return <div>Cliente no encontrado</div>

  const data= await getAudiencesDAO(clientId)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <AudienceDialog clientId={clientId} />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Audience"/>      
      </div>
    </div>
  )
}
  
