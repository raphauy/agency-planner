import { getPublicationsDAO } from "@/services/publication-services"
import { PublicationDialog } from "./publication-dialogs"
import { DataTable } from "./publication-table"
import { columns } from "./publication-columns"

export default async function UsersPage() {
  
  const data= await getPublicationsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <PublicationDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Publication"/>      
      </div>
    </div>
  )
}
  
