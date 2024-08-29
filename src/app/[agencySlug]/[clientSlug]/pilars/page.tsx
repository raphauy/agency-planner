import { getPilarsDAO, getPilarsDAOBySlugs } from "@/services/pilar-services"
import { PilarDialog } from "./pilar-dialogs"
import { DataTable } from "./pilar-table"
import { columns } from "./pilar-columns"

type Props= {
  params: {
    agencySlug: string
    clientSlug: string
  }
}
export default async function PilarsPage({ params }: Props) {

  const agencySlug= params.agencySlug as string
  const clientSlug= params.clientSlug
  
  const data= await getPilarsDAOBySlugs(agencySlug, clientSlug)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <PilarDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Pilar"/>      
      </div>
    </div>
  )
}
  
