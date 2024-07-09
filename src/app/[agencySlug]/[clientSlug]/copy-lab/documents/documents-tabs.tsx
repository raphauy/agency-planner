"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { LayoutGrid, List, PlusCircle, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DocumentDAO } from "@/services/document-services"
import { DocumentDialog } from "./document-dialogs"
import { DataTable } from "./document-table"
import { columns } from "./document-columns"
import DocumentGrid from "./document-grid"

type Props= {
    documents: DocumentDAO[]
    clientId: string
}
export default function DocumentsTabs({ documents, clientId }: Props) {

    const [filteredDocs, setfilteredDocs] = useState<DocumentDAO[]>(documents)
    const [showX, setShowX] = useState(false)
    const [inputValue, setInputValue] = useState("")
    function handleDeleteFilter() {
        setfilteredDocs(documents)
        setShowX(false)
        setInputValue("")
    }
    function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        if (value.length > 0) {
            setShowX(true)
            const filtered = documents.filter(document => document.name.toLowerCase().includes(value.toLowerCase()))
            setfilteredDocs(filtered)
            setInputValue(value)
        } else {
            setShowX(false)
            setfilteredDocs(documents)
            setInputValue("")
        }
    }
    return (
        <Tabs defaultValue="grid" className="gap-4">
            <div className="flex justify-end gap-2 relative">
                <div className="relative w-full flex-grow">
                    <input type="text" placeholder="Buscar documento..." 
                        className="border pl-10 py-1 h-full rounded-md w-full" 
                        onChange={handleFilter}
                        value={inputValue}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                    <X 
                        className={cn("absolute right-3 top-2.5 text-gray-400 h-5 w-5 hover:cursor-pointer", showX ? "block" : "hidden")}
                        onClick={handleDeleteFilter} 
                    />

                </div>
                <TabsList className="bg-white border h-10">
                    <TabsTrigger value="grid" className="data-[state=active]:bg-gray-100"><LayoutGrid className="h-5 w-5" /></TabsTrigger>
                    <TabsTrigger value="list" className="data-[state=active]:bg-gray-100"><List className="h-5 w-5" /></TabsTrigger>
                </TabsList>

                <DocumentDialog clientId={clientId} />
            </div>
            <TabsContent value="grid">
                <DocumentGrid documents={filteredDocs} />
            </TabsContent>

            <TabsContent value="list">
                <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
                    <DataTable columns={columns} data={filteredDocs} subject="Repositorio" />
                </div>
            </TabsContent>
        </Tabs>

    )
}
