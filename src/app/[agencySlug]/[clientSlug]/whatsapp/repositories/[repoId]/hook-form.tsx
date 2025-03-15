"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader, Pencil } from "lucide-react"
import { useState } from "react"
import { setWebHookUrlAction } from "../repository-actions"

type Props= {
  repoId: string
  initialValue: string
}

export function HookForm({ repoId, initialValue }: Props) {

  const [isEditing, setIsEditing] = useState(false)
  const toggleEdit = () => setIsEditing(!isEditing)

  const [loading, setLoading] = useState(false)
  const [webHookUrl, setWebHookUrl] = useState(initialValue)

  const urlPattern = /^(https:\/\/[^\s/$.?#].[^\s]*|http:\/\/localhost(:\d{1,5})?(\/.*)?)$/

  async function onSubmit() {
    toggleEdit()
    if (webHookUrl === initialValue) return

    const isValidUrl = urlPattern.test(webHookUrl)
    if (!isValidUrl) {
      setWebHookUrl(initialValue)
      toast({title: "El hook debe ser una URL válida y con https", variant: "destructive"})
      return
    }
    
    setLoading(true)
    try {
      const ok= await setWebHookUrlAction(repoId, webHookUrl)
    
      if (ok) {
        toast({title: `Hook editado` })
      } else {
        setWebHookUrl(initialValue)
        toast({title: "Error al editar el hook", variant: "destructive"})
      }
    } catch (error: any) {
      setWebHookUrl(initialValue)
      toast({title: "Error al editar", description: error.message, variant: "destructive"})
    } finally {
      setLoading(false)
    }
  }

  function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
      <div className="flex flex-col">
            {
              isEditing ? (

                <div className="flex items-center justify-between gap-1">
                  <input
                    name="title"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    autoFocus
                    disabled={!isEditing}
                    value={webHookUrl}
                    onChange={(e) => setWebHookUrl(e.target.value)}
                    onKeyDown={handleEnterKey}
                    onBlur={onSubmit}
                  />
                </div>

              ) : 
              loading ? (
                <div className="h-10 w-full flex items-center justify-center">
                  <Loader className="animate-spin" />
                </div>
              ) : (
                <Button onClick={toggleEdit} variant="ghost" type="button" className="p-0 flex justify-between">
                  <p>{initialValue}</p> <Pencil className="w-5 h-5 mb-1" />
                </Button>
              )
            }
    </div>
  )
}