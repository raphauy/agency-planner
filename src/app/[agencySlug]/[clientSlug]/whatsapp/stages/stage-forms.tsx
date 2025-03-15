"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteStageAction, createOrUpdateStageAction, getStageDAOAction } from "./stage-actions"
import { stageSchema, StageFormValues } from '@/services/stage-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"

type Props= {
  id?: string
  clientId?: string
  closeDialog: () => void
}

export function StageForm({ id, clientId, closeDialog }: Props) {
  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      clientId,
      name: "",
      description: "",
      isFinal: false,
      isBotEnabled: false,
      color: ""
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: StageFormValues) => {
    setLoading(true)
    try {
      const updated=await createOrUpdateStageAction(id ? id : null, data)
      toast({ title: id ? "Estado actualizado" : "Estado creado" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getStageDAOAction(id).then((data) => {
        if (data) {
          form.setValue("clientId", data.clientId)
          form.setValue("name", data.name)
          form.setValue("description", data.description ?? "")
          form.setValue("isFinal", data.isFinal)
          form.setValue("isBotEnabled", data.isBotEnabled)
          form.setValue("color", data.color ?? "")
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
                  <Input placeholder="Nombre del estado" {...field} />
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
                  <Input placeholder="Descripción del estado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="isFinal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <div className="border p-2 rounded-md w-full">
                  <div className="flex items-center mb-2 space-x-1">
                    <FormLabel className="w-24 mt-1">Final</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormLabel className="text-xs text-muted-foreground mt-2">Indica si es el estado final</FormLabel>
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isBotEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <div className="border p-2 rounded-md w-full">
                  <div className="flex items-center mb-2 space-x-1">
                    <FormLabel className="w-24 mt-1">Bot habilitado</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-xs text-muted-foreground">Indica si el bot puede responder en este estado</FormLabel>
                    </div>
                </div>
              </FormItem>
            )}
          />
          
        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Save</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

export function DeleteStageForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteStageAction(id)
    .then(() => {
      toast({title: "Stage deleted" })
    })
    .catch((error) => {
      const description= "Error al eliminar el estado. Asegúrate de que el estado no tiene contactos asociados. Debes mover los contactos a otro estado."
      toast({title: "Error", description, variant: "destructive"})
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

