import { getPublicationsDAO, getPublicationsDAOByClientSlug } from "@/services/publication-services"
import { PublicationDialog } from "./publication-dialogs"
import { DataTable } from "./publication-table"
import { columns } from "./publication-columns"

type Props = {
  params: {
      agencySlug: string
      clientSlug: string
  }
}

export default async function UsersPage({ params }: Props) {
  const clientSlug= params.clientSlug
  
  const data= await getPublicationsDAOByClientSlug(clientSlug)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <PublicationDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Publication"/>      
      </div>
    </div>
  )
}
  
