import { DataTable } from "./repodata-table"
import { columns } from "./repodata-columns"
import { getClientDAOBySlugs } from "@/services/client-services"
import { getFullRepoDatasDAO, getRepoDatasDAO } from "@/services/repodata-services"

type Props= {
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
}
export default async function RegistrosPage(props: Props) {
  const params = await props.params;
  const agencySlug= params.agencySlug
  const clientSlug= params.clientSlug

  const client= await getClientDAOBySlugs(agencySlug, clientSlug)
  if (!client) return <div>Cliente no encontrado</div>

  const data= await getFullRepoDatasDAO(client.id)
  const repoNames= Array.from(new Set(data.map(repo => repo.repoName)))

  return (
    <div className="w-full">      

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="RepoData" repoNames={repoNames} repoLabel={"Registros"} columnsOff={["repoName"]}/>
      </div>
    </div>
  )
}
  
