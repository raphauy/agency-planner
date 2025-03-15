"use client"

import { Input } from "@/components/ui/input"
import { ComercialDAO } from "@/services/comercial-services"
import { Search } from "lucide-react"
import { useState } from "react"
import ComercialCard from "./comercial-card"

type Props = {
    comercials: ComercialDAO[]
}

export default function ComercialList({ comercials }: Props) {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredComercials = comercials.filter(comercial => 
        comercial.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comercial.user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="w-full max-w-5xl mx-auto py-6 space-y-6">
            <div className="w-full max-w-md mx-auto px-4 relative">
                <Search className="absolute left-7 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Buscar comerciales..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10"
                />
            </div>
            
            <div className="grid grid-cols-1 gap-4 place-items-center">
                {filteredComercials.map((comercial) => (
                    <ComercialCard 
                        key={comercial.id} 
                        comercial={comercial} 
                    />
                ))}
            </div>
        </div>
    )
}