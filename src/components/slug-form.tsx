"use client"

import { useAgencySlug } from "@/app/admin/users/use-roles"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader, Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Props= {
  id: string
  initialValue: string
  update: (id: string, newTitle: string) => Promise<string>
}

export function SlugForm({ id, initialValue, update }: Props) {

  const [isEditing, setIsEditing] = useState(false)
  const toggleEdit = () => setIsEditing(!isEditing)

  const [loading, setLoading] = useState(false)  
  const [slug, setSlug] = useState(initialValue)

  const router = useRouter()
  const agencySlug= useAgencySlug()

  async function onSubmit() {
    if (slug === initialValue) {
      toggleEdit()
      return
    }
    setLoading(true)
    toggleEdit()
    const message= await update(id, slug)
    
    if (message === "OK") {
      toast({title: "Slug editado" })
      router.push(`/${agencySlug}/${slug}/settings`)
    } else {      
      toast({title: message, variant: "destructive"})
      setSlug(initialValue)
    }

    setLoading(false)
  }

  function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      onSubmit()
    }
  }


  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-black">
      <div className="font-medium flex flex-col">
        Slug:
        {
          isEditing ? (

            <div className="flex items-center justify-between gap-1 font-medium">
              <input
                name="title"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                autoFocus
                disabled={!isEditing}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                onKeyDown={handleEnterKey}
                onBlur={onSubmit}
              />
            </div>

          ) : 
          loading ? (
            <div className="h-10">
              <Loader className="animate-spin" />
            </div>
          ) : (
            <Button 
              onClick={toggleEdit} 
              variant="ghost" 
              type="button" 
              className="text-xl p-0 flex justify-between gap-4">
              <><p>{initialValue}</p> <Pencil className="w-5 h-5 mb-1" /></>                      
            </Button>
          )
        }
    </div>
    </div>
  )
}