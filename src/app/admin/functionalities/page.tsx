import { getFunctionalitysDAO } from "@/services/functionality-services"
import { FunctionalityDialog } from "./functionality-dialogs"
import { DataTable } from "./functionality-table"
import { columns } from "./functionality-columns"

export default async function UsersPage() {
  
  const data= await getFunctionalitysDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <FunctionalityDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Functionality"/>      
      </div>
    </div>
  )
}
  
