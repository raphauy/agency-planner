"use client"

import { Button } from "@/components/ui/button"
import { RepositoryDAO } from "@/services/repository-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil } from "lucide-react"
import Link from "next/link"
import { DeleteRepositoryDialog } from "./repository-dialogs"


export const columns: ColumnDef<RepositoryDAO>[] = [
  
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
    accessorKey: "functionName",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            FunctionName
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "functionDescription",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            FunctionDescription
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "executionResponse",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            ExecutionResponse
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

      const deleteDescription= `Seguro que quieres eliminar el repositorio ${data.name}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <Link href={`/admin/repositories/${data.id}`} prefetch={false} >
              <Button variant="link" className="h-10 w-full gap-2 text-muted-foreground">
                  <Pencil className="h-5 w-5" />
              </Button>
          </Link>

          <DeleteRepositoryDialog description={deleteDescription} id={data.id} withText={false} />
        </div>

      )
    },
  },
]


