import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getClientDAOBySlug } from "@/services/client-services"
import { redirect } from "next/navigation"

type Props = {
    params: {
        agencySlug: string
        clientSlug: string
    }
}

export default async function FacebookPage({ params }: Props) {
    const { agencySlug, clientSlug } = params
    const agency= await getAgencyDAOBySlug(agencySlug)
    const client= await getClientDAOBySlug(clientSlug)
    if (!agency || !client) {
      redirect("/auth/404")
    }
  
    return (
        <div className="border mt-20 rounded-lg bg-white p-10 space-y-6">
          <h1 className="text-xl font-bold">Facebook Page</h1>
          <p>Agency: {agency.name}</p>
          <p>Client: {client.name}</p>
      </div>
    )
}
    