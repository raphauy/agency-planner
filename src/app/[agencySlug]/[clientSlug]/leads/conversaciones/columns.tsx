"use client"

import { Button } from "@/components/ui/button"
import { formatWhatsAppStyle } from "@/lib/utils"
import { ConversationDAO } from "@/services/conversation-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Link from "next/link"

export const columns: ColumnDef<ConversationDAO>[] = [
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
              <Button variant="link" className="pl-0 dark:text-white">
                {data.phone.slice(0, 17)}
              </Button>
          </Link>
        </div>

      )
    },

  },
]
