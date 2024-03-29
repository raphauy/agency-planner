"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Check, ChevronsRight, Loader } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useMemo, useState } from "react"
import { getUsersOfAgencyAction } from "../users/user-actions"
import { Button } from "@/components/ui/button"
import { setOwnerAction } from "./agency-actions"
import { toast } from "@/components/ui/use-toast"

export type UserSelectorData={
  id: string,
  name: string,
}

type Props= {
  agencyId: string
  closeDialog: () => void
}

export default function UserSelector({ agencyId, closeDialog }: Props) {
    const user= useSession().data?.user

    const [loading, setLoading] = useState(false)
    const [selectors, setSelectors] = useState<UserSelectorData[]>([])
    const [value, setValue] = useState("")
    const [searchValue, setSearchValue] = useState("")
    const [isPathAdmin, setIsPathAdmin]= useState(false)
    const [userId, setUserId] = useState("")

    useEffect(() => {
      getUsersOfAgencyAction(agencyId)
      .then((users) => {       
        setSelectors(users.map((user) => ({ id: user.id, name: user.name || user.email })))
      })
      .catch((error) => {
        console.error("Error getting users of agency", error)
      })
     
    }, [agencyId])

    const filteredValues = useMemo(() => {
        if (!searchValue) return selectors

        const lowerCaseSearchValue = searchValue.toLowerCase();
        return selectors.filter((line) => line.name.toLowerCase().includes(lowerCaseSearchValue))
    }, [selectors, searchValue])
  
    const customFilter = (searchValue: string, itemValue: string) => {      
      return itemValue.toLowerCase().includes(searchValue.toLowerCase()) ? searchValue.toLowerCase().length : 0
    }      
      
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value)
    }

    const isAdmin= user?.role === "ADMIN"
    if (!isAdmin && !isPathAdmin) return null

    function handleSubmit() {
      
      setLoading(true)
      setOwnerAction(agencyId, userId)
      .then(() => {
        toast({ title: "Owner updated" })
        closeDialog()
      })
      .catch((error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" })
      })
      .finally(() =>setLoading(false))
    }

    return (
      <div className="h-full flex flex-col justify-between gap-2">
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a user or search..." />
          <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                  {filteredValues.map((item, index) => {
                  if (index >= 10) return null
                  return (
                      <CommandItem
                      key={item.id}
                      onSelect={(currentValue) => {
                        if (currentValue === value) {
                          setValue("")
                        } else {
                          setValue(currentValue)
                        }
                        setSearchValue("")
                        setUserId(item.id)
                      }}
                      >
                      <Check className={cn("mr-2 h-4 w-4", value.toLowerCase() === item.name.toLowerCase() ? "opacity-100" : "opacity-0")}/>
                      {item.name}
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

        <div className="flex justify-end">
          <Button className="w-32 ml-2" onClick={handleSubmit}>
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Save</p>}
          </Button>
        </div>


      </div>

    )
  }
  
