"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { CircleCheckBig, Loader } from "lucide-react"
import { useState } from "react"
import { checkResendStatusAction } from "../newsletter-actions"

type Props = {
    isSuperAdmin: boolean
}

export function CheckSentButton({ isSuperAdmin }: Props) {
    const [loading, setLoading] = useState(false)

    function handleClick() {
        setLoading(true)
        checkResendStatusAction()
        .then(() => {
            toast({
                title: "Emails chequeados",
                description: "Se han chequeado los emails enviados",
            })
        })
        .catch((error) => {
            toast({
                title: "Error",
                description: "Error al chequear los emails enviados",
                variant: "destructive",
            })
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <Button onClick={handleClick} className="gap-2">
            {loading ? <Loader className="w-4 h-4 animate-spin" /> :<CircleCheckBig className="w-4 h-4" />}
            Chequear emails enviados
        </Button>
    )
}