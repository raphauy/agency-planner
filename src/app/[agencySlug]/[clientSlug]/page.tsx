import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getChannelsByClientSlug } from "@/services/channel-services"
import { getClientDAOBySlug } from "@/services/client-services"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"

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
    <div className="mt-10">
            <Card className="group flex flex-col min-w-80 p-6 w-full shadow-md text-muted-foreground h-52 max-w-[600px]">

              <div className="flex items-center mb-4 text-gray-900 font-bold justify-between">
                <Link href={`/${client.agency.slug}/${client.slug}/settings`} prefetch={false} className="h-full flex items-center gap-2">
                  {client.image && <Image src={client.image} alt={client.name} width={40} height={40} className="rounded-full w-10 h-10" />}
                  <p className="dark:text-white flex-1">{client.name}</p>
                </Link>
                <Link href={`/${client.agency.slug}/${client.slug}/settings`} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Settings className="w-6 h-6" />
                </Link>
                  
              </div>
                <Link href={`/${client.agency.slug}/${client.slug}/settings`} prefetch={false} className="h-full flex flex-col justify-between">
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

      <div className="flex gap-4 mt-5 justify-center">
        {
          channels.map((channel) => (
            <Link key={channel.slug} href={`/${agencySlug}/${clientSlug}/${channel.slug}`}>
              <Button className="flex gap-2">
                {
                  // @ts-ignore
                  channel.icon && React.createElement(LucideIcons[channel.icon], {className: cn("w-5 h-5 mb-0.5", channel.name === "Linkedin" && "mb-1.5")})
                }
                {channel.name}
              </Button>
            </Link>
          ))
        }
      </div>

    </div>
)
}
