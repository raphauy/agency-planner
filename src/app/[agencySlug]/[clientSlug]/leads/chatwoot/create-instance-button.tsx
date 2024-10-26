"use client"

import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { createInstanceAction } from "./actions";

type Props = {
    clientId: string
}
export default function CreateInstanceButton({ clientId }: Props) {
    const [loading, setLoading] = useState(false)

    function handleClick() {
        setLoading(true)
        createInstanceAction(clientId)
        .then(() => {
            toast({title: "Conexión creada, procesando..." })
        })
        .catch((error) => {
            toast({title: "Error", description: "Error al crear la conexión", variant: "destructive" })
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <Button className="" onClick={handleClick}>
            {loading ? <Loader className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Crear instancia WRC
        </Button>
    )
}