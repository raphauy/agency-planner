import { AudienceDAO } from "@/services/audience-services"
import AudienceSelector from "./audience-selector"
import { EmailContactDialog } from "../../emailcontacts/emailcontact-dialogs"
import { Button } from "@/components/ui/button"
import { File } from "lucide-react"

type Props= {
  agencySlug: string
  clientSlug: string
  audience: AudienceDAO
  audiences: AudienceDAO[]
}
export function AudienceHeader({ agencySlug, clientSlug, audience, audiences }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-stretch justify-center w-16 h-16">
          <svg width="64" height="64" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="50" height="50" rx="10" fill="white" stroke="#E5E7EB"/>
            <path d="M32 21C32 23.2091 30.2091 25 28 25C25.7909 25 24 23.2091 24 21C24 18.7909 25.7909 17 28 17C30.2091 17 32 18.7909 32 21Z" stroke="#6B7280" strokeWidth="1.5"/>
            <path d="M22 33C22 29.6863 24.6863 27 28 27C31.3137 27 34 29.6863 34 33" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M24 21C24 23.2091 22.2091 25 20 25C17.7909 25 16 23.2091 16 21C16 18.7909 17.7909 17 20 17C22.2091 17 24 18.7909 24 21Z" stroke="#6B7280" strokeWidth="1.5"/>
            <path d="M14 33C14 29.6863 16.6863 27 20 27C21.5367 27 22.9385 27.5539 24 28.4649" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="flex flex-col justify-between py-0.5">
          <span className="text-muted-foreground ml-5">Audiencia:</span>
          <AudienceSelector 
            audienceId={audience.id} 
            audiences={audiences} 
            agencySlug={agencySlug} 
            clientSlug={clientSlug} 
            selectedAudienceName={audience.name} 
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <EmailContactDialog audienceId={audience.id} />
        <Button className="gap-2">
          <File className="w-5 h-5" />
          <p>Importar CSV</p>
        </Button>
      </div>
    </div>
  )
}