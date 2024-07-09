"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader } from "lucide-react"
import { useState } from "react"
import { deleteConversationAction, setTitleAction } from "./conversation-actions"
import { Input } from "@/components/ui/input"

type Props= {
  id: string
  title: string
  closeDialog: () => void
}

export function TitleForm({ id, title, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState(title)

  const onSubmit = async () => {
    
    setLoading(true)
    try {
      await setTitleAction(id, value)
      toast({ title: "Título actualizado" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-white rounded-md">

      <div className="space-y-4 mb-5">
        <Label>Título</Label>
        <Input placeholder="Título de la conversación" 
          autoFocus={false}
          value={value} 
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              onSubmit()
            }
          }}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
        <Button type="submit" className="w-32 ml-2" onClick={onSubmit}>
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
        </Button>
      </div>
    </div>     
  )
}

type DeleteProps= {
  id: string
  closeDialog: () => void
}
export function DeleteConversationForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteConversationAction(id)
    .then(() => {
      toast({title: "Conversation deleted" })
    })
    .catch((error) => {
      toast({title: "Error", description: error.message, variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
      closeDialog && closeDialog()
    })
  }
  
  return (
    <div>
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Delete  
      </Button>
    </div>
  )
}

