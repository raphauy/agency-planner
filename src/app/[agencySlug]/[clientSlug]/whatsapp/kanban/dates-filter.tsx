"use client"

import { DatePicker } from "@/components/date-picker"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { endOfMonth, format, parse, startOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import { X } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type Props = {
  baseUrl: string
  allTags: string[]
}
export default function DatesFilter({ baseUrl, allTags }: Props) {
  const searchParams= useSearchParams()
  const router= useRouter()

  const [last, setLast] = useState(searchParams.get("last"))  
  const [selectedMonthLabel, setSelectedMonthLabel] = useState("")

  const allParams = searchParams.toString()
  const from= searchParams.get("from") ? parse(searchParams.get("from")!, 'yyyy-MM-dd', new Date()) : undefined
  const to= searchParams.get("to") ? parse(searchParams.get("to")!, 'yyyy-MM-dd', new Date()) : undefined
  // Remove all instances of from, to, and last params along with the leading ampersand if necessary
  let newParams= allParams.replace(/([&]?)(from|to|last)=[^&]+/g, "")
  newParams= newParams.startsWith("&") ? newParams.slice(1) : newParams
  const restOfTheParams= newParams ? `&${newParams}` : ""
    
  useEffect(() => {
    const lastParam= searchParams.get("last")
    setLast(lastParam)
    if (lastParam) {
      setSelectedMonthLabel("")
    }
  }, [searchParams])

  function handleSelection(monthLabel: string) {
    console.log("handleLastChange", monthLabel);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed (enero = 0, diciembre = 11)

    // Parsear el mes utilizando date-fns y la localización en español
    const parsedDate = parse(monthLabel, 'MMMM', new Date(), { locale: es });
    const parsedMonth = parsedDate.getMonth(); // 0-indexed

    // Ajustar el año si el mes seleccionado es posterior al mes actual (lo que implica que es del año anterior)
    const year = parsedMonth > currentMonth ? currentYear - 1 : currentYear;

    // Crear las fechas `from` y `to` para el inicio y final del mes
    const from = format(startOfMonth(new Date(year, parsedMonth)), 'yyyy-MM-dd');
    const to = format(endOfMonth(new Date(year, parsedMonth)), 'yyyy-MM-dd');

    setSelectedMonthLabel(monthLabel);

    router.push(`${baseUrl}?from=${from}&to=${to}${restOfTheParams}`);
  }

  function setFrom(date: Date | undefined) {
    if (!date) return
    setSelectedMonthLabel("")
    const from = format(date, 'yyyy-MM-dd')
    const posibleTo= searchParams.get("to")
    if (posibleTo) {
      router.push(`${baseUrl}?from=${from}&to=${posibleTo}${restOfTheParams}`)
    } else {
      router.push(`${baseUrl}?from=${from}${restOfTheParams}`)
    }
  }

  function setTo(date: Date | undefined) {
    if (!date) return
    setSelectedMonthLabel("")
    const to = format(date, 'yyyy-MM-dd')
    const posibleFrom= searchParams.get("from")
    if (posibleFrom) {
      router.push(`${baseUrl}?from=${posibleFrom}&to=${to}${restOfTheParams}`)
    } else {
      router.push(`${baseUrl}?to=${to}${restOfTheParams}`)
    }
  }

  return (
    <div className="flex h-16 items-center gap-4 bg-background w-full">
      <div className="flex items-center gap-4">
        <Link href={`${baseUrl}?last=HOY${restOfTheParams}`}>
          <Button variant={last === "HOY" ? "outline" : "ghost"} >Hoy</Button>
        </Link>
        <Link href={`${baseUrl}?last=7D${restOfTheParams}`}>
          <Button variant={last === "7D" ? "outline" : "ghost"} >7D</Button>
        </Link>
        <Link href={`${baseUrl}?last=30D${restOfTheParams}`}>
          <Button variant={last === "30D" ? "outline" : "ghost"} >30D</Button>
        </Link>
        <Link href={`${baseUrl}?last=ALL${restOfTheParams}`}>
          <Button variant={last === "ALL" ? "outline" : "ghost"} >Todo</Button>
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <Select onValueChange={handleSelection} value={selectedMonthLabel || ""}>
          <SelectTrigger className={cn(!selectedMonthLabel && "border-none", "focus:ring-0 focus:ring-offset-0")}>
            {selectedMonthLabel ? (
              <SelectValue>{selectedMonthLabel}</SelectValue>
            ) : (
              <span className="text-muted-foreground">Mes</span>
            )}
          </SelectTrigger>
          <SelectContent>
            {getLast12MonthsLabels().map((monthLabel) => (
              <SelectItem key={monthLabel} value={monthLabel}>{monthLabel}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePicker label="Desde" date={from} setDate={setFrom} />
        <DatePicker label="Hasta" date={to} setDate={setTo} />
        {from || to || last ? <Button variant="outline" onClick={() => router.push(baseUrl)}><X /></Button> : null}
      </div>
      <div className="ml-auto flex items-center flex-1">
        
      </div>
    </div>
  )
}

function getLast12MonthsLabels() {
  const months= []
  const now= new Date()
  for (let i= 0; i < 12; i++) {
    const month= new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(month.toLocaleString('es-ES', { month: 'long' }))
  }
  return months
}