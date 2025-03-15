"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { RepositoryFormValues, RepositorySchema } from '@/services/repository-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { createRepositoryAction, deleteRepositoryAction } from "./repository-actions"

type Props= {
  clientId: string
  basePath: string
  closeDialog: () => void
}

export function RepositoryForm({ clientId, basePath, closeDialog }: Props) {
  const form = useForm<RepositoryFormValues>({
    resolver: zodResolver(RepositorySchema),
    defaultValues: {
      name: "",
      clientId: clientId,
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const router= useRouter()

  const onSubmit = async (data: RepositoryFormValues) => {
    setLoading(true)
    try {
      const created=await createRepositoryAction(data.name, clientId)
      if (!created) {
        toast({ title: "Error", description: "Error al crear el repositorio", variant: "destructive" })
        return
      }
      toast({ title: "Repositorio creado" })
      closeDialog()
      router.push(`${basePath}/repositories/${created.id}`)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Registrar Lead" {...field} />
                </FormControl>
                <FormDescription>
                  El nombre del repositorio, lo podrás cambiar después
                </FormDescription>
                <FormMessage />
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

type DeleteProps= {
  id: string
  closeDialog: () => void
  redirect: boolean
}
export function DeleteRepositoryForm({ id, closeDialog, redirect }: DeleteProps) {
  const [loading, setLoading] = useState(false)
  const router= useRouter()
  const params= useParams()
  const agencySlug= params.agencySlug as string
  const clientSlug= params.clientSlug as string

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteRepositoryAction(id)
    .then(() => {
      toast({title: "Repositorio eliminado" })
      if (redirect) {
        router.push(`/${agencySlug}/${clientSlug}/whatsapp/repositories`)
      } else{
        window.location.reload()
      }
      
    })
    .catch((error) => {
      toast({title: "Error", description: error.message, variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
      closeDialog()
    })
  }
  
  return (
    <div>
      <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Eliminar
      </Button>
    </div>
  )
}

