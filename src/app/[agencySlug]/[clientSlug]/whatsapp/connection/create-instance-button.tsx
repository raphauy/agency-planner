"use client"

import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { createInstanceAction } from "./actions";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function CreateInstanceButton() {
    const [chatwootAccountId, setChatwootAccountId] = useState("");
    const [loading, setLoading] = useState(false)
    const params= useParams()
    const agencySlug= params.agencySlug as string
    const clientSlug= params.clientSlug as string

    function handleClick() {
        if (!chatwootAccountId) {
            toast({title: "Error", description: "Debes ingresar el ID de la cuenta de Chatwoot", variant: "destructive" })
            return
        }
        setLoading(true)
        createInstanceAction(agencySlug, clientSlug, Number(chatwootAccountId))
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

    if (!agencySlug || !clientSlug) {
        return <div>No se pudo obtener el slug de la agencia o del cliente</div>
    }

    return (
        <div className="flex flex-col gap-4 border p-8 rounded-md border-dashed max-w-xs mx-auto mt-10">
            <Input
              type="number"
              placeholder="ID de la cuenta de Chatwoot"
              value={chatwootAccountId}
              onChange={(e) => setChatwootAccountId(e.target.value)}
            />
            <Button className="" onClick={handleClick}>
                {loading ? <Loader className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Crear conexión
            </Button>
        </div>
    )

}