import { getBillableItemsDAO } from "@/services/billableitem-services"
import { getBillingTypesDAO } from "@/services/billingtype-services"
import { columns } from "../billingtypes/billingtype-columns"
import { BillingTypeDialog } from "../billingtypes/billingtype-dialogs"
import { DataTable } from "../billingtypes/billingtype-table"
import { columns as billableItemsTableColumns } from "./billableitem-columns"
import { DataTable as BillableItemsTable } from "./billableitem-table"

export default async function UsersPage() {
  
  const dataBillingTypes= await getBillingTypesDAO()
  const data= await getBillableItemsDAO(50)
  const billableTypes= await getBillingTypesDAO()
  const billableTypesStr= billableTypes.map((bt) => bt.name)

  const agencies= Array.from(new Set(data.map((bi) => bi.agency.name)))
  let clients: string[]= []
  data.forEach((bi) => {
    if (bi.client) {
      clients.push(bi.client.name)
    }
  })

  return (
    <div className="w-full">      

      <div className="container bg-white mb-5 p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <BillableItemsTable columns={billableItemsTableColumns} data={data} subject="BillableItem" agencies={agencies} clients={clients} billableTypes={billableTypesStr}/>
      </div>

      <div className="flex justify-end mx-auto my-2 gap-2">
        <BillingTypeDialog />
        {/* <BillableItemDialog /> */}
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={dataBillingTypes} subject="BillingType"/>      
      </div>

    </div>
  )
}
  
