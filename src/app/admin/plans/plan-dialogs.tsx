"use client"

import { useEffect, useState } from "react";
import { ArrowLeftRight, ChevronsLeft, ChevronsRight, Loader, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast";
import { PlanForm, DeletePlanForm } from "./plan-forms"
import { getPlanDAOAction } from "./plan-actions"

import { getComplentarySubscriptionsAction, setSubscriptionsAction } from "./plan-actions"
import { SubscriptionDAO } from "@/services/subscription-services"  
  
type Props= {
  id?: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Create Plan</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function PlanDialog({ id }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Update' : 'Create'} Plan
          </DialogTitle>
        </DialogHeader>
        <PlanForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeletePlanDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Plan</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeletePlanForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

interface CollectionProps{
  id: string
  title: string
}

    
export function SubscriptionsDialog({ id, title }: CollectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ArrowLeftRight className="hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <PlanSubscriptionsBox closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  );
}      




interface SubscriptionsBoxProps{
  id: string
  closeDialog: () => void
}

export function PlanSubscriptionsBox({ id, closeDialog }: SubscriptionsBoxProps) {

  const [loading, setLoading] = useState(false)
  const [subscriptions, setSubscriptions] = useState<SubscriptionDAO[]>([])
  const [complementary, setComplementary] = useState<SubscriptionDAO[]>([])

  useEffect(() => {
      getPlanDAOAction(id)
      .then((data) => {
          if(!data) return null
          if (!data.subscriptions) return null
          console.log(data.subscriptions)            
          setSubscriptions(data.subscriptions)
      })
      getComplentarySubscriptionsAction(id)
      .then((data) => {
          if(!data) return null
          setComplementary(data)
      })
  }, [id])

  function complementaryIn(id: string) {
      const comp= complementary.find((c) => c.id === id)
      if(!comp) return
      const newComplementary= complementary.filter((c) => c.id !== id)
      setComplementary(newComplementary)
      setSubscriptions([...subscriptions, comp])
  }

  function complementaryOut(id: string) {            
      const comp= subscriptions.find((c) => c.id === id)
      if(!comp) return
      const newComplementary= subscriptions.filter((c) => c.id !== id)
      setSubscriptions(newComplementary)
      setComplementary([...complementary, comp])
  }

  function allIn() {
      setSubscriptions([...subscriptions, ...complementary])
      setComplementary([])
  }

  function allOut() {
      setComplementary([...complementary, ...subscriptions])
      setSubscriptions([])
  }

  async function handleSave() {
      setLoading(true)
      setSubscriptionsAction(id, subscriptions)
      .then(() => {
          toast({ title: "Subscriptions updated" })
          closeDialog()
      })
      .catch((error) => {
          toast({ title: "Error updating subscriptions" })
      })
      .finally(() => {
          setLoading(false)
      })
  }

  return (
      <div>
          <div className="grid grid-cols-2 gap-4 p-3 border rounded-md min-w-[400px] min-h-[300px]">
              <div className="flex flex-col border-r">
              {
                  subscriptions.map((item) => {
                  return (
                      <div key={item.id} className="flex items-center justify-between gap-2 mb-1 mr-5">
                          <p className="whitespace-nowrap">{item.planName}</p>
                          <Button variant="secondary" className="h-7" onClick={() => complementaryOut(item.id)}><ChevronsRight /></Button>
                      </div>
                  )})
              }
                      <div className="flex items-end justify-between flex-1 gap-2 mb-1 mr-5">
                          <p>Todos</p>
                          <Button variant="secondary" className="h-7" onClick={() => allOut()}><ChevronsRight /></Button>
                      </div>
              </div>
              <div className="flex flex-col">
              {
                  complementary.map((item) => {
                  return (
                      <div key={item.id} className="flex items-center gap-2 mb-1">
                          <Button variant="secondary" className="h-7 x-7" onClick={() => complementaryIn(item.id)}>
                              <ChevronsLeft />
                          </Button>
                          <p className="whitespace-nowrap">{item.planName}</p>
                      </div>
                  )})
              }
                  <div className="flex items-end flex-1 gap-2 mb-1">
                      <Button variant="secondary" className="h-7" onClick={() => allIn()}><ChevronsLeft /></Button>
                      <p>Todos</p>
                  </div>
              </div>
          </div>

          <div className="flex justify-end mt-4">
              <Button type="button" variant={"secondary"} className="w-32" onClick={() => closeDialog()}>Cancelar</Button>
              <Button onClick={handleSave} className="w-32 ml-2" >{loading ? <Loader className="animate-spin" /> : <p>Save</p>}</Button>
          </div>
      </div>
  )
} 
  
