import { UserDialog } from "@/app/admin/users/user-dialogs"
import { DataTable } from "@/app/admin/users/user-table"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getUsersOfAgency } from "@/services/user-services"
import { columns } from "./user-columns"

type Props = {
  params: {
    agencySlug: string
  }
}
export default async function UsersPage({ params }: Props) {
  const agencySlug= params.agencySlug
  const agency= await getAgencyDAOBySlug(agencySlug)
  const data= await getUsersOfAgency(agency.id)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <UserDialog agencyId={agency.id} />
      </div>

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white  bg-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="User" />
      </div>
    </div>
  )
}
  
