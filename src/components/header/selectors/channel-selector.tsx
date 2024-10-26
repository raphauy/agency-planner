"use client"

import { getChannelSelectorsOfCurrentClientAction } from "@/app/[agencySlug]/[clientSlug]/actions"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { SlashIcon } from "@radix-ui/react-icons"
import * as LucideIcons from "lucide-react"
import { Check, ChevronsRight, ChevronsUpDown, LucideIcon } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import React, { useEffect, useMemo, useState } from "react"
import { ChannelSelectorData } from "./selectors"

const alowedSlugs= ["team", "pilars", "publications", "comments", "settings", "copy-lab"]

export default function ChannelSelector() {

    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [name, setName] = useState("")
    const [icon, setIcon] = useState<LucideIcon>()
    const [selectors, setSelectors]= useState<ChannelSelectorData[]>([])
    const router= useRouter()
    const path= usePathname()
    const params= useParams()
    const agencySlug= params.agencySlug as string    
    const clientSlug= params.clientSlug as string

    const channelSlug= path.split("/")[3]

    useEffect(() => {
      setName("")
      if (!agencySlug) return

      if (!clientSlug) return

      getChannelSelectorsOfCurrentClientAction(agencySlug, clientSlug)
      .then((data) => {
        // if (path.endsWith(clientSlug))
        //   setName("Seleccionar canal")

        setIcon(undefined)
        setSelectors(data)
        
        const selectedItem= data.find(selector => selector.slug === channelSlug)
        if (selectedItem) {
          const icon= selectedItem?.icon
          const name= selectedItem?.name
          setName(name)
          // @ts-ignore
          setIcon(LucideIcons[icon])
        } else {
          if (!alowedSlugs.includes(channelSlug)) {
            router.push(`/${agencySlug}/${clientSlug}`)
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })
    
  }, [clientSlug, agencySlug, channelSlug, router, path])

    const filteredValues = useMemo(() => {
        if (!searchValue) return selectors

        const lowerCaseSearchValue = searchValue.toLowerCase();
        return selectors.filter((item) => item.name.toLowerCase().includes(lowerCaseSearchValue))
    }, [selectors, searchValue])
  
    if (!name) return <div></div>

    return (
      <div className="px-1 flex items-center">
        <SlashIcon className="w-5 h-5 opacity-50" />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="justify-between w-full whitespace-nowrap min-w-[230px]"
            >
              <div className="flex items-center gap-2">
                {icon && React.createElement(icon, {className: cn("w-5 h-5 mb-0.5", name === "Linkedin" && "mb-1.5")})}
                <p className="dark:text-white">{name}</p>
              </div>
              <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="min-w-[230px] p-0">
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {filteredValues.map((item, index) => {
                    if (index >= 10) return null
                    return (
                        <CommandItem
                        key={item.slug}
                        onSelect={(currentValue) => {
                          if (currentValue !== name) {
                            // path is /agencySlug/clientSlug/...
                            //let restOfPath = path.split("/").slice(4).join("/")
                            router.push(`/${agencySlug}/${clientSlug}/${item.slug}`)
                          }
                          setOpen(false)
                        }}
                        >
                        <Check className={cn("mr-2 h-4 w-4", name === item.name ? "opacity-100" : "opacity-0")}/>
                        <div className="flex items-center gap-2">

                        {
                          // @ts-ignore
                          item.icon && React.createElement(LucideIcons[item.icon], {className: "w-5 h-5 mb-1"})
                        }
                        {item.name}
                        </div>
                        </CommandItem>
                    )})}

                    {filteredValues.length - 10 > 0 &&
                    <div className="flex items-center mt-5 font-bold">
                        <ChevronsRight className="w-5 h-5 ml-1 mr-2"/>
                        <p className="text-sm">Hay {filteredValues.length - 10} funcionalidades más</p>
                    </div>
                    }

                </CommandGroup>
            </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

    )
  }
  
