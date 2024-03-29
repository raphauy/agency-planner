"use client"

import { useEffect, useState } from "react";
import { ArrowLeftRight, ChevronsLeft, ChevronsRight, Loader, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ClientForm, DeleteClientForm } from "./client-forms"
import { getClientDAOAction } from "./client-actions"

import { getComplentaryUsersAction, setUsersAction } from "./client-actions"
import { UserDAO } from "@/services/user-services"  
import { toast } from "@/components/ui/use-toast"
import { IgClientForm } from "./ig-handle-form";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { useAdminRoles } from "@/app/admin/users/use-roles";
  
type Props= {
  id?: string
  agencyId?: string
  igForm?: boolean
}


export function ClientDialog({ id, agencyId, igForm }: Props) {
  const [open, setOpen] = useState(false)
  const adminRoles= useAdminRoles()
  const currentRole= useSession().data?.user.role

  if (!currentRole || !adminRoles.includes(currentRole)) {
    return null
  }

  const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>{igForm ? "Crear cliente con Instagram" : "Crear Cliente"}</Button>
  const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Crear'} Cliente
          </DialogTitle>
        </DialogHeader>
        {igForm && agencyId ? <IgClientForm agencyId={agencyId} closeDialog={() => setOpen(false)} /> : <ClientForm closeDialog={() => setOpen(false)} id={id} />}
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteClientDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Cliente</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteClientForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

interface CollectionProps{
  id: string
  title: string
}

    
export function UsersDialog({ id, title }: CollectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ArrowLeftRight className="hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ClientUsersBox closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  );
}      




interface UsersBoxProps{
  id: string
  closeDialog: () => void
}

export function ClientUsersBox({ id, closeDialog }: UsersBoxProps) {

  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<UserDAO[]>([])
  const [complementary, setComplementary] = useState<UserDAO[]>([])

  useEffect(() => {
      getClientDAOAction(id)
      .then((data) => {
          if(!data) return null
          if (!data.users) return null
          console.log(data.users)            
          setUsers(data.users)
      })
      getComplentaryUsersAction(id)
      .then((data) => {
          if(!data) return null
          setComplementary(data)
      })
  }, [id])

  function complementaryIn(id: string) {
      const comp= complementary.find((c) => c.id === id)
      if(!comp) return
      const newComplementary= complementary.filter((c) => c.id !== id)
      setComplementary(newComplementary)
      setUsers([...users, comp])
  }

  function complementaryOut(id: string) {            
      const comp= users.find((c) => c.id === id)
      if(!comp) return
      const newComplementary= users.filter((c) => c.id !== id)
      setUsers(newComplementary)
      setComplementary([...complementary, comp])
  }

  function allIn() {
      setUsers([...users, ...complementary])
      setComplementary([])
  }

  function allOut() {
      setComplementary([...complementary, ...users])
      setUsers([])
  }

  async function handleSave() {
      setLoading(true)
      setUsersAction(id, users)
      .then(() => {
          toast( { title: "Users updated" })
          closeDialog()
      })
      .catch((error) => {
          toast({ title: "Error", description: error.message, variant: "destructive" })
      })
      .finally(() => {
          setLoading(false)
      })
  }

  return (
      <div>
          <div className="grid grid-cols-2 gap-4 p-3 border rounded-md min-w-[400px] min-h-[300px]">
              <div className="flex flex-col border-r">
              {
                  users.map((item) => {
                  return (
                      <div key={item.id} className="flex items-center justify-between gap-2 mb-1 mr-5">
                          <p className="whitespace-nowrap">{item.name}</p>
                          <Button variant="secondary" className="h-7" onClick={() => complementaryOut(item.id)}><ChevronsRight /></Button>
                      </div>
                  )})
              }
                      <div className="flex items-end justify-between flex-1 gap-2 mb-1 mr-5">
                          <p>Todos</p>
                          <Button variant="secondary" className="h-7" onClick={() => allOut()}><ChevronsRight /></Button>
                      </div>
              </div>
              <div className="flex flex-col">
              {
                  complementary.map((item) => {
                  return (
                      <div key={item.id} className="flex items-center gap-2 mb-1">
                          <Button variant="secondary" className="h-7 x-7" onClick={() => complementaryIn(item.id)}>
                              <ChevronsLeft />
                          </Button>
                          <p className="whitespace-nowrap">{item.name}</p>
                      </div>
                  )})
              }
                  <div className="flex items-end flex-1 gap-2 mb-1">
                      <Button variant="secondary" className="h-7" onClick={() => allIn()}><ChevronsLeft /></Button>
                      <p>Todos</p>
                  </div>
              </div>
          </div>

          <div className="flex justify-end mt-4">
              <Button type="button" variant={"secondary"} className="w-32" onClick={() => closeDialog()}>Cancelar</Button>
              <Button onClick={handleSave} className="w-32 ml-2" >{loading ? <Loader className="animate-spin" /> : <p>Save</p>}</Button>
          </div>
      </div>
  )
} 
  
