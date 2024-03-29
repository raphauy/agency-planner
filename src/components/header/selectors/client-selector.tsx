"use client"

import { getClientSelectorsOfCurrentUserAction } from "@/app/[agencySlug]/clients/client-actions"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { SlashIcon } from "@radix-ui/react-icons"
import { Check, ChevronsRight, ChevronsUpDown } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { SelectorData } from "./selectors"


export default function ClientSelector() {

    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [name, setName] = useState("Admin")
    const [image, setImage] = useState("")
    const [selectors, setSelectors]= useState<SelectorData[]>([])
    const router= useRouter()
    const path= usePathname()
    const params= useParams()    
    const agencySlug= params.agencySlug as string    
    const clientSlug= params.clientSlug as string

    useEffect(() => {
      if (!agencySlug) return

      getClientSelectorsOfCurrentUserAction(agencySlug)
      .then((data) => {
        setName("")
        setImage("")
        setSelectors(data)
        const selectedItem= data.find(selector => selector.slug === clientSlug)
        if (selectedItem) {
          const image= selectedItem?.image
          const name= selectedItem?.name
          setName(name)
          image && setImage(image)
        }
      })
      .catch((error) => {
        console.error(error)
      })
    
  }, [agencySlug, clientSlug])

  const filteredValues = useMemo(() => {
      if (!searchValue) return selectors

      const lowerCaseSearchValue = searchValue.toLowerCase();
      return selectors.filter((item) => item.name.toLowerCase().includes(lowerCaseSearchValue))
  }, [selectors, searchValue])

  if (!clientSlug) return <div></div>

  return (
    <div className="px-1 flex items-center">
      <SlashIcon className="w-5 h-5 opacity-50" />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full text-gray-700 whitespace-nowrap bg-intraprop-color min-w-[230px]"
          >
            <div className="flex items-center gap-2">
              { image && <Image src={image} alt={name} width={20} height={20} className="rounded-full" />}
              <p>{name}</p>
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
                          let restOfPath = path.split("/").slice(3).join("/")
                          router.push(`/${agencySlug}/${item.slug}/${restOfPath}`)
                        }
                        setSearchValue("")
                        setOpen(false)
                        setName(item.name)
                        item.image && setImage(item.image)
                      }}
                      >
                      <Check className={cn("mr-2 h-4 w-4", name === item.name ? "opacity-100" : "opacity-0")}/>
                      <div className="flex items-center gap-2">
                      {item.image && <Image src={item.image} alt={item.name} width={20} height={20} className="rounded-full" />}
                      {item.name}
                      </div>
                      </CommandItem>
                  )})}

                  {filteredValues.length - 10 > 0 &&
                  <div className="flex items-center mt-5 font-bold">
                      <ChevronsRight className="w-5 h-5 ml-1 mr-2"/>
                      <p className="text-sm">Hay {filteredValues.length - 10} clientes más</p>
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
  
