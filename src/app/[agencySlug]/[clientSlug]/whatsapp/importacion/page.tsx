import { getImportedContactsDAO } from "@/services/imported-contacts-services"
import { CSVImporter } from "./csv-importer"
import { columns } from "./imported-contact-columns"
import { ImportedContactDialog } from "./imported-contact-dialogs"
import { DataTable } from "./imported-contact-table"
import { getClientDAOBySlugs } from "@/services/client-services"

type Props= {
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
}

export default async function ImportedContactPage({ params }: Props) {
  const { agencySlug, clientSlug } = await params
  const client= await getClientDAOBySlugs(agencySlug, clientSlug)
  if (!client) {
    return <div>Cliente no encontrado</div>
  }
  const data= await getImportedContactsDAO(client.id)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2 gap-2">
        <ImportedContactDialog clientId={client.id} />
        <CSVImporter clientId={client.id} />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="ImportedContact"/>      
      </div>
    </div>
  )
}
  
