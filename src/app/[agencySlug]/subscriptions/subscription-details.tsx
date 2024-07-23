import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SubscriptionDAO } from "@/services/subscription-services";
import { format } from "date-fns";
import ManageSubscriptionButton from "./manage-subscription-button";

type Props= {
    subscription: SubscriptionDAO
}
export default function SubscriptionDetails({ subscription }: Props) {
    const customPlan= !subscription.plan.priceId?.startsWith("price_")
    const year= subscription.stripePeriodEnd.getFullYear()
    const proximoPago= year === 2030 ? "Indeterminado" : format(subscription.stripePeriodEnd, "yyyy-MM-dd")
    const nextPaymentLabel= customPlan ? "Vencimiento" : "Próximo pago"
    return (
        <div className="space-y-6 my-5">
            <div className="text-center space-y-4">
                <p className="text-2xl md:text-3xl font-bold">Suscripción actual</p>
            </div>
            <div className="">
                <Card className="p-6 space-y-4 max-w-md mx-auto">
                    <div className="space-y-2">
                        <div className="grid gap-2">
                            <div className="grid grid-cols-2 items-center">
                                <div className="text-muted-foreground">Plan</div>
                                <div>{subscription.planName}</div>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                                <div className="text-muted-foreground">Precio</div>
                                <div>{subscription.planPrice} {subscription.planCurrency}</div>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                                <div className="text-muted-foreground">{nextPaymentLabel}</div>
                                <div>{proximoPago}</div>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                                <div className="text-muted-foreground">Método de pago</div>
                                <div>{subscription.stripePaymentMethod}</div>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                                <div className="text-muted-foreground">Stripe</div>
                                <div>{subscription.stripeCustomerEmail}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <ManageSubscriptionButton agencyId={subscription.agencyId} customPlan={customPlan} />
                    </div>
                </Card>
            </div>
        </div>

    );
}