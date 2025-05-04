import { DataTable } from "./repodata-table"
import { columns } from "./repodata-columns"
import { getClientDAOBySlugs } from "@/services/client-services"
import { getFullRepoDatasDAO, getRepoDatasDAO, getRepoNames } from "@/services/repodata-services"
import FilterBar from "./filter-bar"

type Props= {
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
  searchParams: Promise<{
    start?: string
    end?: string
    repoName?: string
  }>
}
export default async function RegistrosPage(props: Props) {
  const params = await props.params;
  const agencySlug= params.agencySlug
  const clientSlug= params.clientSlug

  const searchParams= await props.searchParams
  const start= searchParams.start
  const end= searchParams.end
  const repoName= searchParams.repoName

  const client= await getClientDAOBySlugs(agencySlug, clientSlug)
  if (!client) return <div>Cliente no encontrado</div>

  const data= await getFullRepoDatasDAO(client.id, start, end, repoName)
  const repoNames= await getRepoNames(client.id)

  return (
    <div className="w-full">      
      <FilterBar agencySlug={agencySlug} clientSlug={clientSlug} timeZone={client.timezone} repoNames={repoNames} />

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="RepoData" repoNames={repoNames} repoLabel={"Registros"} columnsOff={["repoName"]}/>
      </div>
    </div>
  )
}
  
