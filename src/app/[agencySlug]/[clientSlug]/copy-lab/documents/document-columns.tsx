"use client"

import { Button } from "@/components/ui/button"
import { DocumentDAO } from "@/services/document-services"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown, WholeWord } from "lucide-react"
import Link from "next/link"
import { DeleteDocumentDialog } from "./document-dialogs"
import { DocumentType } from "@prisma/client"


export const columns: ColumnDef<DocumentDAO>[] = [
  
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
      const path= data.type === DocumentType.COPY_LAB ? "copy-lab/documents" : "leads/documentos"
      return (
        <div className="">
          <Link href={`/${data.agencySlug}/${data.clientSlug}/${path}/${data.id}`}>
            <Button variant="link" className="text-left px-0">{data.name}</Button>
          </Link>
          <p className="">{data.wordsCount} palabras</p>
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
    cell: ({ row }) => {
      const data= row.original
      const dateStr= data.updatedAt && format(new Date(data.updatedAt), "dd MMM HH:mm")
      return (
        <div className="flex flex-col">
          <p className="line-clamp-4">{data.description}</p>
          <p className="text-right">Actualizado: {dateStr}</p>
        </div>
      )
    }
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Document ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <DeleteDocumentDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


