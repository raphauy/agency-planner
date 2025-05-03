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
import { Loader, Save } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"
import { es } from "date-fns/locale"
import { CalendarNoteData, createCalendarNoteAction } from "./calendar-note-actions"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  agencySlug: string
  clientSlug: string
  date: Date
}

const calendarNoteSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
})

type CalendarNoteFormValues = z.infer<typeof calendarNoteSchema>

export function CalendarNoteDialog({ open, onOpenChange, agencySlug, clientSlug, date }: Props) {
  const [loading, setLoading] = useState(false)

  const form = useForm<CalendarNoteFormValues>({
    resolver: zodResolver(calendarNoteSchema),
    defaultValues: {
      title: "",
    }
  })

  async function onSubmit(data: CalendarNoteFormValues) {
    setLoading(true)
    try {
      const noteData: CalendarNoteData = {
        title: data.title,
        date: date
      }
      
      await createCalendarNoteAction(noteData, agencySlug, clientSlug)
      toast({ title: "Nota creada correctamente" })
      form.reset()
      onOpenChange(false)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const formattedDate = format(date, "PPP", { locale: es })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nota para {formattedDate}</DialogTitle>
        </DialogHeader>
        
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 