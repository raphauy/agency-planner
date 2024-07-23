import { getFullSubscriptionsDAO } from "@/services/subscription-services"
import { columns } from "./subscription-columns"
import { DataTable } from "./subscription-table"

export default async function SubscriptionPage() {
  
  const data= await getFullSubscriptionsDAO()

  return (
    <div className="w-full">      

      <div className="mx-auto my-2 text-center">
        <h1 className="text-3xl font-bold">Subscriptions</h1>
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Subscription"/>      
      </div>
    </div>
  )
}
  
