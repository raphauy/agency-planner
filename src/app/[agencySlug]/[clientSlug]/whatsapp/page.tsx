import IndicatorCard from "@/components/indicator-card"
import { Button } from "@/components/ui/button"
import { getClientIdBySlugs } from "@/services/client-services"
import { getContactStats, getConversationsStats, getDocumentsStats, getRepoDataStats } from "@/services/stats-service"
import { BookOpen, Database, DatabaseZap, Kanban, MessageCircle, SquareChevronRight, User } from "lucide-react"
import Link from "next/link"

type Props= {
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
}

export default async function DashboardPage({ params }: Props) {

  const { agencySlug, clientSlug } = await params
  const clientId= await getClientIdBySlugs(agencySlug, clientSlug)
  if (!clientId) {
    return <div>Cliente no encontrado</div>
  }
  
  return (
    <div className="w-full mt-4 mx-auto max-w-3xl 2xl:max-w-full">
      <div className="grid gap-4 grid-cols-2 2xl:grid-cols-4">
        <IndicatorCard 
          title="Contactos" 
          icon={<User className="h-5 w-5" />}
          link={`/${agencySlug}/${clientSlug}/whatsapp/contactos`}
          statsGetter={getContactStats} 
          clientId={clientId}
        />
        <IndicatorCard 
          title="Registros" 
          icon={<DatabaseZap className="h-5 w-5" />}
          link={`/${agencySlug}/${clientSlug}/whatsapp/registros`}
          statsGetter={getRepoDataStats} 
          clientId={clientId}
        />
        <IndicatorCard 
          title="Conversaciones" 
          icon={<MessageCircle className="h-5 w-5" />}
          link={`/${agencySlug}/${clientSlug}/whatsapp/conversaciones`}
          statsGetter={getConversationsStats} 
          clientId={clientId}
        />
        <IndicatorCard 
          title="Documentos" 
          icon={<BookOpen className="h-5 w-5" />}
          link={`/${agencySlug}/${clientSlug}/whatsapp/documentos`}
          statsGetter={getDocumentsStats} 
          clientId={clientId}
        />
      </div>

      <div className="grid md:flex items-center justify-center gap-4 mt-10">
        <Link href={`/${agencySlug}/${clientSlug}/whatsapp/kanban`} className="text-sm text-muted-foreground">
          <Button className="w-48 gap-2">
            <Kanban className="h-4 w-4" /> CRM Kanban
          </Button>
        </Link>
        <Link href={`/${agencySlug}/${clientSlug}/whatsapp/repositories`} className="text-sm text-muted-foreground">
          <Button className="w-48 gap-2">
            <Database className="h-4 w-4" /> Repositorios
          </Button>
        </Link>
        <Link href={`/${agencySlug}/${clientSlug}/whatsapp/prompt`} className="text-sm text-muted-foreground">
          <Button className="w-48 gap-2">
            <SquareChevronRight className="h-4 w-4" /> Prompt
          </Button>
        </Link>
      </div>
    </div>
  )
}


