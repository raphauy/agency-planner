"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { CirclePlay, Loader } from "lucide-react"
import { useState } from "react"
import { processPendingEmailsendsAction } from "../newsletter-actions"

type Props = {
    isSuperAdmin: boolean
}

export function ProcessPendingButton({ isSuperAdmin }: Props) {
    const [loading, setLoading] = useState(false)

    function handleClick() {
        setLoading(true)
        processPendingEmailsendsAction()
        .then(() => {
            toast({
                title: "Emails pendientes procesados",
                description: "Se han procesado los emails pendientes",
            })
        })
        .catch((error) => {
            toast({
                title: "Error",
                description: "Error al procesar los emails pendientes",
                variant: "destructive",
            })
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <Button onClick={handleClick} className="gap-2">
            {loading ? <Loader className="w-4 h-4 animate-spin" /> :<CirclePlay className="w-4 h-4" />}
            Procesar emails pendientes
        </Button>
    )
}