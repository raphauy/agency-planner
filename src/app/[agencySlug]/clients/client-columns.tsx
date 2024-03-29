"use client"

import { Button } from "@/components/ui/button"
import { ClientDAO } from "@/services/client-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteClientDialog, ClientDialog } from "./client-dialogs"

import { UsersDialog } from "./client-dialogs"
import Image from "next/image"
import Link from "next/link"
  

export const columns: ColumnDef<ClientDAO>[] = [
  
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
    cell: ({ row }) => {
      const data= row.original
      
      const shortName= data.name.length > 15 ? data.name.slice(0, 15) + "..." : data.name
      return (
        <div className="flex items-center min-w-40">
          {data.image && <Image src={data.image} alt={data.name} width={50} height={50} className="rounded-full" />}
          <Link href={`/${data.agency.slug}/${data.slug}`} prefetch={false}>
            <Button variant="link">
              {shortName}
            </Button>
          </Link>
        </div>
        
      )
    }
  },

  {
    accessorKey: "slug",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Slug
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
    accessorKey: "igHandle",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            IgHandle
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

      const deleteDescription= `Seguro que quieres eliminar el cliente ${data.name}`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <ClientDialog id={data.id} />
          <DeleteClientDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


