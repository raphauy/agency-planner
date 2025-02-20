"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DomainForm, DeleteDomainForm } from "./domain-forms"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react"

type Props= {
  id?: string
  clientId: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Create Domain</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function DomainDialog({ id, clientId }: Props) {
  const [open, setOpen] = useState(false);
  const session= useSession()
  const user= session?.data?.user
  const hide= user?.email !== "rapha.uy@rapha.uy"
  if (hide) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Update' : 'Create'} Domain</DialogTitle>
          <DialogDescription>
            {id ? 'Update the Domain with the following fields:' : 'Create a new Domain with the following fields:'}
          </DialogDescription>
        </DialogHeader>
        <DomainForm closeDialog={() => setOpen(false)} id={id} clientId={clientId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteDomainDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)
  const session= useSession()
  const user= session?.data?.user
  const hide= user?.email !== "rapha.uy@rapha.uy"

  if (hide) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Domain</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteDomainForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}



