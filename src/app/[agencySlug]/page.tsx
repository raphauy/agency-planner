import { Card, CardContent } from "@/components/ui/card"
import { cn, getCurrentRole } from "@/lib/utils"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getClientsDAOByAgencyId, getClientsOfCurrentUser } from "@/services/client-services"
import { InstagramLogoIcon } from '@radix-ui/react-icons'
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ClientDialog } from "./clients/client-dialogs"
import * as LucideIcons from "lucide-react"
import React from "react"

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
            <Card key={client.id} className="group flex flex-col min-w-80 p-6 w-full shadow-md text-muted-foreground h-52">

              <div className="flex items-center mb-4 text-gray-900 font-bold justify-between">
                <Link href={`/${client.agency.slug}/${client.slug}`} prefetch={false} className="h-full flex items-center gap-2">
                  {client.image && <Image src={client.image} alt={client.name} width={40} height={40} className="rounded-full w-10 h-10" />}
                  <p className="dark:text-white flex-1">{client.name}</p>
                </Link>
                <Link href={`/${client.agency.slug}/${client.slug}/settings`} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <LucideIcons.Settings className="w-6 h-6" />
                </Link>
                  
              </div>
                <Link href={`/${client.agency.slug}/${client.slug}`} prefetch={false} className="h-full flex flex-col justify-between">
                  <CardContent className="p-0 line-clamp-3">
                      {client.description}
                  </CardContent>
                </Link>
                <div className="flex justify-between text-sm mt-2">
                  <div className="flex gap-2">
                    {
                      client.channels.map(channel => (
                        <Link key={channel.id} prefetch={false} 
                          href={`/${client.agency.slug}/${client.slug}/${channel.slug}`}
                          className=" text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {
                            // @ts-ignore
                            channel.icon && React.createElement(LucideIcons[channel.icon], {className: cn("w-5 h-5 mb-0.5", channel.name === "Linkedin" && "ml-1")})
                          }
                        </Link>
                      ))
                    
                    }
                  </div>
                  <p>{formatDistanceToNow(client.createdAt, { locale: es })}</p>
                </div>
            </Card>
          ))
        }
      </div>
    </div>
  )
}
