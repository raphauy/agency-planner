import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getClientDAOBySlugs } from "@/services/client-services"
import { redirect } from "next/navigation"

type Props = {
    params: Promise<{
        agencySlug: string
        clientSlug: string
    }>
}

export default async function LinkedinPage(props: Props) {
    const params = await props.params;
    const { agencySlug, clientSlug } = params
    const agency= await getAgencyDAOBySlug(agencySlug)
    const client= await getClientDAOBySlugs(agencySlug, clientSlug)
    if (!agency || !client) {
      redirect("/auth/404")
    }

    return (
        <div className="border mt-20 rounded-lg bg-white p-10 space-y-6">
          <h1 className="text-xl font-bold">Linkedin Page (Coming Soon...)</h1>
          <p>Agencia: {agency.name}</p>
          <p>Cliente: {client.name}</p>
      </div>
    )
}
    