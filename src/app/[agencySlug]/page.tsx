import { getCurrentRole } from "@/lib/utils"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getClientsDAOByAgencyId, getClientsOfCurrentUser } from "@/services/client-services"
import { notFound, redirect } from "next/navigation"
import ClientsTabs from "./clients-tabs"

type Props= {
  params: Promise<{
    agencySlug: string
  }>
}
export default async function AgencyPage(props: Props) {
  const params = await props.params;

  const agency= await getAgencyDAOBySlug(params.agencySlug)

  if (!agency) {
    notFound()
  }

  const agencySlug= agency.slug
  const currentRole= await getCurrentRole()
  if (currentRole?.startsWith("CLIENT")){
    const clients= await getClientsOfCurrentUser()
    const clientSlug= clients && clients[0]?.slug
    redirect(`/${agencySlug}/${clientSlug}`)
  }

  const clients= currentRole === "ADMIN" ? await getClientsDAOByAgencyId(agency.id) : await getClientsOfCurrentUser()

  return (
    <div>

      <ClientsTabs agencyId={agency.id} clients={clients} />

    </div>
  )
}
