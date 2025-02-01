"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { AudienceDAO } from "@/services/audience-services"
import { SlashIcon } from "@radix-ui/react-icons"
import { Check, ChevronsRight, ChevronsUpDown } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

type Props= {
  audienceId: string
  audiences: AudienceDAO[]
  agencySlug: string
  clientSlug: string
  selectedAudienceName: string
}
export default function AudienceSelector({ audienceId, audiences, agencySlug, clientSlug, selectedAudienceName }: Props) {

    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [name, setName] = useState(selectedAudienceName)
    const [selectors, setSelectors]= useState<AudienceDAO[]>(audiences)
    const router= useRouter()

    useEffect(() => {
      setName(selectedAudienceName)
    }, [selectedAudienceName])

    const filteredValues = useMemo(() => {
        if (!searchValue) return selectors

        const lowerCaseSearchValue = searchValue.toLowerCase();
        return selectors.filter((item) => item.name.toLowerCase().includes(lowerCaseSearchValue))
    }, [selectors, searchValue])
  
    if (!name) return <div>Naranja</div>

    return (
      <div className="px-1 flex items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="justify-between w-full whitespace-nowrap min-w-[230px]"
            >
              <div className="flex items-center gap-2">
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
                        key={item.id}
                        onSelect={(currentValue) => {
                          if (currentValue !== name) {
                            // path is /agencySlug/clientSlug/...
                            //let restOfPath = path.split("/").slice(4).join("/")
                            router.push(`/${agencySlug}/${clientSlug}/newsletter/audiences/${item.id}`)
                          }
                          setOpen(false)
                        }}
                        >
                        <Check className={cn("mr-2 h-4 w-4", name === item.name ? "opacity-100" : "opacity-0")}/>
                        <div className="flex items-center gap-2">
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
  
