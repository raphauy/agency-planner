import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getChannelsDAO, getFullChannelsDAO } from "@/services/channel-services"
import { getPermissionsOfAgency } from "@/services/permisions-services"
import { columns } from "./channel-columns"
import { DataTable } from "./channel-table"
import { columns as permissionsColumns } from "./permissions-columns"
import { DataTable as PermissionsTable } from "./permissions-table"
import { useRoles } from "@/app/admin/users/use-roles"
import { getCurrentUser } from "@/lib/utils"
import { redirect } from "next/navigation"

type Props = {
  params: Promise<{
    agencySlug: string
  }>
}
export default async function PermissionsPage(props: Props) {
  const params = await props.params;
  const agencySlug= params.agencySlug
  const agency= await getAgencyDAOBySlug(agencySlug)
  const dataUserPermissions= await getPermissionsOfAgency(agency.id)
  const allChannels= await getFullChannelsDAO()
  const currentUser= await getCurrentUser()
  let channels= allChannels
  if (!currentUser) {
    return redirect("/login")
  }
  if (currentUser.role !== "ADMIN") {
    channels= allChannels.filter(c => c.status === "ACTIVE")
  }

  return (
    <Tabs defaultValue="permissions" className="w-full mt-5 gap-4 max-w-3xl">
      <TabsList>
        <TabsTrigger value="permissions">Permisos de Usuario</TabsTrigger>
        <TabsTrigger value="channels">Permisos de Canal</TabsTrigger>
      </TabsList>
      <TabsContent value="permissions">
        <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white  bg-white dark:bg-black">
          <p className="font-bold text-gray-800 text-2xl text-center mb-4">Permisos de Usuario</p>
          <PermissionsTable columns={permissionsColumns} data={dataUserPermissions} subject="User" columnsOff={["userEmail", "userRole"]} />
        </div>
      </TabsContent>
      <TabsContent value="channels">
        <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white  bg-white dark:bg-black">
          <p className="font-bold text-gray-800 text-2xl text-center mb-4">Permisos de Canal</p>
          <DataTable columns={columns} data={channels} subject="Func" columnsOff={["slug"]} channelNames={channels.map(f => f.name)} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
  
