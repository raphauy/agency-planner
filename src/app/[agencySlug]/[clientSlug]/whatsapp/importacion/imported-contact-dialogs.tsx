"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteImportedContactForm, ImportedContactForm } from "./imported-contact-forms";

type Props= {
  clientId: string
  id?: string
}

const addTrigger= <Button className="w-52"><PlusCircle size={22} className="mr-2"/>Crear contacto manual</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function ImportedContactDialog({ clientId, id }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Crear'} contacto importado
          </DialogTitle>
        </DialogHeader>
        <ImportedContactForm clientId={clientId} closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteImportedContactProps= {
  id: string
  description: string
}

export function DeleteImportedContactDialog({ id, description }: DeleteImportedContactProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar contacto importado</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteImportedContactForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

