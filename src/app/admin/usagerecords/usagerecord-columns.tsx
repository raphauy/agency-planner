"use client"

import { Button } from "@/components/ui/button"
import { UsageRecordDAO } from "@/services/usagerecord-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { DeleteUsageRecordDialog, UsageRecordDialog } from "./usagerecord-dialogs"
import Link from "next/link"


export const columns: ColumnDef<UsageRecordDAO>[] = [
  
  {
    accessorKey: "description",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Description
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "credits",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Credits
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (<p>{data.credits.toFixed(2)} créditos</p>)
    }
  },

  {
    accessorKey: "url",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Url
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      if (!data.url) return null
      return (
        <Link href={data.url} target="_blank" prefetch={false}>
          <Button variant="link">
            link
          </Button>
        </Link>
      )
    }
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

      const deleteDescription= `Do you want to delete UsageRecord ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <DeleteUsageRecordDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


