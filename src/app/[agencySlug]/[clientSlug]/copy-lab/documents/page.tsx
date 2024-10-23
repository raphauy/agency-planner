import { getClientDAOBySlugs } from "@/services/client-services"
import { getDocumentsDAOByClient } from "@/services/document-services"
import DocumentsTabs from "./documents-tabs"
import { DocumentType } from "@prisma/client"

type Props= {
  params: {
    agencySlug: string
    clientSlug: string
  }
}
export default async function DocumentsPage({ params }: Props) {
  const agencySlug= params.agencySlug as string
  const clientSlug= params.clientSlug
  const client= await getClientDAOBySlugs(agencySlug, clientSlug)
  if (!client) {
    return <div>Cliente no encontrado</div>
  }
  
  const data= await getDocumentsDAOByClient(client.id, DocumentType.COPY_LAB)

  return (
    <div className="w-full ml-5">

      <DocumentsTabs clientId={client.id} documents={data} type={DocumentType.COPY_LAB}/>

    </div>
  )
}
