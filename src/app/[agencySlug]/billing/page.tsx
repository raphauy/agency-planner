import { getBillableItemsDAO } from "@/services/billableitem-services"
import { getBillingTypesDAO } from "@/services/billingtype-services"
import { DataTable } from "@/app/admin/billableitems/billableitem-table"
import { columns } from "./billableitem-columns"

type Props = {
  params: {
    agencySlug: string
  }
}
export default async function BillingPage({ params }: Props) {
  const agencySlug= params.agencySlug
  
  const data= await getBillableItemsDAO(agencySlug, 50)
  const billableTypes= await getBillingTypesDAO()
  const billableTypesStr= billableTypes.map((bt) => bt.name)

  let clients: string[]= []
  data.forEach((bi) => {
    if (bi.client) {
      clients.push(bi.client.name)
    }
  })

  return (
    <div className="w-full mt-10">      

      <div className="container bg-white mb-5 p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="BillableItem" clients={clients} billableTypes={billableTypesStr}/>
      </div>

    </div>
  )
}
  
