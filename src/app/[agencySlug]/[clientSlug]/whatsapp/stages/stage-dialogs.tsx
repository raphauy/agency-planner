"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteStageForm, StageForm } from "./stage-forms";

type Props= {
  id?: string
  clientId?: string
}

const addTrigger= <Button className="whitespace-nowrap"><PlusCircle size={22} className="mr-2"/>Crear estado</Button>
const updateTrigger= (
  <div className="flex items-center gap-2 hover:bg-slate-100 h-9 rounded-sm hover:cursor-pointer px-2">
    <Pencil size={20} className="mr-2 mb-1"/>
    <p>Editar</p>
  </div>
)

export function StageDialog({ id, clientId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Crear'} estado
          </DialogTitle>
        </DialogHeader>
        <StageForm closeDialog={() => setOpen(false)} id={id} clientId={clientId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteStageDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DialogTrigger className="flex items-center gap-2 hover:bg-slate-100 hover:text-red-600 h-9 rounded-sm">
          <div className="flex items-center gap-2 hover:cursor-pointer px-2">
            <Trash2 size={20} className="text-red-400 mr-2 mb-1"/>
            <p>Eliminar estado</p>
          </div>
        </DialogTrigger>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar estado</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteStageForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

interface CollectionProps{
  id: string
  title: string
}




  
