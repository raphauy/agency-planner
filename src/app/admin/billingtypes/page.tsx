import { getBillingTypesDAO } from "@/services/billingtype-services"
import { BillingTypeDialog } from "./billingtype-dialogs"
import { DataTable } from "./billingtype-table"
import { columns } from "./billingtype-columns"

export default async function UsersPage() {
  
  const data= await getBillingTypesDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <BillingTypeDialog />
      </div>

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="BillingType"/>      
      </div>
    </div>
  )
}
  
