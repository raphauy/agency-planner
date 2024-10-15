import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getChannelsByClientSlug } from "@/services/channel-services"
import { getClientDAOBySlugs } from "@/services/client-services"
import { getInstagramStats, getMonthlyStats } from "@/services/stats-service"
import * as LucideIcons from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import React from "react"
import { ClientDashboard, GraphData } from "./client-dashboard"

type Props = {
    params: {
        agencySlug: string
        clientSlug: string
    }
}

export default async function ClientPage({ params }: Props) {
  const { agencySlug, clientSlug } = params
  const agency= await getAgencyDAOBySlug(agencySlug)
  const client= await getClientDAOBySlugs(agencySlug, clientSlug)
  if (!agency || !client) {
    redirect("/auth/404")
  }

  const channels= await getChannelsByClientSlug(clientSlug)

  const stats= await getInstagramStats(client.id)
  let monthlyPosts: GraphData[] = []
  let monthlyReels: GraphData[] = []
  let monthlyStories: GraphData[] = []
  const monthlyStats= await getMonthlyStats(client.id)
  if (monthlyStats) {
    monthlyPosts= monthlyStats.map((stat) => ({
      name: stat.month,
      count: stat.totalPosts
    }))
    monthlyReels= monthlyStats.map((stat) => ({
      name: stat.month,
      count: stat.totalReels
    }))
    monthlyStories= monthlyStats.map((stat) => ({
      name: stat.month,
      count: stat.totalStories
    }))
  }

  return (
    <div className="mt-8 w-full">
      <Card className="p-4 w-full shadow-md text-muted-foreground">

        <div className="flex items-center">
          <div className="flex items-center gap-2">
            {client.image && <Image src={client.image} alt={client.name} width={40} height={40} className="rounded-full w-10 h-10" />}
            <p className="dark:text-white flex-1 text-gray-900 font-bold whitespace-nowrap">{client.name}</p>
          </div>
          <div className="line-clamp-3 ml-10">
            {client.description}
          </div>
        </div>
      </Card>

      {
        stats && client.channels.some(c => c.slug === 'instagram') ? 
        <ClientDashboard stats={stats} monthlyPosts={monthlyPosts} monthlyReels={monthlyReels} monthlyStories={monthlyStories} />
        :
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400 text-center"></p>
        </div>
      }

      <div className="flex gap-4 mt-20 justify-center">
        {
          channels.map((channel) => (
            <Link key={channel.slug} href={`/${agencySlug}/${clientSlug}/${channel.slug}`}>
              <Button className="flex gap-2 w-32">
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
