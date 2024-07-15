import { Separator } from "@/components/ui/separator"
import { AgencyMonthlyInfo } from "@/services/monthlyusage-services"
import Link from "next/link"
import LateralCard from "./lateral-card"

type Props= {
    agencyInfo: AgencyMonthlyInfo
}
export default async function LateralPanel({ agencyInfo }: Props) {
    const totalCredits= agencyInfo.storageCredits + agencyInfo.llmCredits

    return (
      <div className="flex flex-col gap-4 w-80">
        <LateralCard name={agencyInfo.agencyName} credits={totalCredits} maxCredits={agencyInfo.agencyMaxCredits} id="agency" />
        <Separator className="my-4" />
        {
            agencyInfo.clientMonthlyUsages.map((usage, index) => {
                const clientTotalCredits= usage.storageCredits + usage.llmCredits
                return (
                    <Link href={`credits?c=${usage.clientId}`} key={index} prefetch={false}>
                        <LateralCard key={index} name={usage.clientName} credits={clientTotalCredits} maxCredits={totalCredits} id={usage.clientId} />
                    </Link>
                )
            })
            
        }
      </div>
    )
  }