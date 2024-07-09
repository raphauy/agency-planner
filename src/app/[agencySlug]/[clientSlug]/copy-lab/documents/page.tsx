import { DocumentDialog } from "./document-dialogs"
import { DataTable } from "./document-table"
import { columns } from "./document-columns"
import { getDocumentsDAOByClient } from "@/services/document-services"
import { getClientDAOBySlug } from "@/services/client-services"
import DocumentsTabs from "./documents-tabs"

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
    <div className="w-full ml-5">

      <DocumentsTabs clientId={client.id} documents={data} />

    </div>
  )
}
