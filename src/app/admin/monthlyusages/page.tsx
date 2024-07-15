import { getFullMonthlyUsagesDAO } from "@/services/monthlyusage-services"
import { MonthlyUsageDialog } from "./monthlyusage-dialogs"
import { DataTable } from "./monthlyusage-table"
import { columns } from "./monthlyusage-columns"

export default async function MonthlyUsagePage() {
  
  const data= await getFullMonthlyUsagesDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <MonthlyUsageDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="MonthlyUsage"/>      
      </div>
    </div>
  )
}
  
