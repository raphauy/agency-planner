"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deletePlanAction, createOrUpdatePlanAction, getPlanDAOAction } from "./plan-actions"
import { planSchema, PlanFormValues } from '@/services/plan-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

type Props= {
  id?: string
  closeDialog: () => void
}

export function PlanForm({ id, closeDialog }: Props) {
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      currency: "",
      features: "",
      priceId: "",
      maxClients: "",
      maxCredits: "",
      maxLLMCredits: "",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: PlanFormValues) => {
    setLoading(true)
    try {
      await createOrUpdatePlanAction(id ? id : null, data)
      toast({ title: id ? "Plan updated" : "Plan created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getPlanDAOAction(id).then((data) => {
        if (data) {
          form.setValue("name", data.name)
          form.setValue("description", data.description)
          form.setValue("price", data.price.toString())
          form.setValue("currency", data.currency)
          form.setValue("features", data.features)
          form.setValue("priceId", data.priceId)
          form.setValue("maxClients", data.maxClients.toString())
          form.setValue("maxCredits", data.maxCredits.toString())
          form.setValue("maxLLMCredits", data.maxLLMCredits.toString())
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Plan's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Plan's description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <FormControl>
                  <Textarea placeholder="Plan's features" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PriceId</FormLabel>
                <FormControl>
                  <Input placeholder="Stripe Plan's priceId" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Plan's price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <Input placeholder="Plan's currency" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="maxClients"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MaxClients</FormLabel>
                <FormControl>
                  <Input placeholder="Plan's maxClients" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="maxCredits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MaxCredits</FormLabel>
                <FormControl>
                  <Input placeholder="Plan's maxCredits" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="maxLLMCredits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MaxLLMCredits</FormLabel>
                <FormControl>
                  <Input placeholder="Plan's maxLLMCredits" {...field} />
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

export function DeletePlanForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deletePlanAction(id)
    .then(() => {
      toast({title: "Plan deleted" })
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

