"use client"

import { Button } from "@/components/ui/button"
import { ImportedContactDAO } from "@/services/imported-contacts-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { DeleteImportedContactDialog, ImportedContactDialog } from "./imported-contact-dialogs"
import { Badge } from "@/components/ui/badge"
import { ImportedContactStatus, ImportedContactType } from "@prisma/client"

export const columns: ColumnDef<ImportedContactDAO>[] = [
  
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
    accessorKey: "phone",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Teléfono (whatsapp)
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
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
      const tags= data.tags
      if (!tags || tags.length === 0) return null
      return (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index}>{tag}</Badge>
          ))}
        </div>
      )
    },
  },

  {
    accessorKey: "stageName",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Estado CRM
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      if (!data.stageName) return null
      return <Badge variant="stage">{data.stageName}</Badge>
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Estado de importación
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div>
          <Badge variant={
            data.status === ImportedContactStatus.PENDIENTE ? "statusPendiente" :
            data.status === ImportedContactStatus.PROCESADO ? "statusEnviado" :
            data.status === ImportedContactStatus.ERROR ? "statusError" :
            "secondary"}>{data.status}</Badge>
            {data.error && <p className="text-xs text-red-500">{data.error}</p>}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
},

  {
    accessorKey: "type",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tipo
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <Badge variant={data.type === ImportedContactType.API ? "api" :
          data.type === ImportedContactType.CSV ? "csv" :
          data.type === ImportedContactType.MANUAL ? "manual" :
          "secondary"}>
          {data.type}
        </Badge>
      )
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete ImportedContact ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <ImportedContactDialog clientId={data.clientId} id={data.id} />
          <DeleteImportedContactDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


