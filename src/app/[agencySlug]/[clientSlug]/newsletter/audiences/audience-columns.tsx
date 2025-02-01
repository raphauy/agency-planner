"use client"

import { Button } from "@/components/ui/button"
import { AudienceDAO } from "@/services/audience-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteAudienceDialog, AudienceDialog } from "./audience-dialogs"
import Link from "next/link"


export const columns: ColumnDef<AudienceDAO>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data= row.original
      return (
        <Link href={`audiences/${data.id}`}>
          <Button variant="link" className="pl-0">
            {data.name}
          </Button>
        </Link>
      )
    },
    filterFn: (row, id, value) => {
      const data = row.original
      const valueLower = value.toLowerCase()
      return !!(data.name?.toLowerCase().includes(valueLower) ||
        data.clientId?.toLowerCase().includes(valueLower))
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

      const deleteDescription= `Do you want to delete Audience ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <AudienceDialog id={data.id} clientId={data.clientId} />
          <DeleteAudienceDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


