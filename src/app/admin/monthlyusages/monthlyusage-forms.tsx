"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteMonthlyUsageAction, createOrUpdateMonthlyUsageAction, getMonthlyUsageDAOAction } from "./monthlyusage-actions"
import { monthlyUsageSchema, MonthlyUsageFormValues } from '@/services/monthlyusage-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"

type Props= {
  id?: string
  closeDialog: () => void
}

export function MonthlyUsageForm({ id, closeDialog }: Props) {
  const form = useForm<MonthlyUsageFormValues>({
    resolver: zodResolver(monthlyUsageSchema),
    defaultValues: {},
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: MonthlyUsageFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateMonthlyUsageAction(id ? id : null, data)
      toast({ title: id ? "MonthlyUsage updated" : "MonthlyUsage created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getMonthlyUsageDAOAction(id).then((data) => {
        if (data) {
          form.reset(data)
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id])

  return (
    <div className="p-4 bg-white rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <FormControl>
                  <Input placeholder="MonthlyUsage's month" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input placeholder="MonthlyUsage's year" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="storageCredits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>StorageCredits</FormLabel>
                <FormControl>
                  <Input placeholder="MonthlyUsage's storageCredits" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="publicationsCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PublicationsCount</FormLabel>
                <FormControl>
                  <Input placeholder="MonthlyUsage's publicationsCount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="imagesCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ImagesCount</FormLabel>
                <FormControl>
                  <Input placeholder="MonthlyUsage's imagesCount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="videosCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VideosCount</FormLabel>
                <FormControl>
                  <Input placeholder="MonthlyUsage's videosCount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="storageMB"
            render={({ field }) => (
              <FormItem>
                <FormLabel>StorageMB</FormLabel>
                <FormControl>
                  <Input placeholder="MonthlyUsage's storageMB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="llmCredits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LlmCredits</FormLabel>
                <FormControl>
                  <Input placeholder="MonthlyUsage's llmCredits" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="conversationsCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ConversationsCount</FormLabel>
                <FormControl>
                  <Input placeholder="MonthlyUsage's conversationsCount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="monthLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MonthLabel</FormLabel>
                <FormControl>
                  <Input placeholder="MonthlyUsage's monthLabel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="agencyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AgencyName</FormLabel>
                <FormControl>
                  <Input placeholder="MonthlyUsage's agencyName" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ClientName</FormLabel>
                <FormControl>
                  <Input placeholder="MonthlyUsage's clientName" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ClientId</FormLabel>
                <FormControl>
                  <Input placeholder="MonthlyUsage's clientId" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="agencyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AgencyId</FormLabel>
                <FormControl>
                  <Input placeholder="MonthlyUsage's agencyId" {...field} />
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

export function DeleteMonthlyUsageForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteMonthlyUsageAction(id)
    .then(() => {
      toast({title: "MonthlyUsage deleted" })
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

