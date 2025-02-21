"use client"

import Editor from "@/components/editor/advanced-editor";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { NewsletterDAO } from "@/services/newsletter-services";
import { Loader, Save } from "lucide-react";
import { JSONContent } from "novel";
import { useEffect, useRef, useState } from "react";
import { updateContentAction } from "../newsletter-actions";

type Props = {
    newsletter: NewsletterDAO
    initialContent: JSONContent
}

export default function NovelOnClient({ newsletter, initialContent }: Props) {
    const [loading, setLoading] = useState(false);
    const [htmlContent, setHtmlContent] = useState<string>(newsletter.contentHtml || "")
    const [jsonContent, setJsonContent] = useState<JSONContent>(initialContent)
    const [charCount, setCharCount] = useState(newsletter.contentHtml?.length || 0)
    const [charCountSaved, setCharCountSaved] = useState(newsletter.contentHtml?.length || 0)

    const hasUnsavedChanges = charCount !== charCountSaved;

    // Referencia para mantener actualizada la función de desmontaje
    const onBeforeUnmountRef = useRef<() => void>();

    useEffect(() => {
        // Actualiza la referencia en cada renderizado para capturar el estado actual
        onBeforeUnmountRef.current = () => {

            if (hasUnsavedChanges) {
                toast({
                    title: "Tienes cambios sin guardar en el Newsletter",
                    variant: "destructive",
                    action: <ToastAction altText="Try again" onClick={() => save()}>Guardar Cambios</ToastAction>,
                    duration: 10000,
                  })
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasUnsavedChanges]);
    
    useEffect(() => {
        // Función que se ejecutará al desmontar el componente
        return () => {
            // Ejecuta la función actual referenciada
            if(onBeforeUnmountRef.current) {
                onBeforeUnmountRef.current();
            }
        };
    }, []);
    
    function onUpdate(jsonValue: JSONContent, htmlValue: string) {
        console.log("guardando");
        
        setJsonContent(jsonValue)
        setHtmlContent(htmlValue)

        setCharCount(htmlValue.length)
    }

    function save() {
       
        setLoading(true);
        updateContentAction(newsletter.id, htmlContent, JSON.stringify(jsonContent))
        .then(() => {
            toast({ title: "Cambios guardados"})
            setCharCountSaved(charCount)
        })
        .catch((error) => {
            console.log("error", error)
            
            toast({ title: "Hubo un error al guardar el texto", variant: "destructive"})
        })
        .finally(() => {
            setLoading(false);
        })
    }

    return (
        <div className="relative flex h-full xl:min-w-[1000px] flex-col items-center gap-4 justify-between">
            <div className="fixed z-20 flex flex-col gap-1 bottom-50 right-10">
                <Button onClick={save} className="p-2" disabled={charCount === charCountSaved}>
                {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                ) : (
                    <Save />
                )}
                </Button>
            </div>


            <Editor initialValue={jsonContent} onChange={onUpdate} className="border p-5 bg-background w-full" />           

        </div>
    )
}



