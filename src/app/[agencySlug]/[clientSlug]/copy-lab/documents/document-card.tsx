"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DocumentDAO } from "@/services/document-services"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Briefcase, CalendarIcon, WholeWord } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

type Props= {
  document: DocumentDAO
}


export function DocumentCard({ document }: Props) {

  const params= useParams()
  const agencySlug= params.agencySlug as string
  const clientSlug= params.clientSlug as string

  const color = document.color
//  const color = "#000000"
  const clientesStr= document.wordsCount
  
  return (
    <Link href={`/${agencySlug}/${clientSlug}/copy-lab/documents/${document.id}`} prefetch={false} className="w-full max-w-lg">
      <Card className="w-full max-w-lg">
        <CardHeader
          className={`flex flex-col items-start gap-2 p-4 rounded-t-lg h-[130px]`}
          style={{
            background: `linear-gradient(45deg, ${color} 25%, ${color} 50%, ${color} 75%, ${color} 100%)`,
          }}
        >
          <CardTitle className="text-white">{document.name}</CardTitle>
          <CardDescription className="text-white line-clamp-3">
            {document.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>actualizado {formatDistanceToNow(document.updatedAt, { locale: es })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <WholeWord className="w-4 h-4 mb-1" />
            {clientesStr} palabras
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
