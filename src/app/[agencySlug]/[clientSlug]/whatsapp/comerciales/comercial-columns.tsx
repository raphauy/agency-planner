"use client"

import { Button } from "@/components/ui/button"
import { ComercialDAO } from "@/services/comercial-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteComercialDialog, ComercialDialog } from "./comercial-dialogs"


export const columns: ColumnDef<ComercialDAO>[] = [
  {
    accessorKey: "userId",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          UserId
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
    filterFn: (row, id, value) => {
      const data = row.original
      const valueLower = value.toLowerCase()
      return !!(data.userId?.toLowerCase().includes(valueLower) ||
        data.clientId?.toLowerCase().includes(valueLower))
    },
  },
  
  {
    accessorKey: "chatwootUserId",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            ChatwootUserId
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "activo",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Activo
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },
  // {
  //   accessorKey: "role",
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost" className="pl-0 dark:text-white"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
  //         Rol
  //         <ArrowUpDown className="w-4 h-4 ml-1" />
  //       </Button>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Comercial ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <DeleteComercialDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


