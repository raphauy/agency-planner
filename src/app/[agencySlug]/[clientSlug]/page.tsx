import { Button } from "@/components/ui/button"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getChannelsByClientSlug } from "@/services/channel-services"
import { getClientDAOBySlug } from "@/services/client-services"
import Link from "next/link"
import { redirect } from "next/navigation"

type Props = {
    params: {
        agencySlug: string
        clientSlug: string
    }
}

export default async function ClientPage({ params }: Props) {
  const { agencySlug, clientSlug } = params
  const agency= await getAgencyDAOBySlug(agencySlug)
  const client= await getClientDAOBySlug(clientSlug)
  if (!agency || !client) {
    redirect("/auth/404")
  }

  const channels= await getChannelsByClientSlug(clientSlug)

  return (
    <div>
      <div className="border mt-20 rounded-lg bg-white p-10 space-y-6">
        <h1 className="text-xl font-bold">Client Page</h1>
        <p>Agency: {agency.name}</p>
        <p>Client: {client.name}</p>
      </div>

      <div className="flex gap-4">
        {
          channels.map((channel) => (
            <Link key={channel.slug} href={`/${agencySlug}/${clientSlug}/${channel.slug}`}>
              <Button>
                {channel.name}
              </Button>
            </Link>
          ))
        }
      </div>

    </div>
)
}
