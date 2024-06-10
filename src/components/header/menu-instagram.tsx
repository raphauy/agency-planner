"use client"

import { useMenuClientRoles } from "@/app/admin/users/use-roles"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar, Grid3X3, LayoutDashboard, Newspaper, Server, Settings, Undo2 } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"


export default function MenuInstagram() {
    
    const user= useSession().data?.user
    const userRole= user?.role
    const alowedRoles= useMenuClientRoles()

    const path= usePathname()
    const params= useParams()

    const agencySlug= params.agencySlug as string
    if (!agencySlug)
        return <div>Agency not found</div>

    const clientSlug= params.clientSlug as string    
    if (!clientSlug)
        return <div>Client not found</div>

    const channel= path.split("/")[3]
    if (channel !== "instagram")
        return null

    const data= [
        {
            href: `/${agencySlug}/${clientSlug}`,
            icon: Undo2,
            text: `${unslug(clientSlug)}`,
            roles: alowedRoles
        },
        {
            href: `/${agencySlug}/${clientSlug}/instagram/posts`,
            icon: Grid3X3,
            text: "Feed",
            roles: alowedRoles
        },
        {
            href: `/${agencySlug}/${clientSlug}/instagram/calendario`,
            icon: Calendar,
            text: "Calendario",
            roles: alowedRoles
        },
    ]
        
    return (
        <div className="flex items-center">
            <nav>
                <ul className="flex items-center">
                    {data.map((item, index) => {
                        if (item.roles && userRole && !item.roles.includes(userRole))
                            return null
                        return (
                            <li key={index} className={cn("border-b-primary", path === item.href && "border-b-2")}>
                                <Link href={item.href}>
                                    <Button variant="ghost">
                                        <item.icon className="w-4 h-4 mr-1 mb-0.5" />
                                        {item.text}
                                    </Button>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </div>
    )
}

function unslug(slug: string) {
    // unslug and capitalize
    
    return slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}