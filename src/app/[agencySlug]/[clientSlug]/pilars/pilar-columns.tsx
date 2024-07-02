"use client"

import { Button } from "@/components/ui/button"
import { PilarDAO } from "@/services/pilar-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { DeletePilarDialog, PilarDialog } from "./pilar-dialogs"


export const columns: ColumnDef<PilarDAO>[] = [
  
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nombre
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full bg-[${data.color}]`} />
          <p className="ml-2">{data.name}</p>
        </div>
      )
    }
  },

  {
    accessorKey: "description",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Descripción
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Seguro que quieres eliminar el pilar ${data.name}`

      return (
        <div className="flex items-center justify-end gap-2">

          <PilarDialog id={data.id} />
          <DeletePilarDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


