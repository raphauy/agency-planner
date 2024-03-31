import { getChannelsDAO } from "@/services/channel-services"
import { ChannelDialog } from "./channel-dialogs"
import { DataTable } from "./channel-table"
import { columns } from "./channel-columns"

export default async function UsersPage() {
  
  const data= await getChannelsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <ChannelDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Channel"/>      
      </div>
    </div>
  )
}
  
