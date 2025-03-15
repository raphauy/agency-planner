"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { RepositoryDAO } from "@/services/repository-services"
import { LayoutGrid, List, Search, X } from "lucide-react"
import { useState } from "react"
import RepoGrid from "./repo-grid"
import { columns } from "./repository-columns"
import { RepositoryDialog } from "./repository-dialogs"
import { DataTable } from "./repository-table"

type Props= {
    clientId: string
    repositories: RepositoryDAO[]
    basePath: string
}
export default function RepositoriesTabs({ clientId, repositories, basePath }: Props) {

    const [filteredRepos, setfilteredRepos] = useState<RepositoryDAO[]>(repositories)
    const [showX, setShowX] = useState(false)
    const [inputValue, setInputValue] = useState("")
    function handleDeleteFilter() {
        setfilteredRepos(repositories)
        setShowX(false)
        setInputValue("")
    }
    function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        if (value.length > 0) {
            setShowX(true)
            const filtered = repositories.filter(repository => repository.name.toLowerCase().includes(value.toLowerCase()))
            setfilteredRepos(filtered)
            setInputValue(value)
        } else {
            setShowX(false)
            setfilteredRepos(repositories)
            setInputValue("")
        }
    }
    return (
        <Tabs defaultValue="grid" className="mt-5 gap-4">
            <div className="flex justify-end gap-2 relative">
                <div className="relative w-full flex-grow">
                    <input type="text" placeholder="Buscar repositorio..." 
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

                <RepositoryDialog clientId={clientId} basePath={basePath} />
            </div>
            <TabsContent value="grid">
                <RepoGrid repositories={filteredRepos} basePath={basePath} />
            </TabsContent>

            <TabsContent value="list">
                <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
                    <DataTable columns={columns} data={filteredRepos} subject="Repositorio" />
                </div>
            </TabsContent>
        </Tabs>

    )
}
