import { InviteDialog } from "@/app/admin/users/user-dialogs"
import { getClientDAOBySlugs } from "@/services/client-services"
import { getPendingInvitationsOfClient } from "@/services/invitation-services"
import { getUsersOfClient, getUsersOfClientWithPendingInvitations } from "@/services/user-services"
import { columns } from "./user-columns"
import { DataTable } from "./user-table"

type Props = {
  params: {
    agencySlug: string
    clientSlug: string
  }
}
export default async function UsersPage({ params }: Props) {
  const agencySlug= params.agencySlug as string
  const clientSlug= params.clientSlug
  const client= await getClientDAOBySlugs(agencySlug, clientSlug)
  const data= await getUsersOfClient(client.id)
  const pendingInvitations= await getPendingInvitationsOfClient(client.id)
  const userIdsPendingInvitations= pendingInvitations.map((i) => i.userId)
  const filteredData= data.filter((u) => !userIdsPendingInvitations.includes(u.id))

  const usersWithPendingInvitations= await getUsersOfClientWithPendingInvitations(client.id)

  return (
    <div className="w-full">      

      <p className="text-center my-5 font-bold text-2xl">
        Equipo de {client.name}
      </p>

      <DataTable columns={columns} data={filteredData} subject="User" /> 

      <div className="flex justify-center my-10">
        <InviteDialog clientId={client.id} agencyId={client.agencyId} />
      </div>

      <p className="text-center mt-8 my-5 font-bold text-2xl">
        Invitaciones pendientes
      </p>

      <DataTable columns={columns} data={usersWithPendingInvitations} subject="User" /> 

    </div>
  )
}
  
