"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NewsletterFormValues, NewsletterSchema } from '@/services/newsletter-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createOrUpdateNewsletterAction, deleteNewsletterAction, getNewsletterDAOAction, sendTestEmailAction } from "./newsletter-actions"
import { z } from "zod"
import { toast } from "@/components/ui/use-toast"




type Props = {
  id?: string
  clientId: string
  closeDialog: () => void
}

export function NewsletterForm({ id, clientId, closeDialog }: Props) {
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(NewsletterSchema),
    defaultValues: {
      subject: "",
      clientId: clientId,
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)


  const onSubmit = async (data: NewsletterFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateNewsletterAction(id ? id : null, data)
      toast({ title: id ? "Newsletter actualizado" : "Newsletter creado" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getNewsletterDAOAction(id).then((data) => {
        if (data) {
          form.reset(data)
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
    <div className="rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asunto</FormLabel>
                <FormControl>
                  <Input placeholder="Asunto del Newsletter" {...field} />
                </FormControl>
                <FormDescription>El asunto del Newsletter, lo puedes cambiar en cualquier momento.</FormDescription>
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

export function DeleteNewsletterForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteNewsletterAction(id)
    .then(() => {
      toast({title: "Newsletter eliminado" })
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

type TestProps= {
  newsletterId: string
  emailFromConfigured: boolean
  closeDialog: () => void
}

export function TestEmailForm({ newsletterId, emailFromConfigured, closeDialog }: TestProps) {
  const testEnvioSchema = z.object({
    mailTo: z.string().email({ message: "Invalid email" }),
  })
  
  type TestEnvioFormValues = z.infer<typeof testEnvioSchema>
  
  const form = useForm<TestEnvioFormValues>({
    resolver: zodResolver(testEnvioSchema),
    defaultValues: {},
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)


  const onSubmit = async (data: TestEnvioFormValues) => {
    setLoading(true)
    try {
      await sendTestEmailAction(newsletterId, data.mailTo)
      toast({ title: "Test Email sent" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: "Verifica que el Newsletter hasya sido guardado.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="p-4 bg-white rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="mailTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email To</FormLabel>
                <FormControl>
                  <Input placeholder="Email To" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <p>Enviar Email</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}
