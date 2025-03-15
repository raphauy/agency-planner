"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteFieldForm, FieldForm } from "./field-forms";

type Props= {
  id?: string
  repoId?: string | null | undefined
}

const addTrigger= <Button variant="outline"><PlusCircle size={22} className="mr-2"/>Crear campo</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function FieldDialog({ id, repoId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Crear'} campo
          </DialogTitle>
          <DialogDescription>
            <span className="sr-only">
              {id ? "Actualiza el campo" : "Crea un nuevo campo"}
            </span>
          </DialogDescription>
        </DialogHeader>
        <FieldForm closeDialog={() => setOpen(false)} id={id} repoId={repoId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteFieldDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Field</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteFieldForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
