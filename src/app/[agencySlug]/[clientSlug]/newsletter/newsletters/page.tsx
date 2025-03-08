import { getNewslettersDAO } from "@/services/newsletter-services"
import { NewsletterDialog } from "./newsletter-dialogs"
import { DataTable } from "./newsletter-table"
import { columns } from "./newsletter-columns"
import { getClientDAOBySlugs } from "@/services/client-services"

type Props= {
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
}

export default async function NewsletterPage(props: Props) {
  const params = await props.params;

  const client= await getClientDAOBySlugs(params.agencySlug, params.clientSlug)
  if (!client) {
    return <div>Client not found</div>
  }

  const data= await getNewslettersDAO(client.id)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <NewsletterDialog clientId={client.id} />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Newsletter"/>      
      </div>
    </div>
  )
}
  
