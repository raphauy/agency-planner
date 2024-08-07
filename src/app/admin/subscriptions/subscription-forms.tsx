"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ShortSubscriptionFormValues, shortSubscriptionSchema } from '@/services/subscription-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { deleteSubscriptionAction, getSubscriptionDAOAction, updateShortSubscriptionAction } from "./subscription-actions"

type Props= {
  id: string
  closeDialog: () => void
}

export function SubscriptionForm({ id, closeDialog }: Props) {
  const form = useForm<ShortSubscriptionFormValues>({
    resolver: zodResolver(shortSubscriptionSchema),
    defaultValues: {
      stripePeriodEnd: new Date(),
      stripePaymentMethod: "",
      planPrice: "0",
      maxClients: "0",
      maxCredits: "0",
      maxLLMCredits: "0",
      agencyId: "",
      planId: "",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const [openCalendar, setOpenCalendar] = useState(false)

  const onSubmit = async (data: ShortSubscriptionFormValues) => {
    setLoading(true)
    try {
      await updateShortSubscriptionAction(id, data)
      toast({ title: "Subscription created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getSubscriptionDAOAction(id).then((data) => {
        if (data) {
          form.setValue("stripePeriodEnd", data.stripePeriodEnd)
          form.setValue("stripePaymentMethod", data.stripePaymentMethod)
          form.setValue("planPrice", data.planPrice.toString())
          form.setValue("maxClients", data.maxClients.toString())
          form.setValue("maxCredits", data.maxCredits.toString())
          form.setValue("maxLLMCredits", data.maxLLMCredits.toString())
          form.setValue("agencyId", data.agencyId)
          form.setValue("planId", data.planId)
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
            name="stripePeriodEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mr-3">Fecha de finalización:</FormLabel>
                <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona la fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      onSelect={(date) => {
                        field.onChange(date);
                        setOpenCalendar(false)
                      }}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="stripePaymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PaymentMethod:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Método de pago</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="planPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PlanPrice:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Precio del plan</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maxClients"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MaxClients:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>MaxClients</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maxCredits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MaxCredits:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>MaxCredits</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maxLLMCredits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MaxLLMCredits:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>MaxLLMCredits</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
         
          
        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

type DeleteProps= {
  id?: string
  closeDialog: () => void
}


export function DeleteSubscriptionForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteSubscriptionAction(id)
    .then(() => {
      toast({title: "Subscription deleted" })
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

