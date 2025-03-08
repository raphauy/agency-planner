import { getDomainsDAO } from "@/services/domain-services"
import { DomainDialog } from "./domain-dialogs"
import { DataTable } from "./domain-table"
import { columns } from "./domain-columns"
import { getClientDAOBySlugs } from "@/services/client-services"
import { getCurrentUser } from "@/lib/utils"

type Props= {
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
}

export default async function DomainPage(props: Props) {
  const params = await props.params;

  const client= await getClientDAOBySlugs(params.agencySlug, params.clientSlug)
  const data= await getDomainsDAO(client.id)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <DomainDialog clientId={client.id} />
      </div>

      <div className="bg-background mt-10">
        <DataTable columns={columns} data={data} subject="Domain"/>      
      </div>
    </div>
  )
}
  
