import { getEmailSendsDAO } from "@/services/emailsend-services"
import { EmailSendDialog } from "./emailsend-dialogs"
import { DataTable } from "./emailsend-table"
import { columns } from "./emailsend-columns"

export default async function EmailSendPage() {
  
  const data= await getEmailSendsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <EmailSendDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="EmailSend"/>      
      </div>
    </div>
  )
}
  
