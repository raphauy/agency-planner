"use client"

import { Button } from "@/components/ui/button"
import { NewsletterDAO } from "@/services/newsletter-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteNewsletterDialog, NewsletterDialog } from "./newsletter-dialogs"
import Link from "next/link"


export const columns: ColumnDef<NewsletterDAO>[] = [
  {
    accessorKey: "subject",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Asunto
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data= row.original
      return (
        <Link href={`newsletters/${data.id}`}>
          <Button variant="link" className="pl-0">
            {data.subject}
          </Button>
        </Link>
      )
    },
    filterFn: (row, id, value) => {
      const data = row.original
      const valueLower = value.toLowerCase()
      return !!(data.subject?.toLowerCase().includes(valueLower) ||
        data.clientId?.toLowerCase().includes(valueLower) ||
        data.sentByName?.toLowerCase().includes(valueLower) ||
        data.emailFrom?.toLowerCase().includes(valueLower) ||
        data.audience?.name?.toLowerCase().includes(valueLower)) 
    },
  },
  
  {
    accessorKey: "status",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Estado
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "audience",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Audiencia
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (<p>{data.audience?.name}</p>)
    }
  },

  {
    accessorKey: "sentByName",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Enviado por
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      const date= data.startedAt && format(new Date(data.startedAt), "yyyy-MM-dd")

      return (
        <div className="flex items-center gap-2">
          <p>{data.sentByName}</p>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
      )
    }
  },

  {
    accessorKey: "emailFrom",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            EmailFrom
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

      const deleteDescription= `Seguro que quieres eliminar el Newsletter ${data.subject}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <NewsletterDialog id={data.id} clientId={data.clientId} />
          <DeleteNewsletterDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


