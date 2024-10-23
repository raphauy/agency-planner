"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Minimize2, Trash2 } from "lucide-react";
import { useState } from "react";
import { CloseConversationForm, DeleteConversationForm } from "./delete-form";
import { Button } from "@/components/ui/button";

 
type DeleteProps= {
  id: string
  description: string
  redirectUri: string
  notifyDelete?: () => void
}

export function DeleteConversationDialog({ id, description, redirectUri, notifyDelete }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="w-5 h-5 hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar conversación</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteConversationForm closeDialog={() => setOpen(false)} id={id} redirectUri={redirectUri} />
      </DialogContent>
    </Dialog>
  )
}

type CloseProps= {
  id: string
  description: string
  redirectUri: string
}

export function CloseConversationDialog({ id, description, redirectUri }: CloseProps) {
  const [open, setOpen] = useState(false)
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" disabled={id === "new"}>
          <Minimize2 className="hover:cursor-pointer"/>
        </Button>
        
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cerrar conversación</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <CloseConversationForm closeDialog={() => setOpen(false)} id={id} redirectUri={redirectUri} />
      </DialogContent>
    </Dialog>
  )
}