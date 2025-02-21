  import { columns } from "@/app/[agencySlug]/[clientSlug]/newsletter/emailsends/emailsend-columns"
import { DataTable } from "@/app/[agencySlug]/[clientSlug]/newsletter/emailsends/emailsend-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getContactsCount } from "@/services/audience-services"
import { getEmailSendsDAO } from "@/services/emailsend-services"
import { NewsletterDAO } from "@/services/newsletter-services"
import { Calendar, Clock, Hash, Mail, MessageSquareReply, Send, User, Users } from "lucide-react"
import { BroadcastButton } from "./broadcast-button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { NoDomainsMessage } from "./config-tab"
import { getCurrentUser } from "@/lib/utils"
import { ProcessPendingButton } from "./process-pending-button"
import { CheckSentButton } from "./check-sent-button"

type Props = {
  newsletter: NewsletterDAO
  noDomains: boolean
}
export async function Broadcast({ newsletter, noDomains }: Props) {
  const currentUser= await getCurrentUser()
  const isSuperAdmin= currentUser?.email === "rapha.uy@rapha.uy"

  if (noDomains) {
    return <NoDomainsMessage />
  }
  const audience= newsletter.audience
  if (!audience) {
    return <NoAudienceMessage />
  }
  const contactsCount= await getContactsCount(audience.id)
  const emailsSent= await getEmailSendsDAO(newsletter.id)

  const emailFromDisplay = newsletter.nameFrom 
    ? `${newsletter.nameFrom} <${newsletter.emailFrom}>`
    : newsletter.emailFrom

  const badgeVariant= newsletter.status === "SENT" ? "delivered" : newsletter.status === "PENDING" ? "pending" : "draft"

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Enviar Newsletter</CardTitle>
              <CardDescription>Envía el Newsletter a la audiencia seleccionada.</CardDescription>
            </div>
            <Badge variant={badgeVariant}>{newsletter.status}</Badge>
          </div>
          </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna de Audiencia */}
            <div className="space-y-2">
              <p className="font-medium text-sm text-muted-foreground mb-4">Información de Audiencia</p>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 shrink-0" />
                <p className="truncate">{audience.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 shrink-0" />
                <p className="truncate">{contactsCount} contactos</p>
              </div>
            </div>

            {/* Columna de Newsletter */}
            <div className="space-y-2">
              <p className="font-medium text-sm text-muted-foreground mb-4">Información del Newsletter</p>
              {emailFromDisplay && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  <p className="truncate">{emailFromDisplay}</p>
                </div>
              )}
              {newsletter.replyTo && (
                <div className="flex items-center gap-2">
                  <MessageSquareReply className="w-4 h-4 shrink-0" />
                  <p className="truncate">Responder a: {newsletter.replyTo}</p>
                </div>
              )}
              {newsletter.sentByName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 shrink-0" />
                  <p className="truncate">Enviado por: {newsletter.sentByName}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 shrink-0" />
                <p className="truncate">Creado: {format(newsletter.createdAt, "PPP", { locale: es })}</p>
              </div>
              {newsletter.startedAt && (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 shrink-0" />
                  <p className="truncate">Enviado: {format(newsletter.startedAt, "PPP", { locale: es })}</p>
                </div>
              )}
            </div>
          </div>

          { newsletter.status === "DRAFT" ? <BroadcastButton newsletterId={newsletter.id} /> :
            <div className="flex gap-2">
              { isSuperAdmin && <ProcessPendingButton isSuperAdmin={isSuperAdmin} /> }
              { isSuperAdmin && <CheckSentButton isSuperAdmin={isSuperAdmin} /> }
            </div>
          }
        </CardContent>
      </Card>

      <div>
        <p className="text-lg font-bold py-2">Emails enviados:</p>
        <div className="container bg-background p-3 py-4 mx-auto border rounded-md text-muted-foreground">
          <DataTable columns={columns} data={emailsSent} subject="Email"/>      
        </div>
      </div>
    </div>
  )
}

function NoAudienceMessage() {
  return (
    <div className="flex flex-col gap-6 p-4 xl:p-6 w-full max-w-xl bg-background rounded-xl border mt-10 border-red-500 border-dashed text-center text-red-500">
      No hay audiencia para este newsletter.
    </div>
  )
}