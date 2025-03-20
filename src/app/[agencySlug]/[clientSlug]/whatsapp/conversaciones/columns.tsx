"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatWhatsAppStyle } from "@/lib/utils"
import { ConversationDAO, ConversationShortDAO } from "@/services/conversation-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Link from "next/link"

export const columns: ColumnDef<ConversationShortDAO>[] = [
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="px-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Creado
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data= row.original
      return <p className="text-center">{formatWhatsAppStyle(data.updatedAt)}</p>
    }
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Celular
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )
    },
    cell: ({ row }) => {
      const data= row.original

      return (
        <div className="flex items-center justify-start flex-1">
          <Link href={`conversaciones?id=${data.id}`} prefetch={false}>
              <Button variant="link" className="pl-0 gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-200">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={data.imageUrl ?? ""} />
                    <AvatarFallback>
                      {data.name?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col items-start w-full text-left">
                  <p className="text-sm font-bold truncate max-w-[185px]">{data.name}</p>
                  <p>{data.phone}</p>
                </div>
              </Button>
          </Link>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const name = row.original.name ?? ""
      const phone = row.original.phone ?? ""
      return name.toLowerCase().includes(value.toLowerCase()) || phone.toLowerCase().includes(value.toLowerCase())
    }
  },
]
