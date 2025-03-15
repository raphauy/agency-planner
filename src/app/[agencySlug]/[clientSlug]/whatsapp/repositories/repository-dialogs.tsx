"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteRepositoryForm, RepositoryForm } from "./repository-forms";

type Props= {
  clientId: string
  basePath: string
}

export function RepositoryDialog({ clientId, basePath }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="whitespace-nowrap">
          <PlusCircle size={22} className="mr-2"/>
          Crear Repositorio
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Repositorio</DialogTitle>
        </DialogHeader>
        <RepositoryForm closeDialog={() => setOpen(false)} clientId={clientId} basePath={basePath} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
  withText: boolean
}

export function DeleteRepositoryDialog({ id, description, withText }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      {
        withText ? 
        <Button variant="destructive">Eliminar Repositorio</Button>         
        :
        <Trash2 size={30} className="hover:cursor-pointer" />
      }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Repository</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteRepositoryForm closeDialog={() => setOpen(false)} id={id} redirect={withText} />
      </DialogContent>
    </Dialog>
  )
}

