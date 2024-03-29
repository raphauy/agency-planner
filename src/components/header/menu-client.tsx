"use client"

import { useAdminRoles, useClientRoles } from "@/app/admin/users/use-roles"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UserRole } from "@prisma/client"
import { BriefcaseBusiness, LayoutDashboard, LockKeyhole, User } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"


export default function MenuClient() {
    
    const user= useSession().data?.user
    const userRole= user?.role
    const alowedRoles= useClientRoles()

    const clientSlug= useParams().clientSlug
    
    const path= usePathname()
    const params= useParams()
    const agencySlug= params.agencySlug
    if (!agencySlug)
        return <div>Agency not found</div>

    if (!clientSlug)
        return <div>Client not found</div>

    const data= [
        {
            href: `/${agencySlug}/${clientSlug}`,
            icon: LayoutDashboard,
            text: "Dashboard",
            roles: alowedRoles
        },
    ]
        
    return (
        <div className="flex items-center justify-between">
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
            <p className="mr-4">{user?.name} - {userRole}</p>
        </div>
    )
}

