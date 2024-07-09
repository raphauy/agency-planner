"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, PlusCircle, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { TitleForm, DeleteConversationForm } from "./conversation-forms";

  
type Props= {
  id: string
  title: string
}

export function TitleDialog({ id, title }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Settings className="hover:cursor-pointer h-5 w-5"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar título del chat</DialogTitle>
        </DialogHeader>
        <TitleForm closeDialog={() => setOpen(false)} id={id} title={title} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteConversationDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Conversation</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteConversationForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

interface CollectionProps{
  id: string
  title: string
}

    
