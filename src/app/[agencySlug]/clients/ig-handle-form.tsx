"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { z } from "zod"
import { createClientWithIgHandleAction } from "./client-actions"


export const igHandleSchema = z.object({
	igHandle: z.string({required_error: "igHandle is required."}),
})
export type IgHandleFormValues = z.infer<typeof igHandleSchema>

type Props= {
  agencyId: string
  closeDialog: () => void
}

export function IgClientForm({ agencyId, closeDialog }: Props) {
  const form = useForm<IgHandleFormValues>({
    resolver: zodResolver(igHandleSchema),
    defaultValues: {
        igHandle: "",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: IgHandleFormValues) => {

    setLoading(true)
    try {
      await createClientWithIgHandleAction(agencyId, data.igHandle)
      toast({ title: "Cliente creado" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message })
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
            name="igHandle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Handle de Instagram:</FormLabel>
                <FormControl>
                  <Input placeholder="raphauy" {...field} />
                </FormControl>
                <FormDescription>
                  Utilizaremos el handle de Instagram para obtener nombre, descripción e imagen del cliente. Luego lo podrás editar en la configuración del cliente.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
      
          <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Crear</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

