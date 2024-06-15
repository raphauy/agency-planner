"use client"

import { Button } from "@/components/ui/button"
import { UserDAO } from "@/services/user-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteUserDialog, UserDialog } from "@/app/admin/users/user-dialogs"
import { UserRole } from "@prisma/client"
import { getLabel } from "@/lib/utils"


export const columns: ColumnDef<UserDAO>[] = [
  
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
  },

  {
    accessorKey: "email",
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
    accessorKey: "emailVerified",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Verificado
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
		cell: ({ row }) => {
      const data= row.original
      const date= data.emailVerified && format(new Date(data.emailVerified), "yyyy-MM-dd")
      return (<p>{date}</p>)
    }
  },

  {
    accessorKey: "role",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Rol
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (<p>{getLabel(data.role)}</p>)
    }
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Seguro que quieres eliminar el usuario ${data.name}? Se eliminarán todos sus comentarios en publicaciones.`

      const role= data.role
      const isAgencyOwner= role === "AGENCY_OWNER"      

      return (
        <div className="flex items-center justify-end gap-2">

          {/* <UserDialog id={data.id} /> */}
          {!isAgencyOwner && <DeleteUserDialog description={deleteDescription} id={data.id} />}          
        </div>

      )
    },
  },
]


