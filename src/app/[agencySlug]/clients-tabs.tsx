"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientDialog } from "./clients/client-dialogs"
import { ClientDAO } from "@/services/client-services"
import ClientsGrid from "./clients-grid"
import { columns } from "./clients/client-columns"
import { DataTable } from "./clients/client-table"
import { useState } from "react"
import { LayoutGrid, List, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Props= {
    agencyId: string
    clients: ClientDAO[]
}
export default function ClientsTabs({ agencyId, clients }: Props) {

    const [filteredClients, setfilteredClients] = useState<ClientDAO[]>(clients)
    const [showX, setShowX] = useState(false)
    const [inputValue, setInputValue] = useState("")
    function handleDeleteFilter() {
        setfilteredClients(clients)        
        setShowX(false)
        setInputValue("")
    }
    function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        if (value.length > 0) {
            setShowX(true)
            const filtered = clients.filter(client => client.name.toLowerCase().includes(value.toLowerCase()))
            setfilteredClients(filtered)
            setInputValue(value)
        } else {
            setShowX(false)
            setfilteredClients(clients)
            setInputValue("")
        }
    }
    return (
        <Tabs defaultValue="grid" className="mt-5 gap-4">
            <div className="flex justify-end gap-2 relative">
                <div className="relative w-full flex-grow">
                    <input type="text" placeholder="Buscar cliente..." 
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
                <ClientDialog igForm={true} agencyId={agencyId} />
            </div>
            <TabsContent value="grid">
            <ClientsGrid clients={filteredClients} />
            </TabsContent>

            <TabsContent value="list">
            <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
                <DataTable columns={columns} data={filteredClients} subject="Client" columnsOff={["slug"]} />
            </div>
            </TabsContent>
        </Tabs>

    )
}
