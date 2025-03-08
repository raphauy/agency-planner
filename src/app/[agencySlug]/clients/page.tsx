import { getClientsDAO, getClientsDAOByAgencyId, getClientsOfCurrentUser } from "@/services/client-services"
import { ClientDialog } from "./client-dialogs"
import { DataTable } from "./client-table"
import { columns } from "./client-columns"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getCurrentRole } from "@/lib/utils"
 
type Props= {
  params: Promise<{
    agencySlug: string
  }>
}

export default async function ClientsPage(props: Props) {
  const params = await props.params;

  const agencySlug= params.agencySlug
  const agency= await getAgencyDAOBySlug(agencySlug)
  const currentRole= await getCurrentRole()
  const data= currentRole === "ADMIN" ? await getClientsDAOByAgencyId(agency.id) : await getClientsOfCurrentUser()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2 gap-2">
        <ClientDialog />
        <ClientDialog igForm={true} agencyId={agency.id} />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Client" columnsOff={["slug"]} />
      </div>
    </div>
  )
}
  
