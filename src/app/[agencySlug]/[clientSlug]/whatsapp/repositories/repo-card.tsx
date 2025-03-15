import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RepositoryDAO } from "@/services/repository-services"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import Link from "next/link"

type Props= {
  repository: RepositoryDAO
  basePath: string
}


export function RepoCard({ repository, basePath }: Props) {
  const color = repository.color
  
  return (
    <Link href={`${basePath}/repositories/${repository.id}`} prefetch={false} className="w-full max-w-lg">
      <Card className="w-full max-w-lg">
        <CardHeader
          className={`flex flex-col items-start gap-2 p-4 rounded-t-lg h-[130px]`}
          style={{
            background: `linear-gradient(45deg, ${color} 25%, ${color} 50%, ${color} 75%, ${color} 100%)`,
          }}
        >
          <CardTitle className="text-white">{repository.name}</CardTitle>
          <CardDescription className="text-white line-clamp-3">
            {repository.functionDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>actualizado {formatDistanceToNow(repository.updatedAt, { locale: es })}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
