"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deletePilarAction, createOrUpdatePilarAction, getPilarDAOAction } from "./pilar-actions"
import { pilarSchema, PilarFormValues } from '@/services/pilar-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { useParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Props= {
  id?: string
  closeDialog: () => void
}

export function PilarForm({ id, closeDialog }: Props) {
  const agencySlug= useParams().agencySlug as string
  const clientSlug= useParams().clientSlug as string

  const form = useForm<PilarFormValues>({
    resolver: zodResolver(pilarSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "",
      agencySlug,
      clientSlug,
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: PilarFormValues) => {
    data.clientSlug= clientSlug
    setLoading(true)
    try {
      await createOrUpdatePilarAction(id ? id : null, data)
      toast({ title: id ? "Pilar actualizado" : "Pilar creado" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getPilarDAOAction(id).then((data) => {
        if (data) {
          form.reset(data)
          form.setValue("agencySlug", agencySlug)
          form.setValue("clientSlug", clientSlug)
          form.setValue("color", data.color)
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id, clientSlug, agencySlug])

  return (
    <div className="p-4 bg-white rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del Pilar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descripción del Pilar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Color</FormLabel>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex gap-2 pt-2"
              >
                <FormItem>
                  <FormLabel>
                    <FormControl>
                      <RadioGroupItem value="#bfe1ff" className="sr-only" />
                    </FormControl>
                    <div className={cn("flex gap-1 items-center rounded-md border-2 border-muted p-1 hover:border-accent cursor-pointer", field.value === "#bfe1ff" && "border-primary")}>
                      <div className="w-6 h-6 rounded-full bg-[#bfe1ff]" /> Azul
                    </div>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="#d0f0c0" className="sr-only" />
                    </FormControl>
                    <div className={cn("flex gap-1 items-center rounded-md border-2 border-muted p-1 hover:border-accent cursor-pointer", field.value === "#d0f0c0" && "border-primary")}>
                      <div className="w-6 h-6 rounded-full bg-[#d0f0c0]" /> Verde
                    </div>
                  </FormLabel>
                </FormItem>

                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="#ffd0d0" className="sr-only" />
                    </FormControl>
                    <div className={cn("flex gap-1 items-center rounded-md border-2 border-muted p-1 hover:border-accent cursor-pointer", field.value === "#ffd0d0" && "border-primary")}>
                      <div className="w-6 h-6 rounded-full bg-[#ffd0d0]" /> Rojo
                    </div>
                  </FormLabel>
                </FormItem>

                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="#ffcc99" className="sr-only" />
                    </FormControl>
                    <div className={cn("flex gap-1 items-center rounded-md border-2 border-muted p-1 hover:border-accent cursor-pointer", field.value === "#ffcc99" && "border-primary")}>
                      <div className="w-6 h-6 rounded-full bg-[#ffcc99]" /> Naranja
                    </div>
                  </FormLabel>
                </FormItem>

                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="#e8d0ff" className="sr-only" />
                    </FormControl>
                    <div className={cn("flex gap-1 items-center rounded-md border-2 border-muted p-1 hover:border-accent cursor-pointer", field.value === "#e8d0ff" && "border-primary")}>
                      <div className="w-6 h-6 rounded-full bg-[#e8d0ff]" /> Púrpura
                    </div>
                  </FormLabel>
                </FormItem>

              </RadioGroup>
            </FormItem>
          )}
        />  
      
          
      
        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

export function DeletePilarForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deletePilarAction(id)
    .then(() => {
      toast({title: "Pilar deleted" })
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

