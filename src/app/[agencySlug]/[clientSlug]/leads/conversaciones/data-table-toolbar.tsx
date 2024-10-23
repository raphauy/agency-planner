"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  statuses?: string[]
}

export function DataTableToolbar<TData>({ table, statuses }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex gap-1 dark:text-white">
        <Input className="max-w-xs" placeholder="Filtrar celular..."
            value={(table.getColumn("phone")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("phone")?.setFilterValue(event.target.value)}                
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="w-4 h-4 ml-2" />
          </Button>
        )}
    </div>
  )
}