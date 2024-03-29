"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { PermissionsDAO } from "@/services/permisions-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import ClientsPermissions from "./clients-users-permissions"


export const columns: ColumnDef<PermissionsDAO>[] = [
  
  {
    accessorKey: "userName",
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
      return (
        <div className="space-y-2">
          <p className="font-bold text-base mb-7">{data.userName}</p>
          <p>({data.userEmail})</p>
          <p>{data.userRole}</p>
        </div>
      )
    }
  },

  {
    accessorKey: "clients",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Clientes
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      const clients= data.clients
      if (!data.agencyId) return null

      return <ClientsPermissions userClients={clients} agencyId={data.agencyId} userId={data.userId} />
    },
  },

  {
    accessorKey: "userEmail",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Email
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "userRole",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Role
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]


