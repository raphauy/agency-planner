"use client"

import { Button } from "@/components/ui/button"
import { PlanDAO } from "@/services/plan-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckIcon } from "lucide-react"
import { format } from "date-fns"
import { DeletePlanDialog, PlanDialog } from "./plan-dialogs"

import { SubscriptionsDialog } from "./plan-dialogs"
  

export const columns: ColumnDef<PlanDAO>[] = [
  
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
    cell: ({ row }) => {
      const data= row.original
      const features:string[]= data.features.split(",")
      return (
        <div>
          <p>{data.description}</p>
          <ul className="space-y-2 text-sm ml-5 mt-2">
            {
              features.map((feature, index) => {
                return (
                  <li key={index} className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                  )
              })
            }
            </ul>
          </div>
      )
    }
  },

  {
    accessorKey: "price",
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
          <p className="text-right">{data.price} {data.currency}</p>
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
            Limits
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
    accessorKey: "priceId",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            PriceId
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Plan ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <SubscriptionsDialog id={data.id} title={"Subscriptions"} />
  
          <PlanDialog id={data.id} />
          <DeletePlanDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


