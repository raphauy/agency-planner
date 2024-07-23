"use client"

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { useState } from "react";
import { manageSubscriptionAction } from "./actions";

type Props= {
    agencyId: string
    customPlan?: boolean
    label?: string
    disabled?: boolean
}
export default function ManageSubscriptionButton({ agencyId, customPlan, label="Gestionar suscripción", disabled }: Props) {

    const [loading, setLoading] = useState(false)

    function handleManageSubscription() {
        setLoading(true)
        manageSubscriptionAction(agencyId)
        .catch((error) => {
            console.error(error)
            toast({ title: "Error", description: error.message, variant: "destructive" })
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <Button className="w-full" onClick={handleManageSubscription} disabled={loading || customPlan || disabled}>
            {
                loading ? <Loader className="animate-spin" /> : <p>{label}</p>
            }
        </Button>
    );
}