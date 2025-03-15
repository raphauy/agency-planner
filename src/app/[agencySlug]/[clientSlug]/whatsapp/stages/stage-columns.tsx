"use client"

import { Button } from "@/components/ui/button"
import { StageDAO } from "@/services/stage-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { DeleteStageDialog, StageDialog } from "./stage-dialogs"


export const columns: ColumnDef<StageDAO>[] = [
  
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
  },

  {
    accessorKey: "order",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Order
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "isFinal",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            IsFinal
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "color",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Color
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

      const deleteDescription= `Do you want to delete Stage ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <StageDialog id={data.id} clientId={data.clientId} />
          <DeleteStageDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


