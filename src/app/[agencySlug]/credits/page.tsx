import { getAgencyDAOBySlug } from "@/services/agency-services"
import LateralPanel from "./lateral-panel"
import DetailsCard, { DetailsInfo } from "./details-card"
import { getMonthlyUsagesDAOByAgency, MonthlyUsageDAO } from "@/services/monthlyusage-services"
import { MonthSelector } from "./month-selector"

type Props = {
  params: {
    agencySlug: string
  }
  searchParams: {
    y: string
    m: string
    c: string
  }
}
export default async function CreditsPage({ params, searchParams }: Props) {
  const agencySlug= params.agencySlug

  const agency= await getAgencyDAOBySlug(agencySlug)
  if (!agency) return <div>Agencia no encontrada</div>

  const now= new Date()
  let month= now.getMonth()
  let year= now.getFullYear()
  if (searchParams.y) {
    year= parseInt(searchParams.y)
  }
  if (searchParams.m) {
    month= parseInt(searchParams.m) - 1
  }
  console.log("year", year)
  console.log("month", month)
  

  const agencyInfo= await getMonthlyUsagesDAOByAgency(agency.id, year, month)
  const clientId= searchParams.c
  let info: DetailsInfo | undefined
  if (clientId && clientId !== "agency") {
    const clientInfo= agencyInfo.clientMonthlyUsages.find(usage => usage.clientId === clientId)
    if (clientInfo) {
      info= {
        name: clientInfo.clientName,
        imagesCount: clientInfo.imagesCount,
        videosCount: clientInfo.videosCount,
        storageMB: clientInfo.storageMB,
        storageCredits: clientInfo.storageCredits,
        llmCredits: clientInfo.llmCredits,
        conversationsCount: clientInfo.conversationsCount,
      }
    }
  } else {
    info= {
      name: agency.name,
      imagesCount: agencyInfo.imagesCount,
      videosCount: agencyInfo.videosCount,
      storageMB: agencyInfo.storageMB,
      storageCredits: agencyInfo.storageCredits,
      llmCredits: agencyInfo.llmCredits,
      conversationsCount: agencyInfo.conversationsCount,
    }
  }

  return (
    <div className="w-full">


      <div className="container bg-white mb-5 p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <div className="border-b mb-2 pb-2">
          <MonthSelector />
        </div>

        <div className="flex gap-4">
          <LateralPanel agencyInfo={agencyInfo} />
          <div className="flex justify-center w-full h-fit">
            {
              info && <DetailsCard info={info} />
            }
          </div>
        </div>
      </div>

    </div>
  )
}
  
