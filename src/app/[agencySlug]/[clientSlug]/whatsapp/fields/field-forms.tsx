"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { FieldFormValues, repoFieldSchema } from '@/services/field-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldType } from ".prisma/client"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createOrUpdateFieldAction, deleteFieldAction, getFieldDAOAction } from "./field-actions"
import { ListGenerator } from "./list-generator"

type Props= {
  id?: string
  repoId?: string | null | undefined
  closeDialog: () => void
}

export function FieldForm({ id, repoId, closeDialog }: Props) {
  const form = useForm<FieldFormValues>({
    resolver: zodResolver(repoFieldSchema),
    defaultValues: async () => {
      if (id) {
        const data = await getFieldDAOAction(id)
        if (data) {
          return {
            repositoryId: data.repositoryId ?? undefined,
            name: data.name,
            type: data.type,
            description: data.description,
            required: data.required,
            etiquetar: data.etiquetar,
            listOptions: data.listOptions ? data.listOptions.map(item => String(item)) : []
          }
        }
      }
      return {
        name: "",
        type: "string",
        description: "",
        required: true,
        etiquetar: false,
        repositoryId: repoId ?? undefined,
        listOptions: []
      }
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const watchedType = form.watch("type")
  const watchedListOptions = form.watch("listOptions") || []
  console.log(watchedType)

  const onSubmit = async (data: FieldFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateFieldAction(id ? id : null, data)
      toast({ title: id ? "Campo actualizado" : "Campo creado" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getFieldDAOAction(id).then((data) => {
        if (data) {
          form.reset({
            repositoryId: data.repositoryId ?? undefined,
            name: data.name,
            type: data.type,
            description: data.description,
            required: data.required,
            etiquetar: data.etiquetar,
            listOptions: data.listOptions ? data.listOptions.map(item => String(item)) : []
          })
        }
      })
    }
  }, [form, id])

  function handleListOptionsChange(options: string[]) {
    form.setValue("listOptions", options || [])
  }

  return (
    <div className="rounded-md">
      <Form {...form}>
        <ScrollArea className="h-[800px] max-h-[80vh] pr-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
          
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="ej: nombre" {...field} disabled={field.value === "nombre"}/>
                  </FormControl>
                  <FormDescription>Sin espacios y sin tildes ni eñes, para más de una palabra se recomienda camelCase, ej: nombreCompleto</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          
        
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un Tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(FieldType).map((type) => (
                          <SelectItem key={type} value={type}>{getTypeLabel(type)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* add a field for the list options here */}
            {
              watchedType === "list" && 
                <ListGenerator options={watchedListOptions} onChange={handleListOptionsChange} />
            }
        
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="ej: Nombre completo del lead" {...field} />
                  </FormControl>
                  <FormDescription>Esta descripción es clave para que el LLM pueda entender qué tiene que preguntar al usuario</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          
        
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="mt-1">Obligatorio</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                  <FormDescription>Si está marcado, el LLM debería insistir en que el usuario responda la información de este campo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="etiquetar"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="mt-1">Etiquetar</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                  <FormDescription>Si está marcado, cuando se ejecuta esta FC, se agregará una etiqueta con el valor de este campo</FormDescription>
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
        </ScrollArea>
      </Form>
    </div>     
  )
}

type DeleteProps= {
  id: string
  closeDialog: () => void
}

export function DeleteFieldForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteFieldAction(id)
    .then(() => {
      toast({title: "Field deleted" })
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

function getTypeLabel(type: FieldType) {
  switch (type) {
    case "string": return "Texto"
    case "number": return "Número"
    case "boolean": return "Booleando (SI/NO)"
    case "list": return "Lista"
    default: return type
  }
}