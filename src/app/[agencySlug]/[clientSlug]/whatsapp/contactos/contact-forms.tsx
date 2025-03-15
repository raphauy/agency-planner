"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteContactAction, createOrUpdateContactAction, getContactDAOAction, deleteContactBulkAction } from "./contact-actions"
import { contactSchema, ContactFormValues } from '@/services/contact-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"

type Props= {
  id?: string
  clientId: string
  closeDialog: () => void
}

export function ContactForm({ id, clientId, closeDialog }: Props) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: '',
      imageUrl: '',
      src: '',
      clientId,
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: ContactFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateContactAction(id ? id : null, data)
      toast({ title: id ? "Contacto actualizado" : "Contacto creado" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getContactDAOAction(id).then((data) => {
        if (data) {
          form.setValue("name", data.name)
          data.phone && form.setValue("phone", data.phone)
          data.imageUrl && form.setValue("imageUrl", data.imageUrl)
          data.src && form.setValue("src", data.src)  
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id])

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
                  <Input placeholder="Nombre del contacto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Teléfono del contacto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen (URL)</FormLabel>
                <FormControl>
                  <Input placeholder="Imagen del contacto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="src"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuente</FormLabel>
                <FormControl>
                  <Input placeholder="Fuente del contacto" {...field} />
                </FormControl>
                <FormMessage />
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

type DeleteProps= {
  id: string
  closeDialog: () => void
}

export function DeleteContactForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteContactAction(id)
    .then(() => {
      toast({title: "Contacto eliminado" })
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
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Eliminar  
      </Button>
    </div>
  )
}

type BulkDeleteProps= {
  ids: string[]
  closeDialog: () => void
}

export function BulkDeleteContactForm({ ids, closeDialog }: BulkDeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!ids) return
    setLoading(true)
    deleteContactBulkAction(ids)
    .then(() => {
      toast({title: "Contactos eliminados" })
    })
    .catch((error: any) => {
      toast({title: "Error", description: error.message, variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
      closeDialog && closeDialog()
    })
  }
  
  return (
    <div>
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
      <Button onClick={handleDelete} variant="destructive" className="ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        { `Eliminar ${ids.length} contactos` }
      </Button>
    </div>
  )
}