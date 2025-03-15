"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteRepoDataForm } from "./repodata-forms";

type DeleteProps= {
  id: string
  description: string
}

export function DeleteRepoDataDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete RepoData</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteRepoDataForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

interface CollectionProps{
  id: string
  title: string
}




  
