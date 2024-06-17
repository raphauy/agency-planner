"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { SlashIcon } from "@radix-ui/react-icons"
import { Check, ChevronsRight, ChevronsUpDown, LayoutDashboard } from "lucide-react"
import { getSession, useSession } from "next-auth/react"
import Image from "next/image"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { SelectorData } from "./selectors"
import Link from "next/link"


type Props= {
    selectors: SelectorData[]
}

export default function AgencySelector({ selectors= [] }: Props) {
  const user= useSession()?.data?.user

  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [name, setName] = useState("Admin")
  const [image, setImage] = useState("")
  const router= useRouter()
  const params= useParams()    
  const agencySlug= params.agencySlug as string    

  useEffect(() => {
    if (agencySlug) {
      const item= selectors.find(selector => selector.slug === agencySlug)
      if (item) {
          const name= item?.name
          setName(name)
          const image= item?.image
          image && setImage(image)
      }
    } else {
      setName("Admin")
      setImage("")
    }
  }, [agencySlug, selectors])

  const filteredValues = useMemo(() => {
    if (!searchValue) return selectors

    const lowerCaseSearchValue = searchValue.toLowerCase();
    return selectors.filter((line) => line.name.toLowerCase().includes(lowerCaseSearchValue))
  }, [selectors, searchValue])

  if (!user) {
    return <div></div>
  }

  if (user && (user.role.startsWith("AGENCY") || user.role.startsWith("CLIENT"))) {

    const agency= selectors.find(selector => selector.slug === user.agencySlug)

    return (
      <div className="ml-2 flex items-center">
        <SlashIcon className="w-5 h-5 opacity-50" />
        <Link href={`/${agencySlug}`}>
          <div className="flex gap-2 px-2 items-center">
            { agency?.image && <Image src={agency?.image} alt={name} width={50} height={50} className="rounded-full w-7 h-7" />}
            <p className="text-base">{agency?.name}</p>
          </div>
        </Link>
      </div>
    )
  }
    
  if (user?.role !== "ADMIN") return null


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
              { image && <Image src={image} alt={name} width={20} height={20} className="rounded-full" />}
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
                        router.push(`/${item.slug}`)
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

                  <Separator className="my-2" />

                  <CommandItem className="mb-2 font-bold cursor-pointer dark:text-white"
                      onSelect={(currentValue) => {
                      router.push("/admin")
                      setSearchValue("")
                      setOpen(false)
                      }}
                  >
                      <LayoutDashboard
                      className={cn(
                          "mr-2 h-5 w-5",
                          //value.toLowerCase() === line.name.toLowerCase() ? "opacity-100" : "opacity-0"
                      )}
                      />
                      <p className="text-base">Admin</p>
                  </CommandItem>

              </CommandGroup>
          </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
  
