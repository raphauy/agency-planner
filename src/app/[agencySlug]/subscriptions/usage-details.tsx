import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SubscriptionDAO } from "@/services/subscription-services";
import { format } from "date-fns";
import ManageSubscriptionButton from "./manage-subscription-button";
import { BotIcon, CloudIcon, Sigma } from "lucide-react";
import { DetailsInfo } from "../credits/details-card";

type Props= {
    subscription: SubscriptionDAO
    info: DetailsInfo
}
export default function UsageDetails({ subscription, info }: Props) {
    const llmPercent= info.llmCredits / subscription.maxLLMCredits * 100
    const totalPercent= (info.llmCredits + info.storageCredits) / subscription.maxCredits * 100
    return (
        <div className="space-y-6 my-5 flex flex-col">
            <div className="text-center space-y-4">
                <p className="text-2xl md:text-3xl font-bold">Gasto actual</p>
            </div>
            <div className="flex-1">
                <Card className="p-6 space-y-4 max-w-md mx-auto h-full">
                    <div className="grid gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-muted rounded-md p-3 flex items-center justify-center">
                                <Sigma className="w-6 h-6" />
                            </div>
                            <div className="grid w-full">
                                <h4 className="font-semibold">Créditos Totales</h4>
                                <p>{(info.llmCredits + info.storageCredits).toFixed(0)} / {subscription.maxCredits} créditos</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${totalPercent}%` }} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-muted rounded-md p-3 flex items-center justify-center">
                                <CloudIcon className="w-6 h-6" />
                            </div>
                            <div className="grid gap-1 w-full">
                                <h4 className="font-semibold">Créditos de almacenamiento</h4>
                                <p>{info.storageCredits.toFixed(0)} / {subscription.maxCredits} créditos</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${totalPercent}%` }} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-muted rounded-md p-3 flex items-center justify-center">
                                <BotIcon className="w-6 h-6" />
                            </div>
                            <div className="grid w-full">
                                <h4 className="font-semibold">Créditos de LLM</h4>
                                <p>{info.llmCredits.toFixed(0)} / {subscription.maxLLMCredits} créditos</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${llmPercent}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>

    );
}