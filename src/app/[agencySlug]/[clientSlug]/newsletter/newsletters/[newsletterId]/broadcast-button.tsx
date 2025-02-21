"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader, Radio } from "lucide-react"
import { useState } from "react"
import { broadcastNewsletterAction } from "../newsletter-actions"

type Props = {
    newsletterId: string
}

export function BroadcastButton({ newsletterId }: Props) {
    const [loading, setLoading] = useState(false)

    function handleClick() {
        setLoading(true)
        broadcastNewsletterAction(newsletterId)
        .then(() => {
            toast({
                title: "Broadcast iniciado",
                description: "El newsletter se está enviando a todos los contactos",
            })
        })
        .catch((error) => {
            toast({
                title: "Error",
                description: "Error al iniciar el broadcast",
                variant: "destructive",
            })
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <Button onClick={handleClick} className="gap-2">
            {loading ? <Loader className="w-4 h-4 animate-spin" /> :<Radio className="w-4 h-4" />}
            Enviar newsletter a todos los contactos
        </Button>
    )
}