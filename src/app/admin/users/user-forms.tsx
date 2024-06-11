"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserFormValues, userSchema } from '@/services/user-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader, Send } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useRoles } from "./use-roles"
import { createOrUpdateUserAction, deleteUserAction, getUserDAOAction, inviteAgencyUserAction, inviteClientUserAction } from "./user-actions"
import { useSession } from "next-auth/react"

//export const roles: UserRole[] = Object.values(UserRole)

type Props= {
  id?: string
  agencyId?: string
  closeDialog: () => void
}

export function UserForm({ id, agencyId, closeDialog }: Props) {

  const roles= useRoles()
  const currentRole= useSession().data?.user.role

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true)
    try {
      data.agencyId = agencyId
      if (id) {
        await createOrUpdateUserAction(id, data)
      } else {
        if (data.role === "ADMIN") {
          await createOrUpdateUserAction(null, data)
        } else if (agencyId) {
          // Agency user
          await inviteAgencyUserAction(data, agencyId)
        } else {
          console.log("No ADMIN nor agencyId")          
        }

      }
      toast({ title: id ? "User updated" : "User created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getUserDAOAction(id).then((data) => {
        if (data) {
          form.reset(data)
          agencyId && form.setValue("agencyId", agencyId)
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id, agencyId])

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
                  <Input placeholder="Nombre del usuario" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {
            (form.getValues("role") !== "AGENCY_OWNER" || currentRole === "ADMIN") && (

              <>
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email del usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
    
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un Rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
            )

          }
      
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
  id?: string
  closeDialog: () => void
}

export function DeleteUserForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteUserAction(id)
    .then(() => {
      toast({ title: "User deleted" })
    })
    .catch((error) => {
      toast({ title: "Error", description: error.message, variant: "destructive"})
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

type InviteProps= {
  agencyId: string
  clientId: string
  closeDialog: () => void
}

export function InviteForm({ clientId, agencyId, closeDialog }: InviteProps) {

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
      role: "CLIENT_USER",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true)
    try {
      data.agencyId = agencyId
      await inviteClientUserAction(data, clientId)
      toast({ title: "Invitación enviada" })
      closeDialog()
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
                  <Input placeholder="Nombre del usuario" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email del usuario" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      
        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-40">Cancelar</Button>
            <Button type="submit" className="ml-2 w-40">
              {loading ? 
                <Loader className="h-4 w-4 animate-spin" /> 
                : 
                <div className="flex items-center gap-2">
                  <p>Enviar Invitación</p>
                  <Send className="h-4 w-4" />
                </div>
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}
