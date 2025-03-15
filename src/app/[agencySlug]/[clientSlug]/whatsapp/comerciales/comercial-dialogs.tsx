"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ComercialForm, DeleteComercialForm } from "./comercial-forms"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { ChatwootUserDAO } from "@/services/comercial-services"
import { UserDAO } from "@/services/user-services"

type Props= {
  id?: string
  clientId: string
  users: UserDAO[]
  chatwootUsers: ChatwootUserDAO[]
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Crear Comercial</Button>
const updateTrigger= <Pencil size={26} className="pr-2 hover:cursor-pointer text-muted-foreground"/>

export function ComercialDialog({ id, clientId, users, chatwootUsers }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Crear'} Comercial</DialogTitle>
          <DialogDescription>
            {id ? 'Actualiza el comercial:' : 'Debesa vincular un usuario en Shock IA con un usuario de Chatwoot:'}
          </DialogDescription>
        </DialogHeader>
        <ComercialForm closeDialog={() => setOpen(false)} id={id} clientId={clientId} users={users} chatwootUsers={chatwootUsers} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteComercialDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer text-red-500 hover:text-red-600 h-5 w-5"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Comercial</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteComercialForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}



