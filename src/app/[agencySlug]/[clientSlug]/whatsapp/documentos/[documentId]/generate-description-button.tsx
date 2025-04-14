"use client"

import { Button } from "@/components/ui/button";
import { Loader, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { generateDescriptionAction } from "../document-actions";
import { toast } from "@/components/ui/use-toast";
import { DescriptionForm } from "@/components/description-form";

type Props= {
    id: string
}
export default function GenerateDescriptionButton({ id }: Props) {

    const [loading, setLoading] = useState(false)

    function handleGenerateDescription() {
        setLoading(true)
        generateDescriptionAction(id)
        .then((res) => {
            if (res) {
                toast({ title: "Descripción generada",  description: "La descripción se ha generado correctamente" })
            } else {
                toast({ title: "Error al generar descripción",  description: "Hubo un error al generar la descripción" })
            }            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <div>

            <Button onClick={handleGenerateDescription} className="gap-2">
                {
                    loading ? 
                    <Loader className="w-4 h-4 animate-spin" /> 
                    :
                    <RefreshCcw className="w-4 h-4" />
                }
                <p>Generar descripción</p>
            </Button>

            
        </div>
    );
}