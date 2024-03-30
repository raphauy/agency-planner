"use client"

import { Button } from "@/components/ui/button"
import { BillableItemDAO } from "@/services/billableitem-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteBillableItemDialog, BillableItemDialog } from "@/app/admin/billableitems/billableitem-dialogs"
import Link from "next/link"


export const columns: ColumnDef<BillableItemDAO>[] = [
  
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
      if (!data.client) return null

      return data.client.name
    },
    filterFn: (row, id, value) => {
      if (!row.original.client) return false
      
      return value.includes(row.original.client.name)
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
    accessorKey: "quantity",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Quantity
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "unitPrice",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            UnitPrice
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
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

  {
    accessorKey: "billingType",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Billing Type
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return data.billingType.name
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original.billingType.name)
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete BillableItem ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <BillableItemDialog id={data.id} />
          <DeleteBillableItemDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


