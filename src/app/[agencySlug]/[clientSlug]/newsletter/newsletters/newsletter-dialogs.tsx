"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NewsletterForm, DeleteNewsletterForm, TestEmailForm } from "./newsletter-forms"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

type Props= {
  id?: string
  clientId: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Crear Newsletter</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function NewsletterDialog({ id, clientId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Crear'} Newsletter</DialogTitle>
          <DialogDescription>
            {id ? 'Actualizar Newsletter con los siguientes campos:' : 'Crear un nuevo Newsletter con los siguientes campos:'}
          </DialogDescription>
        </DialogHeader>
        <NewsletterForm closeDialog={() => setOpen(false)} id={id} clientId={clientId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteNewsletterDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Newsletter</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteNewsletterForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

type TestProps= {
  newsletterId: string
  emailFromConfigured: boolean
}

export function TestEmailDialog({ newsletterId, emailFromConfigured }: TestProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2">
          <Button className="whitespace-nowrap" disabled={!emailFromConfigured}>Email de Prueba</Button>
          {!emailFromConfigured && <p className="text-sm text-muted-foreground">* El From Email del newsletter debe estar configurado</p>}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Email de Prueba</DialogTitle>
        </DialogHeader>
        <TestEmailForm closeDialog={() => setOpen(false)} newsletterId={newsletterId} emailFromConfigured={emailFromConfigured} />
      </DialogContent>
    </Dialog>
  )
}