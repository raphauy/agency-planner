"use client"

import Editor from "@/components/editor/advanced-editor";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { NewsletterDAO } from "@/services/newsletter-services";
import { Eye, Loader, Save } from "lucide-react";
import { JSONContent } from "novel";
import { useEffect, useRef, useState } from "react";
import { updateContentAction } from "../newsletter-actions";
import Link from "next/link";

type Props = {
    newsletter: NewsletterDAO
    initialContent: JSONContent
}

export default function NovelOnClient({ newsletter, initialContent }: Props) {

    const [loading, setLoading] = useState(false);
    const [textContent, setTextContent] = useState<string>(newsletter.contentHtml || "")
    const [jsonContent, setJsonContent] = useState<JSONContent>(initialContent)
    const [wordCount, setWordCount] = useState(newsletter.contentHtml?.split(" ").length || 0)
    const [charCount, setCharCount] = useState(newsletter.contentHtml?.length || 0)
    const [charCountSaved, setCharCountSaved] = useState(newsletter.contentHtml?.length || 0)

    // Referencia para mantener actualizada la función de desmontaje
    const onBeforeUnmountRef = useRef<() => void>();

    useEffect(() => {
        // Actualiza la referencia en cada renderizado para capturar el estado actual
        onBeforeUnmountRef.current = () => {

            if (charCount !== charCountSaved) {
                toast({
                    title: "Tienes cambios sin guardar.",
                    variant: "destructive",
                    action: <ToastAction altText="Try again" onClick={() => save()}>Guardar Cambios</ToastAction>,
                  })
            }
        };
    });
    
    useEffect(() => {
        // Función que se ejecutará al desmontar el componente
        return () => {
            // Ejecuta la función actual referenciada
            if(onBeforeUnmountRef.current) {
                onBeforeUnmountRef.current();
            }
        };
    }, []);

    function onUpdate(jsonValue: JSONContent, textValue: string) {
        console.log("guardando");
        
        setJsonContent(jsonValue)
        setTextContent(textValue)

        setTextContent(textValue)

        const wordCount = textValue.split(" ").length
        setWordCount(wordCount)
        setCharCount(textValue.length)
    }

    function save() {
       
        setLoading(true);
        updateContentAction(newsletter.id, textContent, JSON.stringify(jsonContent))
        .then(() => {
            toast({ title: "Texto guardado"})
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
                <Button onClick={save} className="p-2">
                {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                ) : (
                    <Save />
                )}
                </Button>
                <Link href={`newsletters/${newsletter.id}/preview`} target="_blank">
                    <Button className="p-2">
                        <Eye />
                    </Button>
                </Link>

            </div>


            <Editor initialValue={jsonContent} onChange={onUpdate} className="border p-5 bg-background w-full" />           

        </div>
    )
}



