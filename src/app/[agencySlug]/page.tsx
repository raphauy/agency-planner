import { Card, CardContent } from "@/components/ui/card"
import { getCurrentRole } from "@/lib/utils"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getClientsDAOByAgencyId, getClientsOfCurrentUser } from "@/services/client-services"
import { InstagramLogoIcon } from '@radix-ui/react-icons'
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ClientDialog } from "./clients/client-dialogs"

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
  const data= currentRole === "ADMIN" ? await getClientsDAOByAgencyId(agency.id) : await getClientsOfCurrentUser()

  return (
    <div>

      <div className="flex justify-end mt-2">
        <ClientDialog igForm={true} agencyId={agency.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full mt-4">
        {
          data.map(client => (
            <Card key={client.id} className="flex flex-col min-w-80 p-6 w-full shadow-md text-muted-foreground h-52">

              <div className="flex items-center mb-4 text-gray-900 font-bold justify-between">
                <Link href={`/${client.agency.slug}/${client.slug}`} prefetch={false} className="h-full flex items-center gap-2">
                  {client.image && <Image src={client.image} alt={client.name} width={40} height={40} className="rounded-full w-10 h-10" />}
                  <p className="dark:text-white flex-1">{client.name}</p>
                </Link>
                <Link href={`https://instagram.com/${client.igHandle}`} prefetch={false} target="_blank">
                  <InstagramLogoIcon className="w-6 h-6" />
                </Link>
                  
              </div>
              <Link href={`/${client.agency.slug}/${client.slug}`} prefetch={false} className="h-full flex flex-col justify-between">
                <CardContent className="p-0 line-clamp-3">
                {client.description}
                </CardContent>
                <p className="flex justify-end text-sm mt-2">{formatDistanceToNow(client.createdAt, { locale: es })}</p>
              </Link>
            </Card>
          ))
        }
      </div>
    </div>
  )
}
