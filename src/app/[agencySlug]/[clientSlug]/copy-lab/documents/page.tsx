import { DocumentDialog } from "./document-dialogs"
import { DataTable } from "./document-table"
import { columns } from "./document-columns"
import { getDocumentsDAOByClient } from "@/services/document-services"
import { getClientDAOBySlug } from "@/services/client-services"

type Props= {
  params: {
    clientSlug: string
  }
}
export default async function UsersPage({ params }: Props) {
  const clientSlug= params.clientSlug
  const client= await getClientDAOBySlug(clientSlug)
  if (!client) {
    return <div>Cliente no encontrado</div>
  }
  
  const data= await getDocumentsDAOByClient(client.id)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <DocumentDialog clientId={client.id} />
      </div>

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white bg-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Documento"/>      
      </div>
    </div>
  )
}
  
