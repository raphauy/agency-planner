"use client"

import { Button } from "@/components/ui/button"
import { FunctionalityDAO } from "@/services/functionality-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteFunctionalityDialog, FunctionalityDialog } from "./functionality-dialogs"
import Image from "next/image"
import Link from "next/link"


export const columns: ColumnDef<FunctionalityDAO>[] = [
  
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      
      const shortName= data.name.length > 15 ? data.name.slice(0, 15) + "..." : data.name
      return (
        <div className="flex items-center min-w-40">
          {data.image && <Image src={data.image} alt={data.name} width={50} height={50} className="rounded-full" />}
          {shortName}
        </div>
        
      )
    }
  },

  {
    accessorKey: "slug",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Slug
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

      const deleteDescription= `Do you want to delete Functionality ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <FunctionalityDialog id={data.id} />
          <DeleteFunctionalityDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


