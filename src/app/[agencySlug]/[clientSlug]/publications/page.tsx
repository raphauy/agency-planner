import { getPublicationsDAO, getPublicationsDAOByClient } from "@/services/publication-services"
import { PublicationDialog } from "./publication-dialogs"
import { DataTable } from "./publication-table"
import { columns } from "./publication-columns"
import { getClientDAOBySlugs } from "@/services/client-services"

type Props = {
  params: Promise<{
      agencySlug: string
      clientSlug: string
  }>
}

export default async function UsersPage(props: Props) {
  const params = await props.params;
  const agencySlug= params.agencySlug as string
  const clientSlug= params.clientSlug
  const client= await getClientDAOBySlugs(agencySlug, clientSlug)

  const data= await getPublicationsDAOByClient(client.id)

  return (
    <div className="w-full mt-5">      

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Publication"/>      
      </div>
    </div>
  )
}
  
