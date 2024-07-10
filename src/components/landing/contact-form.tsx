"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "../ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { Loader } from "lucide-react"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { z } from "zod"
import { sendMessageAction } from "@/app/contact-form-actions"

const contactSchema = z.object({
  email: z.string().min(1, "email es obligatorio.").email("email no es valido"),
  message: z.string().min(1, "debes escribir algo :-)"),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function ContactForm() {

  const form = useForm<ContactFormValues>({ 
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      message: "",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: ContactFormValues) => {
    
    setLoading(true)
    try {
      sendMessageAction(data.email, data.message)
      .then(() => {
        form.reset()
        toast({ title: "Mensaje enviado", description: "Gracias por tu mensaje" })
      })
      .catch((error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" })
      })      
      .finally(() => {
        setLoading(false)
      })
      
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  return (
    <div className="w-full" id="contact">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensaje</FormLabel>
                <FormControl>
                  <Textarea rows={8} placeholder="Mensaje" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Enviar</p>}
          </Button>
        </form>
      </Form>
    </div>     
  )
}
