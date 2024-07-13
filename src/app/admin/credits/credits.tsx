"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { AgencyUsage } from "@/services/usagetype-services"
import { getUsageAction } from "./actions"
import CreditsBox from "./credits-box"
import { Separator } from "@/components/ui/separator"

export function CreditsComponent() {

    const [idSelected, setIdSelected] = useState("")

    const [loading, setLoading] = useState(false)

    const [from, setFrom] = useState<Date | undefined>(new Date())
    const [to, setTo] = useState<Date | undefined>(new Date())

    const [projects, setProjects] = useState<AgencyUsage[]>([])
    // const [price, setPrice] = useState(0)

    let storageTotal= 0
    let llmTotal= 0
  
    const [monthLabel, setMonthLabel] = useState("")
  
      useEffect(() => {
        const startMonth = format(from ?? new Date(), "MMMM", { locale: es })
        const endMonth = format(to ?? new Date(), "MMMM", { locale: es })
        const startYear = format(from ?? new Date(), "yyyy", { locale: es })
        const endYear = format(to ?? new Date(), "yyyy", { locale: es })
        if (startMonth === endMonth && startYear === endYear) {
          setMonthLabel(startMonth)
        } else {
          setMonthLabel("personalizado")
        }
      }, [from, to])

      useEffect(() => {
        const today = new Date()
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        setFrom(firstDay)
        setTo(lastDay)
        setIdSelected("")
        search(firstDay, lastDay)        
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      function upMonth() {
        const newDate = new Date(from ?? new Date())
        const firstDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 1)
        const lastDay = new Date(newDate.getFullYear(), newDate.getMonth() + 2, 0)
        setFrom(firstDay)
        setTo(lastDay)
        search(firstDay, lastDay)
      }
    
      function downMonth() {
        const newDate = new Date(from ?? new Date())
        const firstDay = new Date(newDate.getFullYear(), newDate.getMonth() - 1, 1)
        const lastDay = new Date(newDate.getFullYear(), newDate.getMonth(), 0)
        setFrom(firstDay)
        setTo(lastDay)
        search(firstDay, lastDay)
      }
    
      function search(from: Date, to: Date) {
        setLoading(true)
        if (!from || !to) {
          console.log("no dates")
          return
        }
        to.setHours(23)
        to.setMinutes(59)
        to.setSeconds(59)
        to.setMilliseconds(999)
        
        getUsageAction(from, to)
        .then((data) => {
            setProjects(data)
        })
        .catch((err) => {
          toast({ title: "Error al cargar los datos", description: `${err}`, variant: "destructive" })
        })
        .finally(() => {
          setLoading(false)
        })   
      }
    
    function handleSelectId(id: string) {
        if (idSelected === id) {
            setIdSelected("")
        } else {
            setIdSelected(id)
        }
    }

    let clientHours = 0

    return (
    <div className="flex flex-col items-center">
        <div className="text-sm">
            {
                loading ? <Loader className="w-5 h-5 animate-spin" /> :
                <p>{format(from ?? new Date(), "PP", { locale: es })} - {format(to ?? new Date(), "PP", { locale: es })}</p>
            }
        </div>
        <div className="flex items-center gap-4 mt-10">
            <Button size="icon" variant="outline" onClick={downMonth} disabled={loading}>
                <ChevronLeft className="w-5 h-5" />
                <span className="sr-only">Previous month</span>
            </Button>
            <p className="w-20 text-center">{monthLabel}</p>
            {/* disable the button if the month of to is the current month or later */}
            <Button size="icon" variant="outline" onClick={upMonth} disabled={to && to > new Date() || loading}>
                <ChevronRight className="w-5 h-5" />
                <span className="sr-only">Next month</span>
            </Button>
        </div>
        <div className="flex font-bold flex-row justify-between w-full pr-4 pt-4">
            <p></p>

            <div className="text-right flex items-center justify-end">
                <p className="w-28">Storage</p>
                <Separator orientation="vertical" className="h-4 mx-2" />
                <p className="w-28">LLM</p>
                <Separator orientation="vertical" className="h-4 mx-2" />
                <p className="w-28">Total</p>
            </div>
        </div>


        <Accordion type="single" collapsible className="w-full">
        {
            projects.map((project) => {
                storageTotal+= project.storageCredits
                llmTotal+= project.llmCredits
                return (
                    <AccordionItem value={project.agencyName} key={project.agencyId}>
                        <AccordionTrigger>
                            <div className="flex flex-row justify-between w-full">
                                <p>{project.agencyName}</p>
                                <CreditsBox storageCredits={project.storageCredits} llmCredits={project.llmCredits} />
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Accordion type="single" collapsible className="w-full mt-5 pl-10">
                                {
                                    project.clientUsages.map((deliverable) => {
                                        return (
                                            <AccordionItem value={deliverable.clientName} key={deliverable.clientId}
                                                className={cn(deliverable.clientId !== idSelected && "border-none", deliverable.clientId === idSelected && "bg-slate-50 pl-2 rounded-md border")}>
                                                <AccordionTrigger onClick={() => handleSelectId(deliverable.clientId)}>
                                                    <div className="flex flex-row justify-between w-full">
                                                        <p>{deliverable.clientName}</p>
                                                        <CreditsBox storageCredits={deliverable.storageCredits} llmCredits={deliverable.llmCredits} />
                                                    </div>
                                                </AccordionTrigger>
                                            </AccordionItem>
                                        )
                                    })
                                }
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                )
            })
        }
        </Accordion>
        <div className="flex font-bold flex-row justify-between w-full pr-4 pt-4">
            <p>Total</p>
            <CreditsBox storageCredits={storageTotal} llmCredits={llmTotal} />
        </div>
    </div>
    )
}
