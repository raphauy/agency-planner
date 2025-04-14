"use client"

import { useEffect, useState } from "react";
import { ArrowLeftRight, ChevronsLeft, ChevronsRight, Loader, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PilarForm, DeletePilarForm } from "./pilar-forms"
import { getPilarDAOAction } from "./pilar-actions"
import { useSession } from "next-auth/react";
import { UserRole } from ".prisma/client";
import { useMenuAdminRoles } from "@/app/admin/users/use-roles";

type Props= {
  id?: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Crear Pilar</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function PilarDialog({ id }: Props) {
  const [open, setOpen] = useState(false);

  const allowedRoles: UserRole[]= useMenuAdminRoles()
  const currentRole= useSession().data?.user.role
  if (currentRole && !allowedRoles.includes(currentRole)) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Crear'} Pilar
          </DialogTitle>
        </DialogHeader>
        <PilarForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeletePilarDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  const allowedRoles: UserRole[]= useMenuAdminRoles()
  const currentRole= useSession().data?.user.role
  if (currentRole && !allowedRoles.includes(currentRole)) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Elimar Pilar</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeletePilarForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
