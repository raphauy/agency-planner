"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { CommentFormValues, commentSchema } from '@/services/comment-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createOrUpdateCommentAction, deleteCommentAction } from "./comment-actions"

type Props= {
  id?: string
  text?: string
  publicationId: string
  userId: string
  closeDialog?: () => void
}

export function CommentForm({ id, text, publicationId, userId, closeDialog }: Props) {

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      publicationId,
      userId,
      text: text || "",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const searchParams= useSearchParams()
  useEffect(() => {
    const post= searchParams.get("post")
    if (post) {
      form.setValue("publicationId", post)
    }
  }, [searchParams, form])
  

  const onSubmit = async (data: CommentFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateCommentAction(id ? id : null, data)
      toast({ title: "Comentario agregado" })
      form.setValue("text", "")
      closeDialog && closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: "Error al agregar el comentario", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Escribe un comentario" {...field} rows={3}/>
                  </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      

        <div className="flex justify-end w-full">
            <Button type="submit" className="w-full">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>{id ? "Editar comentario" : "Agregar comentario"}</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

type DeleteProps = {
  id: string
  closeDialog: () => void
}
export function DeleteCommentForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteCommentAction(id)
    .then(() => {
      toast({title: "Comment deleted" })
    })
    .catch((error) => {
      toast({title: "Error", description: error.message, variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
      closeDialog && closeDialog()
    })
  }
  
  return (
    <div>
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Delete  
      </Button>
    </div>
  )
}

