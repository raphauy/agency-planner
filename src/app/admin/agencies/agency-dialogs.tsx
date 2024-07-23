"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, PlusCircle, Trash2, User } from "lucide-react";
import { useState } from "react";
import { AgencyForm, DeleteAgencyForm } from "./agency-forms";
import { IgAgencyForm } from "./ig-handle-form";
import UserSelector, { UserSelectorData } from "./user-selector";

type Props= {
  id?: string
  igForm?: boolean
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Create Agency</Button>
const addTriggerIg= <Button><PlusCircle size={22} className="mr-2"/>Create with IG handle</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function AgencyDialog({ id, igForm }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : igForm ? addTriggerIg : addTrigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Update' : 'Create'} Agency</DialogTitle>
        </DialogHeader>
        {
          igForm ? <IgAgencyForm id={id} closeDialog={() => setOpen(false)} /> : <AgencyForm id={id} closeDialog={() => setOpen(false)} />
        }
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteAgencyDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Agency</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteAgencyForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

type UserSelectorProps= {
  agencyId: string
}

export function UserSelectorDialog({ agencyId }: UserSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <User />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-96 flex flex-col">
        <DialogHeader>
          <DialogTitle>Select the Owner</DialogTitle>
          <DialogDescription className="py-3">Select the owner of the agency</DialogDescription>
        </DialogHeader>
        <UserSelector agencyId={agencyId} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
  
