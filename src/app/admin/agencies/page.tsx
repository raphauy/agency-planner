import { getAgencysDAO, getFullAgencysDAO } from "@/services/agency-services"
import { AgencyDialog } from "./agency-dialogs"
import { DataTable } from "./agency-table"
import { columns } from "./agency-columns"

export default async function UsersPage() {
  
  const data= await getFullAgencysDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2 gap-2">
        <AgencyDialog />
        <AgencyDialog igForm={true} />
      </div>

      <div className="container bg-white dark:bg-black p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Agency" columnsOff={["slug"]} />
      </div>
    </div>
  )
}
  
