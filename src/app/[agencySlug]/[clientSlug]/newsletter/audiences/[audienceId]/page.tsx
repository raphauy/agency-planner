import { AudienceDAO, getAudienceDAO, getAudiencesDAO } from "@/services/audience-services"
import { getEmailContactsDAO } from "@/services/emailcontact-services"
import { AudienceHeader } from "./audience-header"
import { ContactsStats } from "./contacts-stats"
import { DataTable } from "../../emailcontacts/emailcontact-table"
import { columns } from "../../emailcontacts/emailcontact-columns"

type Props= {
  params: {
    agencySlug: string
    clientSlug: string
    audienceId: string
  }
}
export default async function AudiencePage({ params }: Props) {
  const agencySlug= params.agencySlug
  const clientSlug= params.clientSlug
  const audienceId= params.audienceId
  const audience: AudienceDAO= await getAudienceDAO(audienceId)
  const allAudiences= await getAudiencesDAO(audience.clientId)
  const contacts= await getEmailContactsDAO(audienceId)
  const unsubscribedCount= contacts.filter(contact => contact.unsubscribed).length
  return (
    <div className="space-y-4">
        <AudienceHeader audience={audience} audiences={allAudiences} agencySlug={agencySlug} clientSlug={clientSlug} />
        <ContactsStats contactsCount={contacts.length} unsubscribedCount={unsubscribedCount} />

        <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
          <DataTable columns={columns} data={contacts} subject="Contacto"/>      
        </div>

    </div>
  )
}