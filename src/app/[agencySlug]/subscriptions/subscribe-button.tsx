"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { subcribeAction } from "./actions";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";

type Props= {
    priceId: string
    agencyId: string
    email: string
    disabled?: boolean
}
export default function SubscribeButton({ priceId, agencyId, email, disabled }: Props) {
    const [loading, setLoading] = useState(false)

    const session = useSession()
    const userEmail = session?.data?.user?.email

    function handleSubscribe() {
        setLoading(true)
        subcribeAction(priceId, agencyId, email)
        .then(() => {
            toast({ title: "Subscription created" })
        })
        .catch((error) => {
            console.error(error)
            toast({ title: "Error", description: error.message, variant: "destructive" })
        })
        .finally(() => {
            setLoading(false)
        })

    }


    if (userEmail && userEmail === "rapha.uy@rapha.uy") {
        return (
            <Button className="w-full" onClick={handleSubscribe} disabled={loading || disabled}>
                {
                    loading ? <Loader className="animate-spin" /> : <p>Suscribirse (RC)</p>
                }
            </Button>
        );
    }
        

    return (
        // <Button className="w-full" onClick={handleSubscribe} disabled={loading || disabled}>
        <Button className="w-full" onClick={handleSubscribe} disabled={true}>
        {
                loading ? <Loader className="animate-spin" /> : <p>Suscribirse (comming soon...)</p>
            }
        </Button>
    );
}