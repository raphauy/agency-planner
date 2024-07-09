import { getFullConversationsDAO } from "@/services/conversation-services"
import { DataTable } from "./conversation-table"
import { columns } from "./conversation-columns"

export default async function ConversationPage() {
  
  const data= await getFullConversationsDAO()

  return (
    <div className="w-full">      

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Conversation"/>      
      </div>
    </div>
  )
}
  
