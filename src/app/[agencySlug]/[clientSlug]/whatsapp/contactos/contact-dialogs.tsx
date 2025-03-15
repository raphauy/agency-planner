"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Expand, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { BulkDeleteContactForm, ContactForm, DeleteContactForm } from "./contact-forms";
import { ContactDAO } from "@/services/contact-services";
import { usePathname } from "next/navigation";

  
type Props= {
  id?: string
  clientId: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Crear contacto</Button>
const updateTrigger= <Pencil className="hover:cursor-pointer text-muted-foreground"/>

export function ContactDialog({ id, clientId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Crear'} contacto
          </DialogTitle>
        </DialogHeader>
        <ContactForm closeDialog={() => setOpen(false)} id={id} clientId={clientId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteContactDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)
  const pathname= usePathname()
  const isCampaignPage= pathname.includes("campaigns")

  if (isCampaignPage) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar contacto</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteContactForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

type DisplayProps= {
  contact: ContactDAO
}

export function DisplayContactDialog({ contact }: DisplayProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="size-8">
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-h-[80vh] min-w-[80vw]">
        <div>
          <DialogHeader>
            <DialogTitle>{contact.name}</DialogTitle>
            <DialogDescription>
              Aquí estará el detalle del contacto
            </DialogDescription>
          </DialogHeader>
          <div className="bg-green-100">
            <p>Provisorio para poder etiquetar:</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

type BulkDeleteProps= {
  ids: string[]
}

export function BulkDeleteContactDialog({ ids }: BulkDeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="h-4 w-4" />
          <p className="ml-2">{`Eliminar ${ids.length} contactos`}</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar contactos</DialogTitle>
          <DialogDescription>¿Estás seguro de que deseas eliminar estos contactos?</DialogDescription>
        </DialogHeader>
        <BulkDeleteContactForm ids={ids} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}