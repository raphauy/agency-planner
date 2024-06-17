"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InstagramStats } from "@/services/stats-service"
import { ResponsiveBar } from "@nivo/bar"
import { ResponsiveLine } from "@nivo/line"
import { Camera, GalleryHorizontalEnd, Video } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export type GraphData = {
  name: string
  count: number
}

type Props = {
  stats: InstagramStats
  monthlyPosts: GraphData[]
  monthlyReels: GraphData[]
  monthlyStories: GraphData[]
}

export function ClientDashboard({ stats, monthlyPosts, monthlyReels, monthlyStories }: Props) {
  
  const params= useParams()
  const agencySlug= params.agencySlug
  const clientSlug= params.clientSlug
  const totalPublications= stats.totalPosts + stats.totalReels + stats.totalStories
  const postsPercentage= stats.totalPosts / totalPublications * 100
  const reelsPercentage= stats.totalReels / totalPublications * 100
  const storiesPercentage= stats.totalStories / totalPublications * 100

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8 mt-10">
      <div className="grid gap-4 md:grid-cols-3">
        <Link href={`/${agencySlug}/${clientSlug}/instagram/posts`}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Posts</CardTitle>
              <Camera className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total de Posts</p>
              {
                stats.totalPosts > 0 && 
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm font-medium">{postsPercentage.toFixed(0)}%</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">del total de publicaciones</p>
                </div>
              }
            </CardContent>
          </Card>
        </Link>
        <Link href={`/${agencySlug}/${clientSlug}/instagram/reels`}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reels</CardTitle>
              <Video className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReels}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total de Reels</p>
              {
                stats.totalPosts > 0 && 
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm font-medium">{reelsPercentage.toFixed(0)}%</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">del total de publicaciones</p>
                </div>
              }
            </CardContent>
          </Card>
        </Link>
        <Link href={`/${agencySlug}/${clientSlug}/instagram/historias`}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Historias</CardTitle>
              <GalleryHorizontalEnd className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStories}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total de Historias</p>
              {
                stats.totalPosts > 0 && 
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm font-medium">{storiesPercentage.toFixed(0)}%</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">del total de publicaciones</p>
                </div>
              }
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart className="aspect-[9/4]" data={monthlyPosts} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Últimos Reels</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart className="aspect-[9/4]" data={monthlyReels} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Últimas Historias</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart className="aspect-[9/4]" data={monthlyStories} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

type ClassProps= {
  className?: string;
  data: GraphData[]
}

function BarChart({ className, data }: ClassProps) {
  
  return (
    <div className={className}>
      <ResponsiveBar
        data={data}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing data"
      />
    </div>
  )
}


function LineChart(props: ClassProps) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "Jan", y: 43 },
              { x: "Feb", y: 137 },
              { x: "Mar", y: 61 },
              { x: "Apr", y: 145 },
              { x: "May", y: 26 },
              { x: "Jun", y: 154 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "Jan", y: 60 },
              { x: "Feb", y: 48 },
              { x: "Mar", y: 177 },
              { x: "Apr", y: 78 },
              { x: "May", y: 96 },
              { x: "Jun", y: 204 },
            ],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  )
}

