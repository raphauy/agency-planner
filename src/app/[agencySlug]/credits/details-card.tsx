import { Card } from "@/components/ui/card"
import { MonthlyUsageDAO } from "@/services/monthlyusage-services"
import { BotIcon, Briefcase, CloudIcon, DatabaseIcon, ImageIcon, Sigma, VideoIcon } from "lucide-react"

export type DetailsInfo= {
  name: string
  imagesCount: number
  videosCount: number
  storageMB: number
  storageCredits: number
  llmCredits: number
  conversationsCount: number
}

type Props= {
  info: DetailsInfo
}
export default function DetailsCard({ info }: Props) {
  return (
    <Card className="w-full max-w-md p-6 grid gap-6">
      <div className="flex items-center gap-4">
        <div className="bg-muted rounded-md p-3 flex items-center justify-center">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold">{info.name}</h3>
      </div>
      <div className="grid gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-md p-3 flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="grid gap-1">
            <h4 className="font-semibold">Imágenes</h4>
            <p>{info.imagesCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-md p-3 flex items-center justify-center">
            <VideoIcon className="w-6 h-6" />
          </div>
          <div className="grid gap-1">
            <h4 className="font-semibold">Videos</h4>
            <p>{info.videosCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-md p-3 flex items-center justify-center">
            <DatabaseIcon className="w-6 h-6" />
          </div>
          <div className="grid gap-1">
            <h4 className="font-semibold">Almacenamiento</h4>
            <p>{info.storageMB.toFixed(1)} MB</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-md p-3 flex items-center justify-center">
            <CloudIcon className="w-6 h-6" />
          </div>
          <div className="grid gap-1">
            <h4 className="font-semibold">Créditos de almacenamiento</h4>
            <p>{info.storageCredits.toFixed(0)} créditos</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-md p-3 flex items-center justify-center">
            <BotIcon className="w-6 h-6" />
          </div>
          <div className="grid gap-1">
            <h4 className="font-semibold">Créditos de LLM</h4>
            <p>{info.llmCredits.toFixed(0)} créditos</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-md p-3 flex items-center justify-center">
            <Sigma className="w-6 h-6" />
          </div>
          <div className="grid gap-1">
            <h4 className="font-semibold">Créditos Totales</h4>
            <p>{(info.llmCredits + info.storageCredits).toFixed(0)} créditos</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
