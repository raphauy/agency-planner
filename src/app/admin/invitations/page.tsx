import { getFullInvitationsDAO } from "@/services/invitation-services"
import { InvitationDialog } from "./invitation-dialogs"
import { DataTable } from "./invitation-table"
import { columns } from "./invitation-columns"

export default async function InvitationPage() {
  
  const data= await getFullInvitationsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <InvitationDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Invitation"/>      
      </div>
    </div>
  )
}
  
