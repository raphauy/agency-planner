"use client"

import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import { cn, getPostStatusColor } from "@/lib/utils"
import { updatePublicationStatus } from "@/services/publication-services"
import { useEffect, useState } from "react"
import { updatePublicationStatusAction } from "./publication-actions"
import { PublicationStatus } from "@prisma/client"
import { toast } from "@/components/ui/use-toast"

interface Props {
  id: string
  status: PublicationStatus
  onPost?: (id: string) => void
}
export function ClientPubStatusSelector({ id, status, onPost }: Props) {
  const [node, setNode] = useState<React.ReactNode>()  

  useEffect(() => {
    setNode(getNode(status))
  }, [status, id])
  

  function handleClick(status: PublicationStatus) {
    updatePublicationStatusAction(id, status)
    .then((res) => {
      if (res){
        toast({ title: "Publicación actualizada" })
        setNode(getNode(status))
        onPost && onPost(id)
      } else toast({ title: "Error al actualizar la publicación", variant: "destructive" })
    })    
  }
  return (
    <Menubar className="p-0 m-0 bg-transparent border-none">
      <MenubarMenu>
        <MenubarTrigger>
          <div>
          {node}
          </div>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => handleClick(PublicationStatus.APROBADO)}>
            {getNode(PublicationStatus.APROBADO)}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export function getNode(status: PublicationStatus) {
  const lightColor= getPostStatusColor(status, "0.3")
  const darkColor= getPostStatusColor(status)

  const res= (
    <div className={cn("flex w-36 justify-center text-gray-700 font-bold items-center h-6 gap-1 rounded-2xl cursor-pointer")} style={{ backgroundColor: lightColor }}>
      <p className={cn("w-2 h-2 rounded-full")} style={{ backgroundColor: darkColor }}></p>
      <p>{status}</p>
    </div>
  )  
  return res
}

