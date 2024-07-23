import { getFullPlansDAO } from "@/services/plan-services"
import { PlanDialog } from "./plan-dialogs"
import { DataTable } from "./plan-table"
import { columns } from "./plan-columns"

export default async function PlanPage() {
  
  const data= await getFullPlansDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <PlanDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Plan"/>      
      </div>
    </div>
  )
}
  
