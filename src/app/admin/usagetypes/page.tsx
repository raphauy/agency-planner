import { getFullUsageTypesDAO } from "@/services/usagetype-services"
import { UsageTypeDialog } from "./usagetype-dialogs"
import { DataTable } from "./usagetype-table"
import { columns } from "./usagetype-columns"

export default async function UsageTypePage() {
  
  const data= await getFullUsageTypesDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <UsageTypeDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="UsageType"/>      
      </div>
    </div>
  )
}
  
