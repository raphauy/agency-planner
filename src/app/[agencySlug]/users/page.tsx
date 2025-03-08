import { UserDialog } from "@/app/admin/users/user-dialogs"
import { DataTable } from "@/app/admin/users/user-table"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getUsersOfAgency, getUsersOfAgencyWithPendingInvitations } from "@/services/user-services"
import { columns } from "./user-columns"
import { getPendingInvitationsOfAgency } from "@/services/invitation-services"

type Props = {
  params: Promise<{
    agencySlug: string
  }>
}
export default async function UsersPage(props: Props) {
  const params = await props.params;
  const agencySlug= params.agencySlug
  const agency= await getAgencyDAOBySlug(agencySlug)
  const data= await getUsersOfAgency(agency.id)

  const pendingInvitations= await getPendingInvitationsOfAgency(agency.id)
  const userIdsPendingInvitations= pendingInvitations.map((i) => i.userId)
  const filteredData= data.filter((u) => !userIdsPendingInvitations.includes(u.id))

  const usersWithPendingInvitations= await getUsersOfAgencyWithPendingInvitations(agency.id)

  return (
    <div className="w-full">      

      <p className="text-center my-5 font-bold text-2xl">
        Equipo de {agency.name}
      </p>

      <DataTable columns={columns} data={filteredData} subject="User" /> 

      <div className="flex justify-center my-10">
        <UserDialog agencyId={agency.id} />
      </div>

      <p className="text-center mt-8 my-5 font-bold text-2xl">
        Invitaciones pendientes
      </p>

      <DataTable columns={columns} data={usersWithPendingInvitations} subject="User" /> 

    </div>
  )
}
  
