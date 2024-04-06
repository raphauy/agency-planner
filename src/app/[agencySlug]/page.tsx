import { getCurrentRole } from "@/lib/utils"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getClientsDAOByAgencyId, getClientsOfCurrentUser } from "@/services/client-services"
import { redirect } from "next/navigation"
import ClientsTabs from "./clients-tabs"

type Props= {
  params: {
    agencySlug: string
  }
}
export default async function AgencyPage({ params }: Props) {

  const agency= await getAgencyDAOBySlug(params.agencySlug)

  if (!agency) {
    redirect("/auth/404")
  }
  
  const currentRole= await getCurrentRole()
  const clients= currentRole === "ADMIN" ? await getClientsDAOByAgencyId(agency.id) : await getClientsOfCurrentUser()

  return (
    <div>

      <ClientsTabs agencyId={agency.id} clients={clients} />

    </div>
  )
}
