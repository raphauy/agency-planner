import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckIcon, CreditCardIcon, DollarSignIcon, WalletCardsIcon } from "lucide-react"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getPlansDAO } from "@/services/plan-services"
import { getBestValidSubscription } from "@/services/subscription-services"
import ManageSubscriptionButton from "./manage-subscription-button"
import SubscribeButton from "./subscribe-button"
import { cn, getCurrentUser } from "@/lib/utils"
import SubscriptionDetails from "./subscription-details"
import UsageDetails from "./usage-details"
import { getMonthlyUsagesDAOByAgency } from "@/services/monthlyusage-services"
import { DetailsInfo } from "../credits/details-card"
import { Badge } from "@/components/ui/badge"

type Props= {
  params: {
    agencySlug: string
  }
}
export default async function SubscriptionsPage({ params }: Props) {
    const agencySlug= params.agencySlug as string
    const agency= await getAgencyDAOBySlug(agencySlug)
    if (!agency) {
      return <div>Agencia no encontrada</div>
    }

    const user= await getCurrentUser()
    
    const allPlans= await getPlansDAO()
    const stripePlans= allPlans.filter(plan => plan.priceId && plan.priceId.startsWith("price_"))
    
    let plans
    if (user?.email === "rapha.uy@rapha.uy") {
      plans= allPlans
    } else {
      plans= stripePlans
    }
    const bestSubscription= await getBestValidSubscription(agency.id)

    const now= new Date()

    let month= now.getMonth()
    let year= now.getFullYear()
    
  
    let info: DetailsInfo | undefined
    if (bestSubscription) {
        const agencyInfo= await getMonthlyUsagesDAOByAgency(agency.id, bestSubscription, year, month)
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
        <div className="w-full mx-auto bg-background border rounded-md">
            {
                bestSubscription && info &&
                <div className="flex gap-4 justify-center xl:gap-10">
                    <SubscriptionDetails subscription={bestSubscription} />
                    <UsageDetails subscription={bestSubscription} info={info} />
                </div>
            }
            <div className="container space-y-8 max-w-6xl mt-16 p-3 py-4 mx-auto ">
                <div className="text-center space-y-4">
                    <p className="text-3xl md:text-4xl font-bold">Planes de suscripción</p>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Elige el plan adecuado para tu agencia y gestiona tu suscripción.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {
                        plans.map(plan => {
                            const customPlan= !plan.priceId?.startsWith("price_")

                            let disabled= false
                            if (bestSubscription && plan.price < bestSubscription.planPrice) {
                                disabled= true
                            }
                            const features= plan.features.split(",")
                            const activeSubscription= plan.subscriptions.find(s => s.stripePeriodEnd > now && s.agencyId === agency.id)
                            const activePlanPriceId= activeSubscription ? plan.priceId : null
                        
                            return (
                            <Card key={plan.id} className={cn("bg-muted/20 p-6 space-y-4 flex flex-col justify-between", activePlanPriceId === plan.priceId && "border-primary")}>
                                <div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                                            {activePlanPriceId === plan.priceId && <Badge className="bg-green-400 text-black">Activo</Badge>}
                                        </div>
                                        <p className="text-4xl font-bold">{plan.price} {plan.currency}</p>
                                        <p className="text-muted-foreground text-sm">por mes:</p>
                                    </div>
                                    <ul className="space-y-2 text-sm">
                                    {
                                        features.map((feature, index) => {
                                            return (
                                                <li className="flex items-center gap-2" key={index}>
                                                    <CheckIcon className="h-4 w-4 text-primary text-green-500" />
                                                    {feature}
                                                </li>
                                            )
                                        })
                                    }
                                    </ul>
                                </div>
                                {
                                    bestSubscription && bestSubscription.plan.priceId && bestSubscription.plan.priceId.startsWith("price_") ?
                                    <ManageSubscriptionButton agencyId={agency.id} customPlan={customPlan} label={activePlanPriceId === plan.priceId ? "Gestionar suscripción" : "Cambiar plan"} disabled={disabled} />
                                    :
                                    plan.priceId && user?.email && <SubscribeButton priceId={plan.priceId} agencyId={agency.id} email={user.email} disabled={disabled} />
                                }

                            </Card>
                            )
                        })
                    }

                </div>                
            </div>
        </div>
    )
}
