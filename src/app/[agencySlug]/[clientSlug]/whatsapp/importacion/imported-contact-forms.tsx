"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { ImportedContactFormValues, importedContactSchema } from '@/services/imported-contacts-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createOrUpdateImportedContactAction, deleteImportedContactAction, getImportedContactDAOAction } from "./imported-contact-actions"
import { ImportedContactType } from ".prisma/client"

type Props= {
  clientId: string
  id?: string
  closeDialog: () => void
}

export function ImportedContactForm({ clientId, id, closeDialog }: Props) {
  const form = useForm<ImportedContactFormValues>({
    resolver: zodResolver(importedContactSchema),
    defaultValues: {
      clientId: clientId,
      name: "",
      phone: "",
      stageName: "",
      tags: "",
      type: ImportedContactType.MANUAL,
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: ImportedContactFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateImportedContactAction(id ? id : null, data)
      toast({ title: id ? "Contacto importado actualizado" : "Contacto importado creado" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getImportedContactDAOAction(id).then((data) => {
        if (data) {
          const formData = {
            ...data,
            stageName: data.stageName || "",
            tags: data.tags?.join(",") || "",
          }
          form.reset(formData)
        }
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
                  <Input placeholder="Nombre" {...field} />
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
                <FormLabel>Teléfono (whatsapp)</FormLabel>
                <FormControl>
                  <Input placeholder="Teléfono (whatsapp)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etiquetas</FormLabel>
                <FormControl>
                  <Input placeholder="Etiquetas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      
          <FormField
            control={form.control}
            name="stageName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado CRM</FormLabel>
                <FormControl>
                  <Input placeholder="Estado CRM" {...field} />
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

type DeleteImportedContactProps= {
  id: string
  closeDialog: () => void
}

export function DeleteImportedContactForm({ id, closeDialog }: DeleteImportedContactProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteImportedContactAction(id)
    .then(() => {
      toast({title: "ImportedContact deleted" })
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

