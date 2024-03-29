"use client"

import { Button } from "@/components/ui/button"
import { AgencyDAO } from "@/services/agency-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteAgencyDialog, AgencyDialog, UserSelectorDialog } from "./agency-dialogs"
import Image from "next/image"
import Link from "next/link"


export const columns: ColumnDef<AgencyDAO>[] = [
  
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
      if (!data.image) return null
      
      const shortName= data.name.length > 15 ? data.name.slice(0, 15) + "..." : data.name
      return (
        <div className="flex items-center min-w-40">
          <Image src={data.image} alt={data.name} width={50} height={50} className="rounded-full" />
          <Link href={`/${data.slug}`} prefetch={false}>
            <Button variant="link">
              {shortName}
            </Button>
          </Link>
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
            Instagram
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
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
    accessorKey: "owner",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Owner
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      if (!data.owner?.name) return null

      return (
        <div className="flex items-center">
          <p className="ml-2">{data.owner.name}</p>
        </div>
      )
    }
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Agency ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <UserSelectorDialog agencyId={data.id} />
          <AgencyDialog id={data.id} />
          <DeleteAgencyDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


