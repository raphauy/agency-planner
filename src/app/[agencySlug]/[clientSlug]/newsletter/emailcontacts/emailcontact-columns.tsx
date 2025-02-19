"use client"

import { Button } from "@/components/ui/button"
import { EmailContactDAO } from "@/services/emailcontact-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteEmailContactDialog, EmailContactDialog } from "./emailcontact-dialogs"
import { Badge } from "@/components/ui/badge"


export const columns: ColumnDef<EmailContactDAO>[] = [
  
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nombre
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
    filterFn: (row, id, value) => {
      const data = row.original
      const valueLower = value.toLowerCase()
      return !!(data.email?.toLowerCase().includes(valueLower) ||
        data.audienceId?.toLowerCase().includes(valueLower))
    },
  },

  {
    accessorKey: "unsubscribed",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Estado
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      const variant= data.unsubscribed ? "archived" : "outline"
      return (
        <Badge variant={variant} className="w-20 justify-center">
          {data.unsubscribed ? "Baja" : "Suscrito"}
        </Badge>
      )
    },
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

      const deleteDescription= `Do you want to delete EmailContact ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <EmailContactDialog id={data.id} audienceId={data.audienceId} />
          <DeleteEmailContactDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


