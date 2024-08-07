"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SubscriptionDAO } from "@/services/subscription-services"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown } from "lucide-react"
import { DeleteSubscriptionDialog, SubscriptionDialog } from "./subscription-dialogs"
import { Separator } from "@/components/ui/separator"


export const columns: ColumnDef<SubscriptionDAO>[] = [
  
  {
    accessorKey: "agency.name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Agency
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "stripeCustomerEmail",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Stripe email
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "planName",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Plan
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "planPrice",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Price
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="flex items-center">
          <p className="ml-2">{data.planPrice.toFixed(2)} {data.planCurrency}</p>
        </div>
      )
    }
  },

  {
    accessorKey: "maxClients",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            MaxClients
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="grid grid-cols-2 gap-2 w-44">
          <p>Clients:</p>
          <p>{data.maxClients}</p>
          <p>Credits:</p>
          <p>{data.maxCredits}</p>
          <p>LLM Credits:</p>
          <p>{data.maxLLMCredits}</p>
        </div>
      )
    }
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="w-full dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      const dateStr= format(data.stripePeriodEnd, "yyyy-MM-dd")
      return (
        <div className="flex flex-col items-center gap-2">
          <Badge className={cn(data.status === "CANCELLED" && "bg-red-500", data.status === "ACTIVE" && "bg-green-500")}>
            {data.status}
          </Badge>
          {
            data.canceledAt && 
            <div>
              <p>Canceled at:</p>
              <p>{format(data.canceledAt, "yyyy-MM-dd")}</p>
            </div>
          }

          <Separator className="my-2" />

          <div>
            <p>Period end:</p>
            <p>{dateStr}</p>
          </div>
          
        </div>
      )
    }
  },

  {
    accessorKey: "stripeSubscriptionId",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Stripe Subscription Id
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Subscription ${data.id}?`

      const isEditable= data.stripeSubscriptionId ? false : true
 
      if (!isEditable) return null
      
      return (
        <div className="flex items-center justify-end gap-2">
          <SubscriptionDialog id={data.id} />
          <DeleteSubscriptionDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


