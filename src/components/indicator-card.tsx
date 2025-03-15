import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Suspense } from "react"

export type IndicatorStats = {
    total: number
    currentMonthCount: number
    percentageFromLastMonth: number
  }
  
  
type Props= {
  title: string
  icon: React.ReactNode
  link: string
  statsGetter: (clientId: string) => Promise<IndicatorStats>
  clientId?: string
}

function StatsContent({ stats }: { stats: IndicatorStats }) {
  const isPositive = stats.percentageFromLastMonth >= 0
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-3xl font-bold">+{stats.currentMonthCount}</span>
          <span className="text-xs text-muted-foreground">este mes</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-bold">{stats.total}</span>
          <span className="text-xs text-muted-foreground">total</span>
        </div>
      </div>
      <div className={cn("text-sm", isPositive && "text-green-600")}>
        {isPositive ? "+" : ""}{stats.percentageFromLastMonth.toFixed(1)}% desde el mes pasado
      </div>
    </div>
  )
}

function StatsLoading() {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-14 mt-1" />
        </div>
        <div className="flex flex-col items-end">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-8 mt-1" />
        </div>
      </div>
      <Skeleton className="h-4 w-32" />
    </div>
  )
}

async function StatsWrapper({ statsGetter, clientId }: { statsGetter: Props["statsGetter"], clientId?: string }) {
  if (!clientId) return <StatsLoading />
  const stats = await statsGetter(clientId)
  return <StatsContent stats={stats} />
}

export default function IndicatorCard({ title, icon, link, statsGetter, clientId }: Props) {
  return (
    <Link href={link}>
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">
            {title}
            </CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
            {icon}
            </div>
        </CardHeader>
        <CardContent>
            <Suspense fallback={<StatsLoading />}>
            <StatsWrapper statsGetter={statsGetter} clientId={clientId} />
            </Suspense>
        </CardContent>
        </Card>
    </Link>
  )
}