"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader, Save, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { PublicationDAO } from "@/services/publication-services"
import { useParams } from "next/navigation"
import { getCalendarNoteAction, updateCalendarNoteAction, deleteCalendarNoteAction } from "./calendar-note-actions"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  noteId: string
}

const noteSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
})

type NoteFormValues = z.infer<typeof noteSchema>

export function NoteEditorDialog({ open, onOpenChange, noteId }: Props) {
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [publication, setPublication] = useState<PublicationDAO | null>(null)
  const params = useParams()
  
  const agencySlug = params.agencySlug as string
  const clientSlug = params.clientSlug as string

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
    }
  })

  // Cargar los datos de la nota
  useEffect(() => {
    if (open && noteId) {
      setLoading(true)
      getCalendarNoteAction(noteId)
        .then((data) => {
          if (data) {
            setPublication(data)
            form.setValue("title", data.title)
          }
        })
        .catch((error) => {
          toast({ title: "Error", description: "No se pudo cargar la nota", variant: "destructive" })
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [open, noteId, form])

  async function onSubmit(data: NoteFormValues) {
    if (!publication) return
    
    setLoading(true)
    try {
      await updateCalendarNoteAction({
        id: noteId,
        title: data.title,
      })
      toast({ title: "Nota actualizada correctamente" })
      onOpenChange(false)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!noteId) return
    
    setDeleting(true)
    try {
      await deleteCalendarNoteAction(noteId)
      toast({ title: "Nota eliminada correctamente" })
      onOpenChange(false)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{publication ? "Editar nota" : "Cargando..."}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título de la nota" {...field} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={deleting || loading}
                  className="flex items-center"
                >
                  {deleting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Eliminar
                </Button>
                
                <div className="flex space-x-2">
                  <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
} 