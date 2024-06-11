"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserRole } from "@prisma/client";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { DeleteUserForm, InviteForm, UserForm } from "./user-forms";

type Props= {
  id?: string
  agencyId?: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Invitar a un colaborador de la agencia</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function UserDialog({ id, agencyId }: Props) {
  const [open, setOpen] = useState(false);

  const role= useSession().data?.user.role
  if (role !== UserRole.ADMIN && role !== UserRole.AGENCY_OWNER && role !== UserRole.AGENCY_ADMIN) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Invitar'} Usuario
          </DialogTitle>
        </DialogHeader>
        <UserForm closeDialog={() => setOpen(false)} id={id} agencyId={agencyId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteUserDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  const role= useSession().data?.user.role
  if (role !== UserRole.ADMIN && role !== UserRole.AGENCY_OWNER && role !== UserRole.AGENCY_ADMIN) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Usuario</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteUserForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

type InviteProps= {
  agencyId: string
  clientId: string
}
export function InviteDialog({ clientId, agencyId }: InviteProps) {
  const [open, setOpen] = useState(false);

  const role= useSession().data?.user.role
  if (role === UserRole.GUEST) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button><PlusCircle size={22} className="mr-2"/>Invitar a alguien al equipo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitar Usuario</DialogTitle>
        </DialogHeader>
        <InviteForm closeDialog={() => setOpen(false)} clientId={clientId} agencyId={agencyId} />
      </DialogContent>
    </Dialog>
  )
}




  
