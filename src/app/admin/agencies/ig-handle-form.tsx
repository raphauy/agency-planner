"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { z } from "zod"
import { createAgencyWithIgHandleAction, deleteAgencyAction, getAgencyDAOAction } from "./agency-actions"


export const igHandleSchema = z.object({
	igHandle: z.string({required_error: "igHandle is required."}),
})
export type IgHandleFormValues = z.infer<typeof igHandleSchema>

type Props= {
  id?: string
  closeDialog: () => void
}

export function IgAgencyForm({ id, closeDialog }: Props) {
  const form = useForm<IgHandleFormValues>({
    resolver: zodResolver(igHandleSchema),
    defaultValues: {
        igHandle: "",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: IgHandleFormValues) => {

    setLoading(true)
    try {
      await createAgencyWithIgHandleAction(data.igHandle)
      toast({ title: id ? "Agency updated" : "Agency created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
        getAgencyDAOAction(id).then((data) => {
            if (data) {
                const formData = {...data};
                formData.igHandle = formData.igHandle || '';
                form.reset(formData);
            }
        })
    }
  }, [form, id])

  return (
    <div className="p-4 bg-white rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="igHandle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IgHandle</FormLabel>
                <FormControl>
                  <Input placeholder="Agency's igHandle" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      
          <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Save</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

