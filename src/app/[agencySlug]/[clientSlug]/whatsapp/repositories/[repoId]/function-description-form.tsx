"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { RepositoryDAO } from "@/services/repository-services"
import { AlertCircle, Loader, Pencil } from "lucide-react"
import { useEffect, useState } from "react"
import { setFunctionDescriptionAction } from "../repository-actions"
import { cn } from "@/lib/utils"

const MAX_CHARS = 1024

type Props= {
  repository: RepositoryDAO
}

export function FunctionDescriptionForm({ repository }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const toggleEdit = () => setIsEditing(!isEditing)

  const [loading, setLoading] = useState(false)
  const [repoId, setRepoId] = useState(repository.id)
  const [description, setDescription] = useState(repository.functionDescription)

  const isOverLimit = description.length > MAX_CHARS

  useEffect(() => {
    setDescription(repository.functionDescription)
    setRepoId(repository.id)
  }, [repository.functionDescription, repository.id])

  async function onSubmit() {
    if (description === repository.functionDescription) {
      toggleEdit()
      return
    }

    if (isOverLimit) {
      toast({
        title: "La descripción excede el límite de caracteres",
        description: `Por favor, reduce el texto a ${MAX_CHARS} caracteres o menos.`,
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    setFunctionDescriptionAction(repoId, description)
    .then(() => {
      toggleEdit()
      toast({title: `Descripción editada` })
    })
    .catch((error) => {
      toast({title: `Algo salió mal (${error.message})`, variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-black">
      <div className="font-medium flex flex-col">
        <div className="flex items-center justify-between border-b mb-2 pb-2">
          <p>Descripción de la función:</p>
          <Badge variant={isOverLimit ? "destructive" : "default"} className="h-6">
            {description.length}/{MAX_CHARS}
          </Badge>
        </div>

            {
              loading ? (
                <div className="h-10 flex items-center justify-center">
                  <Loader className="animate-spin" />
                </div>
              ) : 
              isEditing ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1 font-medium">
                    <textarea
                      rows={20}
                      cols={40}
                      name="description"
                      className={cn(
                        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        isOverLimit && "border-red-500 focus-visible:ring-red-500"
                      )}
                      autoFocus
                      disabled={!isEditing}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onBlur={onSubmit}
                    />
                  </div>
                  {isOverLimit && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>El texto excede el límite de {MAX_CHARS} caracteres</span>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  onClick={toggleEdit} 
                  variant="ghost" 
                  type="button" 
                  className="flex items-end gap-4 h-full text-start text-xl p-0">
                  <p className="whitespace-pre-line flex-1">{repository.functionDescription}</p> 
                  <div><Pencil className="w-5 h-5 mb-1" /></div>
                </Button>
              )
            }
      </div>
    </div>
  )
}