"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

export type RepoSelectorData={
    repoName: string
}

type Props= {
    repoNames: string[]
    onSelect: (name: string) => void
}

// Función para truncar texto largo
const truncateText = (text: string, maxLength: number = 25) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export function RepoSelector({ repoNames, onSelect }: Props) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [searchValue, setSearchValue] = useState("")
    const searchParams= useSearchParams()

    useEffect(() => {

      const repoNameParam= searchParams.get("repoName")
      if (!repoNameParam) {
        setValue("")
        return
      }
      
      const repoName= repoNames.find(name => name === repoNameParam)
      repoName ? setValue(repoName) : setValue("")

    }, [repoNames, searchParams])
    
  
    const filteredValues = useMemo(() => {
      if (!searchValue) return repoNames
      const lowerCaseSearchValue = searchValue.toLowerCase();
      return repoNames.filter((line) => line.toLowerCase().includes(lowerCaseSearchValue))
    }, [repoNames, searchValue])
  
    const customFilter = (searchValue: string, itemValue: string) => {      
      return itemValue.toLowerCase().includes(searchValue.toLowerCase()) ? searchValue.toLowerCase().length : 0
    }      
      
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value)
    }
  
    return (
      <div className="px-1 w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="justify-between w-full whitespace-nowrap border h-8"
              title={value}
            >
              {value
                ? truncateText(value)
                : "Filtrar repositorio"}
              <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="p-0">
            <Command filter={customFilter} >
              <div className='flex items-center w-full gap-1 p-2 border border-gray-300 rounded-md shadow'>
                  <Search className="w-4 h-4 mx-1 opacity-50 shrink-0" />
                  <input placeholder="Buscar repositorio..." onInput={handleInputChange} value={searchValue} className="w-full bg-transparent focus:outline-none"/>
              </div>
              
              <CommandEmpty>Repositorio no encontrado</CommandEmpty>
              <CommandGroup>
                {filteredValues.map((repoName) => {
                  return (
                    <CommandItem
                      key={repoName}
                      onSelect={(currentValue) => {
                        if (currentValue === value) {
                          setValue("")
                        } else {
                          setValue(repoName)
                          onSelect(repoName)
                        }
                        setSearchValue("")
                        setOpen(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value.toLowerCase() === repoName.toLowerCase() ? "opacity-100" : "opacity-0")}/>
                      {repoName}
                    </CommandItem>
                )})}


              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

    )
  }
  
