import { getEmailContactsDAO } from "@/services/emailcontact-services"
import { EmailContactDialog } from "./emailcontact-dialogs"
import { DataTable } from "./emailcontact-table"
import { columns } from "./emailcontact-columns"

type Props= {
  params: {
    audienceId: string
  }
}
export default async function EmailContactPage({ params }: Props) {
  const audienceId= params.audienceId
  const data= await getEmailContactsDAO(audienceId)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <EmailContactDialog audienceId={audienceId} />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="EmailContact"/>      
      </div>
    </div>
  )
}
  
