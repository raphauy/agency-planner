"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { checkValidPhone } from "@/lib/utils"
import { ChatwootUserDAO, ComercialFormValues, ComercialSchema } from '@/services/comercial-services'
import { UserDAO } from "@/services/user-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createOrUpdateComercialAction, deleteComercialAction, getComercialDAOAction } from "./comercial-actions"




type Props = {
  id?: string
  clientId?: string
  users: UserDAO[]
  chatwootUsers: ChatwootUserDAO[]
  closeDialog: () => void
}

export function ComercialForm({ id, clientId, users, chatwootUsers, closeDialog }: Props) {
  const form = useForm<ComercialFormValues>({
    resolver: zodResolver(ComercialSchema),
    defaultValues: {
      activo: true,
      notifyAssigned: true,
      phone: "",
      clientId: clientId
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)


  const onSubmit = async (data: ComercialFormValues) => {
    if (data.notifyAssigned && !data.phone) {
      toast({ title: "Error", description: "Si Notificar asignación está activado, debe ingresar un teléfono", variant: "destructive" })
      return
    }
    const validPhone= checkValidPhone(data.phone || "")
    if (data.notifyAssigned && !validPhone) {
      toast({ title: "Error", description: "El teléfono no es válido, debe estar en formato internacional (ej: +59899123456)", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      await createOrUpdateComercialAction(id ? id : null, data)
      toast({ title: id ? "Comercial actualizado" : "Comercial creado" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getComercialDAOAction(id).then((data) => {
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

          {!id && (
          <>
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un usuario" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          No hay usuarios disponibles
                        </SelectItem>
                      ) : (
                        users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
                )}
              />
          

            <FormField
              control={form.control}
              name="chatwootUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario Chatwoot</FormLabel>
                  <Select 
                    value={field.value?.toString() || undefined}
                    onValueChange={(value) => field.onChange(value === "" ? null : parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un usuario de Chatwoot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {chatwootUsers.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          No hay usuarios de Chatwoot disponibles
                        </SelectItem>
                      ) : (
                        chatwootUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="notifyAssigned"
            render={({ field }) => (
              <FormItem className="flex flex-col pt-4">
                <FormLabel>Notificar asignación</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                <Input placeholder="Teléfono a notificar una asignación" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="activo"
            render={({ field }) => (
              <FormItem className="flex flex-col pt-4">
                <FormLabel>Activo</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
                <FormLabel className="text-xs text-muted-foreground mt-2">Indica si el comercial está activo</FormLabel>
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
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

export function DeleteComercialForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteComercialAction(id)
    .then(() => {
      toast({title: "Comercial eliminado" })
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
