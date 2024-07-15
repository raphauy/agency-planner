"use client"

import { Button } from "@/components/ui/button"
import { UsageRecordDAO } from "@/services/usagerecord-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Bot, Database } from "lucide-react"
import { DeleteUsageRecordDialog, UsageRecordDialog } from "./usagerecord-dialogs"
import Link from "next/link"
import { es } from "date-fns/locale"
import { format, formatDistanceToNow } from "date-fns"


export const columns: ColumnDef<UsageRecordDAO>[] = [

  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Updated
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      const updated= formatDistanceToNow(data.updatedAt, { locale: es })
      const created= format(data.createdAt, "yyyy-MM-dd")
      return (
        <div>
          <p className="font-bold">{updated}</p>
          <p>{created}</p>
        </div>
      )
    }
  },    

  {
    accessorKey: "agency",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Agency
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      const url= data.url
      if (!url) return null
      const agencySlug= url.split("/")[1]
      return (
        <p>{agencySlug}</p>
      )
    },
    filterFn: (row, id, value) => {
      const url= row.original.url
      if (!url) return false
      const agencySlug= url.split("/")[1]
      return agencySlug.includes(value)
    },
  },

  {
    accessorKey: "client",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Client
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      const url= data.url
      if (!url) return null
      const clientSlug= url.split("/")[2]
      return (
        <p>{clientSlug}</p>
      )
    }
  },

  {
    accessorKey: "type",
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
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original.usageType.name)
    },
  },

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
      return (
        <div>
          <p>{data.credits.toFixed(2)} créditos</p>
          {data.usageType.name === "Storage" && <Database size={20} />}
          {data.usageType.name === "LLM" && <Bot size={20} />}
        </div>
      )
    }
  },

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


