"use client"

import { updateLeadPromptAction, updateLeadPromptAndCreateVersionAction } from "@/app/[agencySlug]/clients/client-actions"
import { deletePromptVersionAction } from "@/app/admin/promptversions/promptversion-actions"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { PromptVersionDAO, PromptVersionFormValues } from "@/services/prompt-version-services"
import { format } from 'date-fns'
import { toZonedTime } from "date-fns-tz"
import { ArrowUpCircle, Loader, Save } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from 'react'
import PromptVersionList from './prompt-version-list'

type Props = {
  clientId: string
  timezone: string
  prompt: string
  versions: PromptVersionDAO[]
}
    
export default function PromptVersionManager({ clientId, timezone, prompt, versions }: Props) {
    const [loadingGuardar, setLoadingGuardar] = useState(false)
    const [loadingAplicar, setLoadingAplicar] = useState(false)
    const [currentPrompt, setCurrentPrompt] = useState("")
    const [selectedVersion, setSelectedVersion] = useState<PromptVersionDAO | null>(null)

    const [charCountSaved, setCharCountSaved] = useState(0)
    const [charCount, setCharCount] = useState(0)
  
    const session = useSession()
    const currentUser = session?.data?.user?.name || session?.data?.user?.email

    useEffect(() => {        
        const count= prompt.length
        setCharCount(count)
        setCharCountSaved(count)
        setCurrentPrompt(prompt)
    }, [prompt])

    function saveVersion() {
        setLoadingGuardar(true)
        const newVersion: PromptVersionFormValues = {
            content: currentPrompt,
            user: currentUser as string,
            clientId: clientId
        }
        
        updateLeadPromptAndCreateVersionAction(newVersion)
        .then(() => {
            toast({ title: "Versión guardada" })
            setCharCountSaved(charCount)
            setSelectedVersion(null)
        })
        .catch(() => {
            toast({ title: "Error", description: "Error al guardar la versión del prompt" })
        })
        .finally(() => {
            setLoadingGuardar(false)
        })
    }

    function deleteVersion(id: string) {
        setLoadingGuardar(true)
        deletePromptVersionAction(id)
        .then(() => {
        toast({title: "Versión eliminada" })
        })
        .catch((error) => {
        toast({title: "Error", description: error.message, variant: "destructive"})
        })
        .finally(() => {
        setLoadingGuardar(false)
        })
    }

    function handleUseVersion(version: PromptVersionDAO) {
        setCurrentPrompt(version.content)
        setLoadingAplicar(true)
        updateLeadPromptAction(clientId, version.content)
        .then(() => {
            toast({title: "Prompt actualizado"})
            const count= version.content.length
            setCharCount(count)
            setCharCountSaved(count)
        })
        .catch(() => {
            toast({title: "Error", description: "Error al actualizar el prompt", variant: "destructive"})
        })
        .finally(() => {
            setLoadingAplicar(false)
        })
    }

    function viewVersion(version: PromptVersionDAO) {
        setSelectedVersion(version)
    }

    if (!currentUser) {
        return <div>Usuario no encontrado</div>
    }


    return (
        <div className="w-full flex flex-col h-full">
            <div className="space-y-2 mb-4">
                <Textarea
                    value={currentPrompt}
                    // onChange={(e) => setCurrentPrompt(e.target.value)}
                    placeholder="Escribe tu prompt aquí..."
                    className="w-full min-h-[300px]"
                    onChange={(e) => {
                        const text = e.target.value
                        setCharCount(text.length)
                        setCurrentPrompt(text)
                    }}
                />
                <div className="flex justify-end">
                <Button 
                    onClick={saveVersion} 
                    className={cn("w-48", {
                        "opacity-50 cursor-not-allowed": charCountSaved === charCount
                    })}
                    disabled={charCountSaved === charCount}
                >
                    {loadingGuardar ? <Loader className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                    Guardar prompt
                </Button>
                </div>
            </div>

            <Separator className="my-4"/>

            <div className="flex gap-4 flex-grow min-h-[400px]">
                <div className="w-96 flex flex-col h-full">
                <div className="h-14 flex items-center px-2">
                    <h2 className="text-lg font-semibold">Historial de Versiones</h2>
                </div>
                <div className="flex-grow border rounded-md overflow-hidden">
                    <PromptVersionList
                    versions={versions}
                    timezone={timezone}
                    selectedVersion={selectedVersion}
                    currentPrompt={currentPrompt}
                    onViewVersion={viewVersion}
                    onUseVersion={handleUseVersion}
                    onDeleteVersion={deleteVersion}
                    />
                </div>
                </div>
                <div className="w-full flex flex-col h-full">
                <div className="h-14 flex items-center justify-between px-2">
                    {selectedVersion && (
                        <>
                            <h2 className="text-lg font-semibold">{selectedVersion.user} - {format(toZonedTime(selectedVersion.timestamp, timezone), "dd/MM/yyyy HH:mm:ss")}</h2>
                            <Button onClick={() => handleUseVersion(selectedVersion)} disabled={loadingAplicar}>
                                {loadingAplicar ? <Loader className="mr-2 h-5 w-5 animate-spin" /> : <ArrowUpCircle className="mr-2 h-5 w-5" />}
                                Aplicar esta versión
                            </Button>
                        </>
                    )}
                </div>
                <div className="flex-grow border rounded-md overflow-hidden">
                    <ScrollArea className="h-full max-h-[500px]">
                    <div className="p-4">
                        {selectedVersion ? (
                            <p className="whitespace-pre-wrap">{selectedVersion.content}</p>
                        ) : (
                        <p className="text-muted-foreground">Selecciona una versión para ver su contenido</p>
                        )}
                    </div>
                    </ScrollArea>
                </div>
                </div>
            </div>
        </div>
    )
}