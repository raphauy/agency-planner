"use client"

import Editor from "@/components/editor/advanced-editor";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { DocumentDAO } from "@/services/document-services";
import { Loader, Save } from "lucide-react";
import { JSONContent } from "novel";
import { useEffect, useRef, useState } from "react";
import { updateContentAction } from "../document-actions";

type Props = {
    document: DocumentDAO
    initialContent: JSONContent
}

export default function NovelOnClient({ document, initialContent }: Props) {

    const [loading, setLoading] = useState(false);
    const [textContent, setTextContent] = useState<string>(document.textContent || "")
    const [jsonContent, setJsonContent] = useState<JSONContent>(document.jsonContent || initialContent)
    const [wordCount, setWordCount] = useState(document.textContent?.split(" ").length || 0)
    const [charCount, setCharCount] = useState(document.textContent?.length || 0)
    const [charCountSaved, setCharCountSaved] = useState(document.textContent?.length || 0)

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
                    duration: 10000,
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
        updateContentAction(document.id, textContent, JSON.stringify(jsonContent))
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
            <div className="fixed z-20 flex flex-col gap-1 bottom-20 right-10">
                <Button onClick={save} className="w-10 p-2" disabled={charCount === charCountSaved}>
                {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                ) : (
                    <Save />
                )}
                </Button>
            </div>

            <div className="flex items-center justify-between w-full px-7">

                <div className="flex items-center w-1/3 gap-2">
                    <p><span className="font-bold">{wordCount}</span>/1000</p> <p>palabras</p>
                </div>
                
                <p className="font-bold">
                {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                ) : (
                    <Button variant={charCount === charCountSaved ? "ghost" : "default"} disabled={charCount === charCountSaved} onClick={save} className="p-2">
                        Guardar
                    </Button>
                )}
                </p>
                  
            </div>
            <Editor initialValue={jsonContent} onChange={onUpdate} className="border p-4 rounded-xl bg-background" />           

        </div>
    )
}



