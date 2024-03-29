import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getFunctionalitysDAO } from "@/services/functionality-services"
import { getPermissionsOfAgency } from "@/services/permisions-services"
import { columns } from "./functionality-columns"
import { DataTable } from "./functionality-table"
import { columns as permissionsColumns } from "./permissions-columns"
import { DataTable as PermissionsTable } from "./permissions-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Props = {
  params: {
    agencySlug: string
  }
}
export default async function PermissionsPage({ params }: Props) {
  const agencySlug= params.agencySlug
  const agency= await getAgencyDAOBySlug(agencySlug)  
  const dataUserPermissions= await getPermissionsOfAgency(agency.id)
  const functionalities= await getFunctionalitysDAO()

  return (
    <Tabs defaultValue="permissions" className="w-full mt-5 gap-4 max-w-3xl">
      <TabsList>
        <TabsTrigger value="permissions">Permisos de Usuario</TabsTrigger>
        <TabsTrigger value="functionalities">Funcionalidades por cliente</TabsTrigger>
      </TabsList>
      <TabsContent value="permissions">
        <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white  bg-white dark:bg-black">
          <p className="font-bold text-gray-800 text-2xl text-center mb-4">Permisos de Usuario</p>
          <PermissionsTable columns={permissionsColumns} data={dataUserPermissions} subject="User" columnsOff={["userEmail", "userRole"]} />
        </div>
      </TabsContent>
      <TabsContent value="functionalities">
        <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white  bg-white dark:bg-black">
          <p className="font-bold text-gray-800 text-2xl text-center mb-4">Funcionalidades de cliente</p>
          <DataTable columns={columns} data={functionalities} subject="Func" columnsOff={["slug"]} functionalityNames={functionalities.map(f => f.name)} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
  
