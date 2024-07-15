"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { AgencyUsage } from "@/services/usagetype-services"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Loader } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function MonthSelector() {

    const [loading, setLoading] = useState(false)
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth())

    const [from, setFrom] = useState<Date | undefined>(new Date())
    const [to, setTo] = useState<Date | undefined>(new Date())

    const [monthLabel, setMonthLabel] = useState("")

    const searchParams = useSearchParams()
    const router= useRouter()

    const c= searchParams.get("c")
    let otherParams= ""
    if (c) {
        otherParams+= `&c=${c}`
    }

    useEffect(() => {
        const y= searchParams.get("y") ?? new Date().getFullYear().toString()
        const newYear= parseInt(y)
        setYear(newYear)

        const m= searchParams.get("m")
        let newMonth= new Date().getMonth()
        if (m) {
            newMonth= parseInt(m) - 1
        }        
        setMonth(newMonth)

        const monthDate= new Date(newYear, newMonth, 1)
        setMonthLabel(format(monthDate, "MMMM", { locale: es }))

        const lastDay = new Date(year, newMonth + 1, 0)
        setFrom(monthDate)
        setTo(lastDay)
        setLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    function upMonth() {
        setLoading(true)
        let newMonth= month + 1
        let newYear= year
        if (newMonth === 12) {
            newYear= year + 1
            newMonth= 0
        }
        router.push(`credits?m=${newMonth+1}&y=${newYear}${otherParams}`)
    }
    
    function downMonth() {
        setLoading(true)
        let newMonth= month
        let newYear= year
        if (newMonth === 0) {
            newYear= year - 1
            newMonth= 12
        }
        router.push(`credits?m=${newMonth}&y=${newYear}${otherParams}`)
    }
    
    return (
    <div className="flex items-baseline justify-between mb-1">
        <div className="text-sm">
            <p>{format(from ?? new Date(), "PP", { locale: es })} - {format(to ?? new Date(), "PP", { locale: es })}</p>
        </div>
        <div className="flex items-center gap-4">
            <Button size="icon" variant="outline" onClick={downMonth} disabled={loading}>
                <ChevronLeft className="w-5 h-5" />
                <span className="sr-only">Previous month</span>
            </Button>
            {
                loading ? <div className="w-20 flex justify-center"><Loader className="w-5 h-5 animate-spin" /></div> : <p className="w-20 text-center">{monthLabel}</p>
            }
            {/* disable the button if the month of to is the current month or later */}
            <Button size="icon" variant="outline" onClick={upMonth} disabled={to && to > new Date() || loading}>
                <ChevronRight className="w-5 h-5" />
                <span className="sr-only">Next month</span>
            </Button>
        </div>

    </div>
    )
}
