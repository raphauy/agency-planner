import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewsletterDAO } from "@/services/newsletter-services"
import { TestEmailDialog } from "../newsletter-dialogs"

type Props = {
  newsletter: NewsletterDAO
  noDomains: boolean
}
export function TestEmail({ newsletter, noDomains }: Props) {
  if (noDomains) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email de Prueba</CardTitle>
        <CardDescription>Envía un email de prueba para verificar que el Newsletter se vea correctamente.</CardDescription>
      </CardHeader>
      <CardContent>
        <TestEmailDialog newsletterId={newsletter.id} emailFromConfigured={!!newsletter.emailFrom} />
      </CardContent>
    </Card>
  )
}