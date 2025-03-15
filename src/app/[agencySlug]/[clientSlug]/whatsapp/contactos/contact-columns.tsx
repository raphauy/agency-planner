"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ContactDAOWithStage } from "@/services/contact-services"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown } from "lucide-react"
import { DeleteContactDialog } from "./contact-dialogs"

  

export const columns: ColumnDef<ContactDAOWithStage>[] = [
  
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
          <Avatar>
            { data.imageUrl ? <AvatarImage src={data.imageUrl} /> : null }
            <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {data.name}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const name = row.original.name ?? ""
      const phone = row.original.phone ?? ""
      return name.toLowerCase().includes(value.toLowerCase()) || phone.toLowerCase().includes(value.toLowerCase())
    },
  },

  {
    accessorKey: "phone",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Teléfono
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Actualizado
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <p>{format(data.updatedAt, "yyyy/MM/dd")}</p>
      )
    }
  },

  {
    accessorKey: "stage",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Estado
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <Badge variant="stage">{data.stage.name}</Badge>
      )
    }
  },

  {
    accessorKey: "tags",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Etiquetas
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="flex items-center gap-2 flex-wrap">
          {data.tags.map((tag, index) => (
            <Badge key={index}>{tag}</Badge>
          ))}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const tags= row.original.tags.join(",")
      return tags.includes(value)
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original
      const deleteDescription= `Seguro que quieres eliminar el contacto ${data.name}? Ten en cuenta que esto eliminará todas las conversaciones asociadas a este contacto y la información del contacto que haya en las campañas.`
      return (
        <div className="flex items-center justify-end gap-2">
          <DeleteContactDialog description={deleteDescription} id={data.id} />
        </div>
      )
    },
  },

]


