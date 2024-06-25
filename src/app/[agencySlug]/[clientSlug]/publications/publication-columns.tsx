"use client"

import { Button } from "@/components/ui/button"
import { PublicationDAO } from "@/services/publication-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Camera, GalleryHorizontalEnd, Video } from "lucide-react"
import { format } from "date-fns"
import { DeletePublicationDialog, PublicationDialog } from "./publication-dialogs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"


export const columns: ColumnDef<PublicationDAO>[] = [
  
  {
    accessorKey: "title",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Título
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      const pathType= data.type === "INSTAGRAM_POST" ? "posts" : data.type === "INSTAGRAM_REEL" ? "reels" : data.type === "INSTAGRAM_STORY" ? "historias" : "feed"
      const images= data.images ? data.images.split(",") : []
      const firstImage= images.find(image => image.includes(".jpg") || image.includes(".png") || image.includes(".jpeg")) || "/image-placeholder.png"
      return (
        <Link href={`/${data.client.agency.slug}/${data.client.slug}/instagram/${pathType}?post=${data.id}`}>
          <div className="relative h-full overflow-hidden">
            <Button variant="link" className="px-0">{data.title}</Button>
            <Image src={firstImage} alt={data.title} width={200} height={200} className='overflow-hidden aspect-square object-cover h-20 w-20 rounded-md'/>
          </div>
        </Link>
      )  
    },
  },

  {
    accessorKey: "copy",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Copy
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "publicationDate",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Fecha
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
		cell: ({ row }) => {
      const data= row.original
      const date= data.publicationDate && format(new Date(data.publicationDate), "yyyy-MM-dd")
      return (<p>{date}</p>)
    }
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
      const imagesCount= data.images?.split(",").length || 0
      return (
        <div className="flex items-center">
        { data.type === "INSTAGRAM_POST" && 
        <div className="flex items-center gap-1">
          <Camera size={20} className="mb-0.5"/>
          {imagesCount > 0 && <p className="ml-1">#{imagesCount}</p>}
        </div>
        }
        { data.type === "INSTAGRAM_REEL" && <Video size={20} /> }
        { data.type === "INSTAGRAM_STORY" && <GalleryHorizontalEnd size={20} /> }
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "status",
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
      return (<Badge>{data.status}</Badge>)
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      return (
        <div className="flex items-center justify-end gap-2">

          <DeletePublicationDialog id={data.id} description={`Do you want to delete Publication ${data.title}?`} />
        </div>

      )
    },
  },
]


