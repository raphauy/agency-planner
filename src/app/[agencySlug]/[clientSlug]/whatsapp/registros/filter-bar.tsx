"use client"

import { format } from "date-fns"
 
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { toZonedTime } from "date-fns-tz"
import { es } from "date-fns/locale"
import { CalendarArrowDown, CalendarArrowUp, Download, Loader, Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { RepoSelector, RepoSelectorData } from "./repo-selector"
import { toast } from "@/components/ui/use-toast"

interface Props{
    agencySlug: string
    clientSlug: string
    timeZone: string
    repoNames: string[]
}

export default function FilterBar({ agencySlug, clientSlug, timeZone, repoNames }: Props) {
    const [loading, setLoading] = useState(true)
    const [exporting, setExporting] = useState(false)
    const [start, setStart] = useState<Date>()
    const [startMonth, setStartMonth] = useState<Date>()
    const [end, setEnd] = useState<Date>()
    const [endMonth, setEndMonth] = useState<Date>()
    const [repoName, setRepoName] = useState<string>()
    const searchParams= useSearchParams()

    const router= useRouter()

    useEffect(() => {
        setLoading(true)

        const startParam= searchParams.get("start")
        if(startParam) {
            setStart(toZonedTime(startParam, timeZone))
            setStartMonth(toZonedTime(startParam, timeZone))
        } else {
            setStart(undefined)
            setStartMonth(undefined)
        }
        const endParam= searchParams.get("end")
        if(endParam) {
            setEnd(toZonedTime(endParam, timeZone))
            setEndMonth(toZonedTime(endParam, timeZone))
        } else {
            setEnd(undefined)
            setEndMonth(undefined)
        }
        const repoNameParam= searchParams.get("repoName")
        if(repoNameParam) {
            setRepoName(repoNameParam)
        } else {
            setRepoName(undefined)
        }

        setLoading(false)
    
    }, [searchParams, timeZone])
    

  
  async function handleReset() {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setStart(undefined)
    setEnd(undefined)
    setRepoName(undefined)
    router.push(`/${agencySlug}/${clientSlug}/whatsapp/registros`)
    setLoading(false)
  }

  async function handleSearch() {
    setLoading(true)
    // sleep 1 second
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(start, end)
    
    let queryParams = ""
    if (start) {
      queryParams = `?start=${format(start, "yyyy-MM-dd")}`
      if (end) {
        queryParams += `&end=${format(end, "yyyy-MM-dd")}`
      }
    } else if (end) {
      queryParams = `?end=${format(end, "yyyy-MM-dd")}`
    }

    if (queryParams) {
        if (repoName) {
            queryParams += `&repoName=${repoName}`
        }
    } else {
        if (repoName) {
            queryParams = `?repoName=${repoName}`
        }
    }
    
    router.push(`/${agencySlug}/${clientSlug}/whatsapp/registros${queryParams}`)
    setLoading(false)
  }

  function handleRepoSelect(name: string) {
    setRepoName(name)
  }

  async function handleExport() {
    setExporting(true)
    let queryParams = new URLSearchParams()
    queryParams.append("agencySlug", agencySlug)
    queryParams.append("clientSlug", clientSlug)
    if (repoName) {
        queryParams.append("repoName", repoName)
    } else {
        toast({
            title: "Error",
            description: "Debe seleccionar un repositorio",
            variant: "destructive",
        })
        setExporting(false)
        return
    }
    if (start) {
        queryParams.append("start", format(start, "yyyy-MM-dd"))
    }
    if (end) {
        queryParams.append("end", format(end, "yyyy-MM-dd"))
    }

    const url = `/api/export?${queryParams.toString()}`
    console.log("URL de exportación:", url)
    
    try {
        const response = await fetch(url)
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Error en la exportación')
        }

        // Obtener el blob de la respuesta
        const blob = await response.blob()
        
        // Crear URL del blob
        const downloadUrl = window.URL.createObjectURL(blob)
        
        // Crear un elemento <a> temporal
        const link = document.createElement('a')
        link.href = downloadUrl
        
        // Obtener el nombre del archivo del header Content-Disposition
        const contentDisposition = response.headers.get('Content-Disposition')
        const fileName = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') 
            || `${repoName}_${format(new Date(), 'yyyy-MM-dd-HH-mm')}.xlsx`
        
        link.setAttribute('download', fileName)
        
        // Agregar el link al documento, hacer click y removerlo
        document.body.appendChild(link)
        link.click()
        link.remove()

        // Limpiar la URL del blob
        window.URL.revokeObjectURL(downloadUrl)

        toast({
            title: "Éxito",
            description: "Archivo exportado correctamente",
        })
        setExporting(false)
    } catch (error) {
        toast({
            title: "Error",
            description: "Error al exportar",
            variant: "destructive",
        })
        console.error("Error al exportar:", error)
        setExporting(false)
    }
  }

  return (
    <div className="w-full mt-1">
        <div className="items-center justify-between mb-2 md:flex text-muted-foreground dark:text-white">
            <div className="flex items-center gap-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-48 justify-start text-left font-normal h-8",
                            !start && "text-muted-foreground"
                        )}
                        >
                        <CalendarArrowUp className="w-4 h-4 mr-2" />
                        {start ? format(start, "MMMM dd, yyyy", { locale: es}) : <span>Desde</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={start}
                        onSelect={setStart}
                        month={startMonth}
                        onMonthChange={setStartMonth}
                        initialFocus
                        locale={es}                        
                        />
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-48 justify-start text-left font-normal h-8",
                            !end && "text-muted-foreground"
                        )}
                        >
                        <CalendarArrowDown className="w-4 h-4 mr-2" />
                        {end ? format(end, "MMMM dd, yyyy", { locale: es }) : <span>Hasta</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={end}
                        onSelect={setEnd}
                        month={endMonth}
                        onMonthChange={setEndMonth}
                        initialFocus
                        locale={es}
                        />
                    </PopoverContent>
                </Popover>
                <div className="w-64">
                    <RepoSelector repoNames={repoNames} onSelect={handleRepoSelect} />
                </div>
                <Button className="h-8 gap-2 w-28 px-1" onClick={handleSearch} disabled={loading || (!start && !end && !repoName)}>
                    {loading ? <Loader className="w-4 h-4 animate-spin"/> : <Search className="w-4 h-4"/>}
                    Consultar
                </Button>

                <Button disabled={loading || !repoName} className="h-8 gap-2 w-28" onClick={handleExport}>                    
                    { exporting ? <Loader className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4" />}
                    Exportar
                </Button>

                {(!!start || !!end || !!repoName) &&
                    <Button variant="ghost" className="h-8 px-2 lg:px-3" onClick={handleReset}>                        
                        <X className="w-4 h-4 ml-2" />
                    </Button>
                }
            </div>
        </div>
    </div>
  )
}
