import { getFullUsageRecordsDAO } from "@/services/usagerecord-services"
// import { UsageRecordDialog } from "./usagerecord-dialogs"
import { DataTable } from "./usagerecord-table"
import { columns } from "./usagerecord-columns"
import { getAgencySlugs } from "@/services/agency-services"

export default async function UsageRecordPage() {
  
  const data= await getFullUsageRecordsDAO()
  const agencySlugs= await getAgencySlugs()

  return (
    <div className="w-full">      

      <div className="text-2xl font-bold mx-auto my-2">
        Usage Records
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="UsageRecord" agencySlugs={agencySlugs}/>
      </div>
    </div>
  )
}
  
