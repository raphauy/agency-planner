"use client"

import { Button } from "@/components/ui/button"
import { EmailSendDAO } from "@/services/emailsend-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteEmailSendDialog, EmailSendDialog } from "./emailsend-dialogs"
import { Badge } from "@/components/ui/badge"


export const columns: ColumnDef<EmailSendDAO>[] = [
  {
    accessorKey: "to",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Destinatario
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data= row.original
      return (
        <div>
          <p>{data.name}</p>
          <p>{data.to}</p>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const data = row.original
      const valueLower = value.toLowerCase()
      return !!(data.to?.toLowerCase().includes(valueLower) ||
        data.subject?.toLowerCase().includes(valueLower) ||
        data.newsletterId?.toLowerCase().includes(valueLower))
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
    cell: ({ row }) => {
      const data= row.original
      const variant= data.status.toLowerCase() as "pending" | "opened" | "clicked" | "sent" | "delivered" | "delivered_delayed" | "complained" | "bounced" | "cancelled"
      return (<Badge variant={variant}>{data.status}</Badge>)
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "sentAt",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Fecha de envío
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
		cell: ({ row }) => {
      const data= row.original
      const date= data.sentAt && format(new Date(data.sentAt), "yyyy-MM-dd")
      return (<p>{date}</p>)
    }
  },
]


